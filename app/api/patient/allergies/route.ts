import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';
import { Allergyseverity } from '@prisma/client';

// ---------------------------------------------------------------------------
// POST /api/patient/allergies — add an allergy to the patient's profile
// ---------------------------------------------------------------------------

const addAllergySchema = z.object({
  allergen: z.string().min(1).max(200).trim(),
  reaction: z.string().max(500).trim().optional(),
  severity: z.nativeEnum(Allergyseverity),
});

export async function POST(req: Request): Promise<Response> {
  try {
    const session = await requireRole(req, 'PATIENT');
    const body = await req.json();

    const parsed = addAllergySchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    // Resolve the patient's profile ID
    const profile = await prisma.patientProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!profile) {
      return Response.json({ error: 'Patient profile not found.' }, { status: 404 });
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
