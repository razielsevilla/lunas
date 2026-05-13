import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';
import { checkInteractions } from '@/lib/drugcheck';
import { InteractionSeverity } from '@prisma/client';

// ---------------------------------------------------------------------------
// DELETE /api/patient/medications/[id]
// Re-runs drug interaction check after removal (interactions may clear)
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

    if (!profile) {
      return Response.json({ error: 'Patient profile not found.' }, { status: 404 });
    }

    // Ownership check
    const medication = await prisma.medication.findFirst({
      where: { id: params.id, patientProfileId: profile.id },
    });

    if (!medication) {
      return Response.json({ error: 'Medication not found.' }, { status: 404 });
    }

    await prisma.medication.delete({ where: { id: params.id } });

    // Re-check interactions with remaining medications
    const remaining = await prisma.medication.findMany({
      where: { patientProfileId: profile.id },
      select: { name: true },
    });

    const drugNames = remaining.map((m) => m.name);

    if (drugNames.length >= 2) {
      const interactions = await checkInteractions(drugNames);
      await prisma.$transaction([
        prisma.drugInteraction.deleteMany({ where: { patientProfileId: profile.id } }),
        prisma.drugInteraction.createMany({
          data: interactions.map((i) => ({
            patientProfileId: profile.id,
            drug1Name: i.drug1Name,
            drug2Name: i.drug2Name,
            severity: i.severity as InteractionSeverity,
            description: i.description,
          })),
        }),
      ]);
    } else {
      // Only 0–1 medications left — clear all interactions
      await prisma.drugInteraction.deleteMany({ where: { patientProfileId: profile.id } });
    }

    return Response.json({ message: 'Medication removed and interactions updated.' });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
