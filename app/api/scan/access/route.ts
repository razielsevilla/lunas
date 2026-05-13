import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';
import { verifyPin } from '@/lib/auth';
import { logAdminEvent, AuditEvent, hashIpAddress } from '@/lib/audit';

// ---------------------------------------------------------------------------
// POST /api/scan/access
//
// The most critical endpoint in Lunas.
// Called when a verified professional submits their PIN after scanning a QR.
// On success: logs access, fires emergency contact notifications async,
//             and returns the decrypted patient record.
// ---------------------------------------------------------------------------

const accessSchema = z.object({
  qrUuid: z.string().uuid('Invalid QR UUID.'),
  pin: z
    .string()
    .min(6, 'PIN must be at least 6 characters.')
    .max(16, 'PIN must not exceed 16 characters.'),
});

const MAX_PIN_ATTEMPTS = 5;

export async function POST(req: Request): Promise<Response> {
  try {
    // 1. Require PROFESSIONAL session
    const session = await requireRole(req, 'PROFESSIONAL');

    const body = await req.json();
    const parsed = accessSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { qrUuid, pin } = parsed.data;
    const ipAddress = req.headers.get('x-forwarded-for') ?? '0.0.0.0';
    const ipHash = hashIpAddress(ipAddress);

    // 2. Find patient by QR UUID
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { qrUuid },
      include: {
        user: true,
        allergies: true,
        medications: true,
        surgeries: true,
        emergencyContacts: true,
        drugInteractions: true,
      },
    });

    if (!patientProfile) {
      return Response.json({ error: 'Invalid or expired QR code.' }, { status: 404 });
    }

    // 3. Find the professional's profile
    const professionalProfile = await prisma.professionalProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!professionalProfile) {
      return Response.json({ error: 'Professional profile not found.' }, { status: 404 });
    }

    // 4. Check PRC status — only VERIFIED professionals can access records
    if (professionalProfile.prcStatus !== 'VERIFIED') {
      return Response.json(
        { error: 'Your PRC license is not yet verified. Access denied.' },
        { status: 403 }
      );
    }

    // 5. Check lockout — if pinFailCount >= MAX_PIN_ATTEMPTS
    if (professionalProfile.pinFailCount >= MAX_PIN_ATTEMPTS) {
      await logAdminEvent(
        AuditEvent.FAILED_PIN_LOCKOUT,
        session.user.id,
        patientProfile.userId,
        { prcNumber: professionalProfile.prcNumber, ipHash }
      );

      await createAccessLog(patientProfile.id, professionalProfile.id, 'LOCKED', ipHash);

      return Response.json(
        {
          error:
            'Your account is locked due to too many failed PIN attempts. Contact support.',
          locked: true,
        },
        { status: 423 }
      );
    }

    // 6. Verify PIN
    if (!professionalProfile.pin) {
      return Response.json(
        { error: 'No PIN set for this account. Contact admin.' },
        { status: 403 }
      );
    }

    const pinValid = await verifyPin(pin, professionalProfile.pin);

    if (!pinValid) {
      // Increment fail counter
      await prisma.professionalProfile.update({
        where: { id: professionalProfile.id },
        data: { pinFailCount: { increment: 1 } },
      });

      const attemptsLeft = MAX_PIN_ATTEMPTS - (professionalProfile.pinFailCount + 1);

      await logAdminEvent(
        AuditEvent.QR_ACCESS_DENIED,
        session.user.id,
        patientProfile.userId,
        { prcNumber: professionalProfile.prcNumber, attemptsLeft, ipHash }
      );

      await createAccessLog(patientProfile.id, professionalProfile.id, 'DENIED', ipHash);

      return Response.json(
        {
          error: `Incorrect PIN. ${attemptsLeft > 0 ? `${attemptsLeft} attempt(s) remaining.` : 'Account will be locked on next attempt.'}`,
          attemptsLeft: Math.max(0, attemptsLeft),
        },
        { status: 401 }
      );
    }

    // 7. SUCCESS — reset fail counter, log access
    await prisma.professionalProfile.update({
      where: { id: professionalProfile.id },
      data: { pinFailCount: 0 },
    });

    await logAdminEvent(
      AuditEvent.QR_ACCESS_SUCCESS,
      session.user.id,
      patientProfile.userId,
      { prcNumber: professionalProfile.prcNumber, ipHash }
    );

    await createAccessLog(patientProfile.id, professionalProfile.id, 'SUCCESS', ipHash);

    // 8. Fire emergency contact notifications asynchronously (do NOT await — must not delay response)
    notifyEmergencyContacts(patientProfile.id).catch((err) =>
      console.error('[scan/access] notifyEmergencyContacts failed:', err)
    );

    // 9. Return decrypted patient record
    return Response.json({
      success: true,
      patient: {
        id: patientProfile.userId,
        firstName: patientProfile.user.firstName,
        lastName: patientProfile.user.lastName,
        bloodType: patientProfile.bloodType,
        heightCm: patientProfile.heightCm,
        weightKg: patientProfile.weightKg,
        isOrganDonor: patientProfile.isOrganDonor,
        allergies: patientProfile.allergies,
        medications: patientProfile.medications,
        surgeries: patientProfile.surgeries,
        drugInteractions: patientProfile.drugInteractions,
        emergencyContacts: patientProfile.emergencyContacts.map((c) => ({
          name: c.name,
          relationship: c.relationship,
          // Per SECURITY.md: mobile/email of contacts not returned to professional
          // They are notified directly by the server
        })),
      },
    });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function createAccessLog(
  patientProfileId: string,
  professionalProfileId: string,
  status: 'SUCCESS' | 'DENIED' | 'LOCKED',
  ipHash: string
) {
  await prisma.accessLog.create({
    data: {
      patientProfileId,
      professionalProfileId,
      status,
      ipHash,
    },
  }).catch((err) => console.error('[scan/access] accessLog write failed:', err));
}

