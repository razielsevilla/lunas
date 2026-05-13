import { deleteSession } from '@/lib/session';

// ---------------------------------------------------------------------------
// POST /api/auth/logout
// ---------------------------------------------------------------------------

export async function POST(req: Request): Promise<Response> {
  try {
    // Delete DB session record and get a cookie-clearing string
    const clearCookie = await deleteSession(req);

    return new Response(
      JSON.stringify({ message: 'Logged out.' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': clearCookie,
        },
      }
    );
  } catch (err) {
    console.error('[auth/logout]', err);
    return Response.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
