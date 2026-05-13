import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';
import { HTTP } from '@/lib/api';

// ---------------------------------------------------------------------------
// DELETE /api/patient/surgeries/[id]
// ---------------------------------------------------------------------------

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const session = await requireRole(req, 'PATIENT');

    const profile = await prisma.patientProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!profile) return HTTP.notFound('Patient profile');

    const surgery = await prisma.surgery.findUnique({
      where: { id: params.id },
      select: { id: true, patientProfileId: true, procedure: true },
    });

    if (!surgery) return HTTP.notFound('Surgery record');

    if (surgery.patientProfileId !== profile.id) {
      return HTTP.forbidden('You do not have permission to delete this surgery record.');
    }

    await prisma.surgery.delete({ where: { id: params.id } });

    return Response.json({
      message: `Surgery record "${surgery.procedure}" removed successfully.`,
    });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
