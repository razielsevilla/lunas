import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/mailer';
import { sendSms } from '@/lib/sms';


// ---------------------------------------------------------------------------
// GET /api/scan/[uuid]
//
// Public endpoint for paramedics scanning a QR code.
// Returns ONLY the minimal unencrypted data needed to identify the patient
// before PIN entry. Does NOT return PHI.
// ---------------------------------------------------------------------------

export async function GET(
  req: Request,
  { params }: { params: Promise<{ uuid: string }> }
): Promise<Response> {
  const { uuid } = await params;

  try {
    // 1. Find the patient profile by QR UUID
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { qrUuid: uuid },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        emergencyContacts: {
          take: 1,
        },
      },
    });

    if (!patientProfile) {
      return Response.json({ error: 'QR Code invalid or expired.' }, { status: 404 });
    }

    // 2. We only send the first name and last name for the PIN screen.
    // We intentionally leave ALL medical data out of this response.
    const firstName = patientProfile.user.firstName || 'Unknown';
    const lastName = patientProfile.user.lastName || 'Patient';

    // 3. Return minimal identity data required for the PIN entry UI
    return Response.json(
      {
        id: patientProfile.userId,
        qrUuid: patientProfile.qrUuid,
        firstName,
        lastName,
        hasEmergencyContacts: patientProfile.emergencyContacts.length > 0,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[api/scan]', err);
    return Response.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Notification Stub
//
// In a real app, this would be invoked after a successful PIN entry
// by the paramedic to alert emergency contacts.
// ---------------------------------------------------------------------------

/**
 * Stubs out the notification to a patient's emergency contacts.
 *
 * @param patientProfileId - The ID of the patient profile whose contacts should be notified.
 */
async function notifyEmergencyContacts(patientProfileId: string) {
  try {
    const profile = await prisma.patientProfile.findUnique({
      where: { id: patientProfileId },
      include: { 
        user: true,
        emergencyContacts: {
          take: 1
        }
      },
    });

    if (!profile) {
      console.error('[notify] Patient profile not found:', patientProfileId);
      return;
    }

    const firstName = profile.user.firstName || 'A patient';
    const contact = profile.emergencyContacts[0];
    const contactName = contact?.name;
    const contactPhone = contact?.mobile;

    if (!contactPhone) {
      console.log('[notify] No primary emergency contact phone found for:', patientProfileId);
      return;
    }

    const message = `LUNAS ALERT: ${firstName}'s medical profile was just accessed by a medical professional. If this is unexpected, please contact support.`;
    
    // Attempt SMS
    console.log(`[notify] Attempting SMS to ${contactName || 'Contact'} at ${contactPhone}...`);
    await sendSms(contactPhone, message);

    // Attempt Email (using the user's email as a fallback if contact email isn't distinct)
    console.log(`[notify] Attempting Email to ${profile.user.email}...`);
    await sendEmail(
      profile.user.email,
      'Lunas Medical Profile Access Alert',
      message
    );
  } catch (err) {
    console.error('[notify] Failed to notify emergency contacts:', err);
  }
}
