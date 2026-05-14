import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse, hashPassword } from '@/lib/auth';
import { logAdminEvent, AuditEvent } from '@/lib/audit';
import { sendEmail } from '@/lib/mailer';

// ---------------------------------------------------------------------------
// POST /api/admin/verifications/[id]/approve
//
// Approve flow:
//   1. Set prcStatus → VERIFIED
//   2. Generate a random 6-digit PIN
//   3. Hash it with bcrypt
//   4. Store the hash in professionalProfile.pin
//   5. Email the plaintext PIN to the professional
// ---------------------------------------------------------------------------

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const session = await requireRole(req, 'ADMIN');
    const { id } = await params;

    // Find the professional profile
    const profile = await prisma.professionalProfile.findUnique({
      where: { id },
      include: { user: { select: { id: true, email: true, firstName: true } } },
    });

    if (!profile) {
      return Response.json({ error: 'Professional profile not found.' }, { status: 404 });
    }

    if (profile.prcStatus === 'VERIFIED') {
      return Response.json({ error: 'This professional is already verified.' }, { status: 409 });
    }

    // Update profile: set verified
    await prisma.professionalProfile.update({
      where: { id },
      data: {
        prcStatus: 'VERIFIED',
        pinFailCount: 0,
        verifiedAt: new Date(),
      },
    });

    // Audit log
    await logAdminEvent(
      AuditEvent.PROFESSIONAL_APPROVED,
      session.user.id,
      profile.user.id,
      { prcNumber: profile.prcNumber }
    );

    // Email the professional
    await sendEmail(
      profile.user.email,
      'Lunas — Your PRC Verification is Approved',
      `Congratulations, ${profile.user.firstName}!\n\n` +
        `Your PRC license (${profile.prcNumber}) has been verified.\n\n` +
        `You can now access patient medical records using the 6-digit PIN you created during registration.\n\n` +
        `— Lunas Medical Passport System`
    );

    return Response.json({
      message: 'Professional approved.',
      prcNumber: profile.prcNumber,
    });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
