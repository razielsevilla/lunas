import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/session';

// ---------------------------------------------------------------------------
// POST /api/auth/logout
// ---------------------------------------------------------------------------

export async function POST(req: Request): Promise<Response> {
  try {
    // Delete DB session record and get a cookie-clearing string
    const clearCookie = await deleteSession(req);

    const response = NextResponse.json(
      { message: 'Logged out.' },
      { status: 200 }
    );

    // Set the cookie clearing header using NextResponse API
    response.headers.set('Set-Cookie', clearCookie);

    return response;
  } catch (err) {
    console.error('[auth/logout]', err);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
