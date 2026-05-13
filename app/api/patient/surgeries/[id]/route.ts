import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';

// ---------------------------------------------------------------------------
// DELETE /api/patient/surgeries/[id]
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

    const surgery = await prisma.surgery.findFirst({
      where: { id, patientProfileId: profile.id },
    });

    if (!surgery) {
      return Response.json({ error: 'Surgery record not found.' }, { status: 404 });
    }

    await prisma.surgery.delete({ where: { id } });

    return Response.json({ message: 'Surgery record removed.' });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
