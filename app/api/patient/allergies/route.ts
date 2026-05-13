import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';
import { HTTP, parseBody } from '@/lib/api';
import { Allergyseverity } from '@prisma/client';

// ---------------------------------------------------------------------------
// POST /api/patient/allergies
// ---------------------------------------------------------------------------

const addAllergySchema = z.object({
  allergen: z
    .string({ required_error: 'Allergen is required.' })
    .min(1, 'Allergen cannot be empty.')
    .max(200, 'Allergen must be 200 characters or less.')
    .trim(),
  reaction: z
    .string()
    .max(500, 'Reaction description must be 500 characters or less.')
    .trim()
    .optional(),
  severity: z.nativeEnum(Allergyseverity, {
    errorMap: () => ({
      message: 'Severity must be one of: MILD, MODERATE, SEVERE, LIFE_THREATENING.',
    }),
  }),
});

export async function POST(req: Request): Promise<Response> {
  try {
    const session = await requireRole(req, 'PATIENT');

    const parsed = await parseBody(req, addAllergySchema);
    if (parsed.response) return parsed.response;

    const profile = await prisma.patientProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!profile) return HTTP.notFound('Patient profile');

    // Prevent exact duplicate allergens for this patient
    const duplicate = await prisma.allergy.findFirst({
      where: {
        patientProfileId: profile.id,
        allergen: { equals: parsed.data.allergen, mode: 'insensitive' },
      },
    });

    if (duplicate) {
      return HTTP.conflict(`An allergy to "${parsed.data.allergen}" is already recorded.`);
    }

    const allergy = await prisma.allergy.create({
      data: {
        patientProfileId: profile.id,
        allergen: parsed.data.allergen,
        reaction: parsed.data.reaction ?? null,
        severity: parsed.data.severity,
      },
    });

    return Response.json(allergy, { status: 201 });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
