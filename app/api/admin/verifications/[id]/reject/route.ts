import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';
import { logAdminEvent, AuditEvent } from '@/lib/audit';
import { sendEmail } from '@/lib/mailer';

// ---------------------------------------------------------------------------
// POST /api/admin/verifications/[id]/reject
// ---------------------------------------------------------------------------

const rejectSchema = z.object({
  reason: z.string().min(1, 'Rejection reason is required.').max(500).trim(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const session = await requireRole(req, 'ADMIN');
    const { id } = await params;
    const body = await req.json();

    const parsed = rejectSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const profile = await prisma.professionalProfile.findUnique({
      where: { id },
      include: { user: { select: { id: true, email: true, firstName: true } } },
    });

    if (!profile) {
      return Response.json({ error: 'Professional profile not found.' }, { status: 404 });
    }

    if (profile.prcStatus === 'REJECTED') {
      return Response.json({ error: 'This professional is already rejected.' }, { status: 409 });
    }

    await prisma.professionalProfile.update({
      where: { id },
      data: { prcStatus: 'REJECTED' },
    });

    // Audit log (reason is non-PHI metadata — safe to store)
    await logAdminEvent(
      AuditEvent.PROFESSIONAL_REJECTED,
      session.user.id,
      profile.user.id,
      { prcNumber: profile.prcNumber, reason: parsed.data.reason }
    );

    // Notify professional
    await sendEmail(
      profile.user.email,
      'Lunas — PRC Verification Update',
      `Dear ${profile.user.firstName},\n\n` +
        `Your PRC license verification (${profile.prcNumber}) was not approved.\n\n` +
        `Reason: ${parsed.data.reason}\n\n` +
        `If you believe this is an error, please contact the system administrator.\n\n` +
        `— Lunas Medical Passport System`
    );

    return Response.json({ message: 'Professional rejected and notified.' });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