// ---------------------------------------------------------------------------
// notifyEmergencyContacts — imported by other modules too
// Fetches real emergency contacts from DB and sends SMS + Email.
// ---------------------------------------------------------------------------

async function notifyEmergencyContacts(patientProfileId: string): Promise<void> {
  const { sendEmail } = await import('@/lib/mailer');
  const { sendSms } = await import('@/lib/sms');

  const profile = await prisma.patientProfile.findUnique({
    where: { id: patientProfileId },
    include: {
      user: { select: { firstName: true, email: true } },
      emergencyContacts: true,
    },
  });

  if (!profile || profile.emergencyContacts.length === 0) {
    console.log('[notify] No emergency contacts for profile:', patientProfileId);
    return;
  }

  const patientFirstName = profile.user.firstName;
  const message = `LUNAS MEDICAL ALERT: ${patientFirstName}'s medical passport was accessed by a verified medical professional. If this is unexpected, please contact support immediately.`;

  // Notify all emergency contacts
  for (const contact of profile.emergencyContacts) {
    // SMS
    await sendSms(contact.mobile, message).catch((err) =>
      console.error(`[notify] SMS to ${contact.name} failed:`, err)
    );

    // Email (if contact has one)
    if (contact.email) {
      await sendEmail(
        contact.email,
        'Lunas — Medical Profile Access Alert',
        message
      ).catch((err) =>
        console.error(`[notify] Email to ${contact.name} failed:`, err)
      );
    }
  }

  // Also notify the patient themselves
  await sendEmail(
    profile.user.email,
    'Lunas — Your Medical Profile Was Accessed',
    `${message}\n\nIf you authorized this access, no action is required. If not, please log in to your Lunas account and review your access logs.`
  ).catch((err) => console.error('[notify] Patient email failed:', err));

  console.log(
    `[notify] Notified ${profile.emergencyContacts.length} contact(s) for patient ${patientProfileId}`
  );
}
