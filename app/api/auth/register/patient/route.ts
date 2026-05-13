import { z } from 'zod';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

// ---------------------------------------------------------------------------
// Input validation schema (per SECURITY.md §9)
// ---------------------------------------------------------------------------

const registerPatientSchema = z.object({
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().min(1).max(100).trim(),
  email: z.string().email('Invalid email address.'),
  mobile: z
    .string()
    .regex(/^\+63\d{10}$/, 'Mobile must be in format +63XXXXXXXXXX (Philippine number).'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(128, 'Password must be at most 128 characters.'),
});

// ---------------------------------------------------------------------------
// POST /api/auth/register/patient
// ---------------------------------------------------------------------------

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();

    // 1. Validate input
    const parsed = registerPatientSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, mobile, password } = parsed.data;

    // 2. Check for duplicate email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // 3. Hash password (bcrypt, salt rounds = 12)
    const passwordHash = await hashPassword(password);

    // 4. Create User + PatientProfile in a single transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          mobile,
          passwordHash,
          role: 'PATIENT',
        },
      });

      // Auto-create an empty patient profile (qrUuid is auto-generated via @default(uuid()))
      await tx.patientProfile.create({
        data: {
          userId: newUser.id,
        },
      });

      return newUser;
    });

    // 5. Return success — never return the password hash
    return Response.json(
      {
        userId: user.id,
        message: 'Account created. Please log in.',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[register/patient]', err);
    return Response.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
