import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';
import { HTTP, parseBody } from '@/lib/api';
import { checkInteractions } from '@/lib/drugcheck';
import { InteractionSeverity } from '@prisma/client';

// ---------------------------------------------------------------------------
// POST /api/patient/medications
// ---------------------------------------------------------------------------

const addMedicationSchema = z.object({
  name: z
    .string({ required_error: 'Medication name is required.' })
    .min(1, 'Medication name cannot be empty.')
    .max(200, 'Medication name must be 200 characters or less.')
    .trim(),
  rxNormCode: z.string().max(20, 'RxNorm code must be 20 characters or less.').trim().optional(),
  dosage: z.string().max(100, 'Dosage must be 100 characters or less.').trim().optional(),
  frequency: z.string().max(100, 'Frequency must be 100 characters or less.').trim().optional(),
  prescribedFor: z
    .string()
    .max(300, 'Prescribed-for must be 300 characters or less.')
    .trim()
    .optional(),
});

export async function POST(req: Request): Promise<Response> {
  try {
    const session = await requireRole(req, 'PATIENT');

    const parsed = await parseBody(req, addMedicationSchema);
    if (parsed.response) return parsed.response;

    const profile = await prisma.patientProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!profile) return HTTP.notFound('Patient profile');

    // Prevent adding the same medication twice
    const duplicate = await prisma.medication.findFirst({
      where: {
        patientProfileId: profile.id,
        name: { equals: parsed.data.name, mode: 'insensitive' },
      },
    });

    if (duplicate) {
      return HTTP.conflict(`"${parsed.data.name}" is already in your medication list.`);
    }

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

    // Re-run drug interaction check across all medications
    const allMeds = await prisma.medication.findMany({
      where: { patientProfileId: profile.id },
      select: { name: true },
    });

    const drugNames = allMeds.map((m) => m.name);
    const interactions = await checkInteractions(drugNames);

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
        warning:
          interactions.some((i) => i.severity === 'CONTRAINDICATED')
            ? 'CONTRAINDICATED interaction detected. Consult a physician immediately.'
            : interactions.some((i) => i.severity === 'HIGH')
            ? 'HIGH severity interaction detected. Review with prescriber.'
            : null,
      },
      { status: 201 }
    );
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
