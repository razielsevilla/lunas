import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';
import { HTTP, parseBody } from '@/lib/api';

// ---------------------------------------------------------------------------
// POST /api/patient/surgeries
// ---------------------------------------------------------------------------

const addSurgerySchema = z.object({
  procedure: z
    .string({ required_error: 'Procedure name is required.' })
    .min(1, 'Procedure name cannot be empty.')
    .max(300, 'Procedure must be 300 characters or less.')
    .trim(),
  datePerformed: z
    .string()
    .max(20)
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'Date must be in YYYY-MM-DD format (e.g. 2022-03-15).'
    )
    .optional(),
  hospital: z.string().max(200, 'Hospital name must be 200 characters or less.').trim().optional(),
  notes: z.string().max(1000, 'Notes must be 1000 characters or less.').trim().optional(),
});

export async function POST(req: Request): Promise<Response> {
  try {
    const session = await requireRole(req, 'PATIENT');

    const parsed = await parseBody(req, addSurgerySchema);
    if (parsed.response) return parsed.response;

    const profile = await prisma.patientProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!profile) return HTTP.notFound('Patient profile');

    const surgery = await prisma.surgery.create({
      data: {
        patientProfileId: profile.id,
        procedure: parsed.data.procedure,
        datePerformed: parsed.data.datePerformed ?? null,
        hospital: parsed.data.hospital ?? null,
        notes: parsed.data.notes ?? null,
      },
    });

    return Response.json(surgery, { status: 201 });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
