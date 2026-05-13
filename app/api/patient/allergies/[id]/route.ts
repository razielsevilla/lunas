import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';

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

    // Ensure the allergy belongs to this patient before deleting
    const profile = await prisma.patientProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!profile) {
      return Response.json({ error: 'Patient profile not found.' }, { status: 404 });
    }

    const allergy = await prisma.allergy.findFirst({
      where: { id, patientProfileId: profile.id },
    });

    if (!allergy) {
      return Response.json({ error: 'Allergy not found.' }, { status: 404 });
    }

    await prisma.allergy.delete({ where: { id } });

    return Response.json({ message: 'Allergy removed.' });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
