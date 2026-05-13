import { getSession } from '@/lib/session';

// ---------------------------------------------------------------------------
// GET /api/auth/me
// Returns the authenticated user's basic non-sensitive info.
// No PHI is ever returned from this route.
// ---------------------------------------------------------------------------

export async function GET(req: Request): Promise<Response> {
  try {
    const session = await getSession(req);

    if (!session) {
      return Response.json(
        { error: 'Not authenticated. Please log in.' },
        { status: 401 }
      );
    }

    const { user } = session;

    // Return only the fields needed by the frontend (no PHI, no password hash)
    return Response.json(
      {
        userId: user.id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        patientProfileId: user.patientProfileId ?? null,
        professionalProfileId: user.professionalProfileId ?? null,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[auth/me]', err);
    return Response.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
