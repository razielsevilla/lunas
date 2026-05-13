import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';
import { HTTP, parseBody } from '@/lib/api';

// ---------------------------------------------------------------------------
// POST /api/patient/emergency-contacts
// ---------------------------------------------------------------------------

const addContactSchema = z.object({
  name: z
    .string({ required_error: 'Contact name is required.' })
    .min(1, 'Contact name cannot be empty.')
    .max(200, 'Name must be 200 characters or less.')
    .trim(),
  relationship: z
    .string({ required_error: 'Relationship is required.' })
    .min(1, 'Relationship cannot be empty.')
    .max(100, 'Relationship must be 100 characters or less.')
    .trim(),
  mobile: z
    .string({ required_error: 'Mobile number is required.' })
    .regex(
      /^\+\d{7,15}$/,
      'Mobile must be in international format, e.g. +639171234567 (7–15 digits after +).'
    ),
  email: z
    .string()
    .email('A valid email address is required if provided.')
    .max(254, 'Email must be 254 characters or less.')
    .nullable()
    .optional(),
});

export async function POST(req: Request): Promise<Response> {
  try {
    const session = await requireRole(req, 'PATIENT');

    const parsed = await parseBody(req, addContactSchema);
    if (parsed.response) return parsed.response;

    const profile = await prisma.patientProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!profile) return HTTP.notFound('Patient profile');

    // Enforce max 3 emergency contacts
    const contactCount = await prisma.emergencyContact.count({
      where: { patientProfileId: profile.id },
    });

    if (contactCount >= 3) {
      return HTTP.unprocessable(
        'You can have a maximum of 3 emergency contacts. Please remove one before adding another.'
      );
    }

    // Prevent duplicate mobile number
    const duplicateMobile = await prisma.emergencyContact.findFirst({
      where: { patientProfileId: profile.id, mobile: parsed.data.mobile },
    });

    if (duplicateMobile) {
      return HTTP.conflict(
        `A contact with mobile number ${parsed.data.mobile} is already registered.`
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
