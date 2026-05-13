import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';

// ---------------------------------------------------------------------------
// DELETE /api/patient/emergency-contacts/[id]
// ---------------------------------------------------------------------------

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const session = await requireRole(req, 'PATIENT');
    const { id } = await params;

    const profile = await prisma.patientProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!profile) {
      return Response.json({ error: 'Patient profile not found.' }, { status: 404 });
    }

    const contact = await prisma.emergencyContact.findFirst({
      where: { id, patientProfileId: profile.id },
    });

    if (!contact) {
      return Response.json({ error: 'Emergency contact not found.' }, { status: 404 });
    }

    await prisma.emergencyContact.delete({ where: { id } });

    return Response.json({ message: 'Emergency contact removed.' });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
