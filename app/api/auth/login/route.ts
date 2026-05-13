import { z } from 'zod';
import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { createSession, buildSessionCookie } from '@/lib/session';

// ---------------------------------------------------------------------------
// Input validation schema
// ---------------------------------------------------------------------------

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();

    // 1. Validate input
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // 2. Look up user by email
    const user = await prisma.user.findUnique({ where: { email } });

    // 3. Constant-time rejection — always run bcrypt even if user not found
    //    to prevent user enumeration via timing attacks
    const dummyHash =
      '$2b$12$invalidhashplaceholderfortimingprotection000000000000000';
    const passwordValid = await verifyPassword(
      password,
      user?.passwordHash ?? dummyHash
    );

    if (!user || !passwordValid) {
      return Response.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // 4. Create session in DB
    const token = await createSession(user.id);

    // 5. Build response with Set-Cookie header
    const cookieString = buildSessionCookie(token);

    return new Response(
      JSON.stringify({
        userId: user.id,
        role: user.role,
        firstName: user.firstName,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookieString,
        },
      }
    );
  } catch (err) {
    console.error('[auth/login]', err);
    return Response.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
