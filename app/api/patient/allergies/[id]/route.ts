import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';
import { HTTP } from '@/lib/api';

// ---------------------------------------------------------------------------
// DELETE /api/patient/allergies/[id]
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

    if (!profile) return HTTP.notFound('Patient profile');

    const allergy = await prisma.allergy.findFirst({
      where: { id, patientProfileId: profile.id },
    });

    if (!allergy) return HTTP.notFound('Allergy');

    if (allergy.patientProfileId !== profile.id) {
      return HTTP.forbidden('You do not have permission to delete this allergy.');
    }

    await prisma.allergy.delete({ where: { id } });

    return Response.json({
      message: `Allergy "${allergy.allergen}" removed successfully.`,
    });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
