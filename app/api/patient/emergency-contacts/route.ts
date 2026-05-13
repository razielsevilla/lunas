import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';

// ---------------------------------------------------------------------------
// POST /api/patient/emergency-contacts
// ---------------------------------------------------------------------------

const addContactSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  relationship: z.string().min(1).max(100).trim(),
  mobile: z
    .string()
    .regex(/^\+\d{7,15}$/, 'Mobile must be in international format (e.g. +639171234567).'),
  email: z.string().email().optional().nullable(),
});

export async function POST(req: Request): Promise<Response> {
  try {
    const session = await requireRole(req, 'PATIENT');
    const body = await req.json();

    const parsed = addContactSchema.safeParse(body);
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

    // Enforce max 3 emergency contacts
    const contactCount = await prisma.emergencyContact.count({
      where: { patientProfileId: profile.id },
    });

    if (contactCount >= 3) {
      return Response.json(
        { error: 'Maximum of 3 emergency contacts allowed.' },
        { status: 422 }
      );
    }

    const contact = await prisma.emergencyContact.create({
      data: {
        patientProfileId: profile.id,
        name: parsed.data.name,
        relationship: parsed.data.relationship,
        mobile: parsed.data.mobile,
        email: parsed.data.email ?? null,
      },
    });

    return Response.json(contact, { status: 201 });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
