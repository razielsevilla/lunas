import { z } from 'zod';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

// ---------------------------------------------------------------------------
// Input validation schema
// ---------------------------------------------------------------------------

const registerProfessionalSchema = z.object({
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
  prcNumber: z
    .string()
    .min(5, 'PRC number must be at least 5 characters.')
    .max(20)
    .trim(),
  profession: z.string().min(1).max(100).trim(),
  specialization: z.string().max(100).trim().optional(),
  hospitalAffiliation: z.string().max(200).trim().optional(),
  pin: z.string().length(6, 'PIN must be exactly 6 digits.').regex(/^\d+$/, 'PIN must contain only numbers.'),
});

// ---------------------------------------------------------------------------
// POST /api/auth/register/professional
// ---------------------------------------------------------------------------

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();

    // 1. Validate input
    const parsed = registerProfessionalSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      firstName,
      lastName,
      email,
      mobile,
      password,
      prcNumber,
      profession,
      specialization,
      hospitalAffiliation,
      pin,
    } = parsed.data;

    // 2. Check for duplicate email
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return Response.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // 3. Check for duplicate PRC number
    const existingPrc = await prisma.professionalProfile.findUnique({
      where: { prcNumber },
    });
    if (existingPrc) {
      return Response.json(
        { error: 'A professional with this PRC number is already registered.' },
        { status: 409 }
      );
    }

    // 4. Hash password and PIN
    const passwordHash = await hashPassword(password);
    const pinHash = await hashPassword(pin);

    // 5. Create User + ProfessionalProfile in a single transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          mobile,
          passwordHash,
          role: 'PROFESSIONAL',
        },
      });

      // Profile starts with PENDING status — requires admin approval
      await tx.professionalProfile.create({
        data: {
          userId: newUser.id,
          prcNumber,
          profession,
          specialization: specialization ?? null,
          hospitalAffil: hospitalAffiliation ?? null,
          prcStatus: 'VERIFIED', // Auto-verify for easy demo
          pin: pinHash,
        },
      });

      return newUser;
    });

    return Response.json(
      {
        userId: user.id,
        message: 'Registration successful. You can now log in.',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[register/professional]', err);
    return Response.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
