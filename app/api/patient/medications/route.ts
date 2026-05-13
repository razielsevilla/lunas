import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';
import { checkInteractions } from '@/lib/drugcheck';
import { InteractionSeverity } from '@prisma/client';

// ---------------------------------------------------------------------------
// POST /api/patient/medications — add a medication + run drug interaction check
// ---------------------------------------------------------------------------

const addMedicationSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  rxNormCode: z.string().max(20).trim().optional(),
  dosage: z.string().max(100).trim().optional(),
  frequency: z.string().max(100).trim().optional(),
  prescribedFor: z.string().max(300).trim().optional(),
});

export async function POST(req: Request): Promise<Response> {
  try {
    const session = await requireRole(req, 'PATIENT');
    const body = await req.json();

    const parsed = addMedicationSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    // Resolve the patient's profile
    const profile = await prisma.patientProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
      // Include existing medications for interaction check
    });

    if (!profile) {
      return Response.json({ error: 'Patient profile not found.' }, { status: 404 });
    }

    // Create the medication first
    const medication = await prisma.medication.create({
      data: {
        patientProfileId: profile.id,
        name: parsed.data.name,
        rxNormCode: parsed.data.rxNormCode ?? null,
        dosage: parsed.data.dosage ?? null,
        frequency: parsed.data.frequency ?? null,
        prescribedFor: parsed.data.prescribedFor ?? null,
      },
    });

    // Fetch all current medications (including newly added) for interaction check
    const allMeds = await prisma.medication.findMany({
      where: { patientProfileId: profile.id },
      select: { name: true },
    });

    const drugNames = allMeds.map((m) => m.name);

    // Run drug interaction check (local fallback by default, DrugBank if key set)
    const interactions = await checkInteractions(drugNames);

    // Rebuild DrugInteraction table for this patient (clear old → insert fresh)
    if (drugNames.length >= 2) {
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
    }

    return Response.json(
      {
        medication,
        interactions,
        interactionCount: interactions.length,
      },
      { status: 201 }
    );
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
