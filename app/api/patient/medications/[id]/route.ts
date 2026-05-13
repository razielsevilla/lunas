import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';
import { HTTP } from '@/lib/api';
import { checkInteractionsLocal } from '@/lib/drugcheck';
import { InteractionSeverity } from '@prisma/client';

// ---------------------------------------------------------------------------
// DELETE /api/patient/medications/[id]
// After deletion, re-runs the drug interaction check on remaining medications.
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

    const medication = await prisma.medication.findUnique({
      where: { id: params.id },
      select: { id: true, patientProfileId: true, name: true },
    });

    if (!medication) return HTTP.notFound('Medication');

    if (medication.patientProfileId !== profile.id) {
      return HTTP.forbidden('You do not have permission to delete this medication.');
    }

    await prisma.medication.delete({ where: { id: params.id } });

    // Re-run interaction check on remaining medications
    const remaining = await prisma.medication.findMany({
      where: { patientProfileId: profile.id },
      select: { name: true },
    });

    const interactions = checkInteractionsLocal(remaining.map((m) => m.name));

    await prisma.$transaction([
      prisma.drugInteraction.deleteMany({ where: { patientProfileId: profile.id } }),
      ...(interactions.length > 0
        ? [
            prisma.drugInteraction.createMany({
              data: interactions.map((i) => ({
                patientProfileId: profile.id,
                drug1Name: i.drug1Name,
                drug2Name: i.drug2Name,
                severity: i.severity as InteractionSeverity,
                description: i.description,
              })),
            }),
          ]
        : []),
    ]);

    return Response.json({
      message: `"${medication.name}" removed successfully.`,
      interactionsRemaining: interactions.length,
    });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
