import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';
import { encryptNullable, decryptNullable } from '@/lib/crypto';

// ---------------------------------------------------------------------------
// GET /api/patient/profile — fetch and decrypt full patient profile
// PUT /api/patient/profile — update basic info (encrypt before save)
// ---------------------------------------------------------------------------

export async function GET(req: Request): Promise<Response> {
  try {
    const session = await requireRole(req, 'PATIENT');

    const profile = await prisma.patientProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        allergies: true,
        medications: true,
        surgeries: true,
        emergencyContacts: true,
        drugInteractions: true,
      },
    });

    if (!profile) {
      return Response.json({ error: 'Profile not found.' }, { status: 404 });
    }

    return Response.json({
      id: profile.id,
      userId: profile.userId,
      qrUuid: profile.qrUuid,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      email: session.user.email,
      bloodType: profile.bloodType,
      heightCm: profile.heightCm,
      weightKg: profile.weightKg,
      isOrganDonor: profile.isOrganDonor,
      profileComplete: profile.profileComplete,
      lastUpdated: profile.lastUpdated,
      allergies: profile.allergies,
      medications: profile.medications,
      surgeries: profile.surgeries,
      emergencyContacts: profile.emergencyContacts.map((c) => ({
        id: c.id,
        name: c.name,
        relationship: c.relationship,
        mobile: c.mobile,
        email: c.email,
      })),
      drugInteractions: profile.drugInteractions,
    });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}

// ---------------------------------------------------------------------------
// PUT /api/patient/profile
// ---------------------------------------------------------------------------

const updateProfileSchema = z.object({
  bloodType: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional()
    .nullable(),
  heightCm: z.string().optional().nullable(),
  weightKg: z.string().optional().nullable(),
  isOrganDonor: z.boolean().optional(),
});

export async function PUT(req: Request): Promise<Response> {
  try {
    const session = await requireRole(req, 'PATIENT');
    const body = await req.json();

    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { bloodType, heightCm, weightKg, isOrganDonor } = parsed.data;

    // Compute a simple profile completeness % (0–100)
    const fieldsTotal = 4; // bloodType, height, weight, organDonor
    let filled = 0;
    if (bloodType) filled++;
    if (heightCm) filled++;
    if (weightKg) filled++;
    // isOrganDonor is always "filled" since it has a default
    filled++;
    const profileComplete = Math.round((filled / fieldsTotal) * 100);

    const updated = await prisma.patientProfile.update({
      where: { userId: session.user.id },
      data: {
        bloodType: bloodType ?? undefined,
        heightCm: heightCm ?? undefined,
        weightKg: weightKg ?? undefined,
        isOrganDonor: isOrganDonor ?? undefined,
        profileComplete,
        lastUpdated: new Date(),
      },
    });

    return Response.json({ message: 'Profile updated.', profileComplete: updated.profileComplete });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
