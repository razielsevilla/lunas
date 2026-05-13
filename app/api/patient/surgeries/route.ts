import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';

// ---------------------------------------------------------------------------
// POST /api/patient/surgeries
// ---------------------------------------------------------------------------

const addSurgerySchema = z.object({
  procedure: z.string().min(1).max(300).trim(),
  datePerformed: z.string().max(20).trim().optional(),
  hospital: z.string().max(200).trim().optional(),
  notes: z.string().max(1000).trim().optional(),
});

export async function POST(req: Request): Promise<Response> {
  try {
    const session = await requireRole(req, 'PATIENT');
    const body = await req.json();

    const parsed = addSurgerySchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const profile = await prisma.patientProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!profile) {
      return Response.json({ error: 'Patient profile not found.' }, { status: 404 });
    }

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
