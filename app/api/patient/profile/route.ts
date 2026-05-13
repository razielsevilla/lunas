import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';
import { HTTP, parseBody } from '@/lib/api';

// ---------------------------------------------------------------------------
// GET /api/patient/profile — fetch full decrypted patient profile
// PUT /api/patient/profile — update basic vitals
// ---------------------------------------------------------------------------

export async function GET(req: Request): Promise<Response> {
  try {
    const session = await requireRole(req, 'PATIENT');

    const profile = await prisma.patientProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        allergies: { orderBy: { createdAt: 'desc' } },
        medications: { orderBy: { createdAt: 'desc' } },
        surgeries: { orderBy: { createdAt: 'desc' } },
        emergencyContacts: true,
        drugInteractions: { orderBy: { checkedAt: 'desc' } },
      },
    });

    if (!profile) {
      return HTTP.notFound('Patient profile');
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
      emergencyContacts: profile.emergencyContacts,
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
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
      errorMap: () => ({ message: 'Blood type must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-.' }),
    })
    .nullable()
    .optional(),
  heightCm: z
    .string()
    .max(10, 'Height must be 10 characters or less.')
    .regex(/^\d+(\.\d+)?$/, 'Height must be a numeric value (e.g. 170 or 170.5).')
    .nullable()
    .optional(),
  weightKg: z
    .string()
    .max(10, 'Weight must be 10 characters or less.')
    .regex(/^\d+(\.\d+)?$/, 'Weight must be a numeric value (e.g. 68 or 68.5).')
    .nullable()
    .optional(),
  isOrganDonor: z.boolean().optional(),
});

export async function PUT(req: Request): Promise<Response> {
  try {
    const session = await requireRole(req, 'PATIENT');

    const parsed = await parseBody(req, updateProfileSchema);
    if (parsed.response) return parsed.response;

    const { bloodType, heightCm, weightKg, isOrganDonor } = parsed.data;

    // Recalculate profile completeness
    const current = await prisma.patientProfile.findUnique({
      where: { userId: session.user.id },
      select: { bloodType: true, heightCm: true, weightKg: true },
    });

    if (!current) return HTTP.notFound('Patient profile');

    const finalBloodType  = bloodType  !== undefined ? bloodType  : current.bloodType;
    const finalHeightCm   = heightCm   !== undefined ? heightCm   : current.heightCm;
    const finalWeightKg   = weightKg   !== undefined ? weightKg   : current.weightKg;

    const fieldsTotal = 4;
    let filled = (isOrganDonor !== undefined ? 1 : 1); // isOrganDonor always counts
    if (finalBloodType) filled++;
    if (finalHeightCm)  filled++;
    if (finalWeightKg)  filled++;
    const profileComplete = Math.min(100, Math.round((filled / fieldsTotal) * 100));

    const updated = await prisma.patientProfile.update({
      where: { userId: session.user.id },
      data: {
        ...(bloodType    !== undefined && { bloodType:    bloodType    ?? undefined }),
        ...(heightCm     !== undefined && { heightCm:     heightCm     ?? undefined }),
        ...(weightKg     !== undefined && { weightKg:     weightKg     ?? undefined }),
        ...(isOrganDonor !== undefined && { isOrganDonor: isOrganDonor }),
        profileComplete,
        lastUpdated: new Date(),
      },
    });

    return Response.json({
      message: 'Profile updated successfully.',
      profileComplete: updated.profileComplete,
    });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
