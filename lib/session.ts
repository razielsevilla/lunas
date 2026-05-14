import crypto from 'crypto';
import { prisma } from './db';
import { Role } from '@prisma/client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  professionalProfileId?: string | null;
  patientProfileId?: string | null;
}

export interface SessionPayload {
  sessionId: string;
  user: SessionUser;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 hours
const COOKIE_NAME = 'session';

// ---------------------------------------------------------------------------
// Token generation
// ---------------------------------------------------------------------------

function generateToken(): string {
  return crypto.randomBytes(48).toString('hex');
}

// ---------------------------------------------------------------------------
// createSession
// ---------------------------------------------------------------------------

/**
 * Creates a new session record in the DB and returns the raw token.
 * Call this immediately after a successful login, then set the cookie.
 */
export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_SECONDS * 1000
  );

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  return token;
}

// ---------------------------------------------------------------------------
// getSession
// ---------------------------------------------------------------------------

/**
 * Reads the session token from the Request cookie header,
 * validates it against the DB, and returns the session payload.
 * Returns null if the session is missing, expired, or invalid.
 */
export async function getSession(
  req: Request
): Promise<SessionPayload | null> {
  const token = getTokenFromRequest(req);
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          patientProfile: { select: { id: true } },
          professionalProfile: { select: { id: true } },
        },
      },
    },
  });

  if (!session) return null;

  // Check expiry
  if (session.expiresAt < new Date()) {
    // Clean up expired session silently
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  const { user } = session;

  return {
    sessionId: session.id,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      patientProfileId: user.patientProfile?.id ?? null,
      professionalProfileId: user.professionalProfile?.id ?? null,
    },
  };
}

// ---------------------------------------------------------------------------
// deleteSession
// ---------------------------------------------------------------------------

/**
 * Deletes the session record from the DB (used on logout).
 * Also returns the Set-Cookie header value to clear the cookie.
 */
export async function deleteSession(req: Request): Promise<string> {
  const token = getTokenFromRequest(req);
  if (token) {
    await prisma.session
      .deleteMany({ where: { token } })
      .catch(() => {});
  }
  // Return a cookie string that will clear the session cookie in the browser
  return buildCookieString('', { maxAge: 0 });
}

// ---------------------------------------------------------------------------
// Cookie helpers
// ---------------------------------------------------------------------------

/**
 * Builds a Set-Cookie string for the session token.
 */
export function buildSessionCookie(token: string): string {
  return buildCookieString(token, {
    maxAge: SESSION_DURATION_SECONDS,
  });
}

function buildCookieString(
  value: string,
  opts: { maxAge: number }
): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const parts = [
    `${COOKIE_NAME}=${value}`,
    `Max-Age=${opts.maxAge}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
  ];
  if (isProduction) parts.push('Secure');
  return parts.join('; ');
}

/**
 * Extracts the session token from the Cookie header of a Request.
 */
function getTokenFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) return null;

  // Parse cookie string manually — no external dependency needed
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [key, ...rest] = c.trim().split('=');
      return [key.trim(), rest.join('=').trim()];
    })
  );

  return cookies[COOKIE_NAME] ?? null;
}
