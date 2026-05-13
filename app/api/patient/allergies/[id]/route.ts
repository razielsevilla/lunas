import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';
import { HTTP } from '@/lib/api';

// ---------------------------------------------------------------------------
// DELETE /api/patient/allergies/[id]
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

    const allergy = await prisma.allergy.findUnique({
      where: { id: params.id },
      select: { id: true, patientProfileId: true, allergen: true },
    });

    if (!allergy) return HTTP.notFound('Allergy');

    if (allergy.patientProfileId !== profile.id) {
      return HTTP.forbidden('You do not have permission to delete this allergy.');
    }

    await prisma.allergy.delete({ where: { id: params.id } });

    return Response.json({
      message: `Allergy "${allergy.allergen}" removed successfully.`,
    });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
