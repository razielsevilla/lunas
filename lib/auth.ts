import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { getSession, SessionPayload } from './session';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SALT_ROUNDS = 12;

// ---------------------------------------------------------------------------
// Custom Error
// ---------------------------------------------------------------------------

export class AuthError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// ---------------------------------------------------------------------------
// Password hashing (bcrypt, SALT_ROUNDS = 12)
// ---------------------------------------------------------------------------

/**
 * Hashes a plaintext password using bcrypt.
 * Use for both passwords AND PINs (same underlying function per SECURITY.md).
 */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/**
 * Verifies a plaintext password/PIN against its bcrypt hash.
 */
export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// PIN aliases (semantic sugar — same functions per SECURITY.md)
export const hashPin = hashPassword;
export const verifyPin = verifyPassword;

// ---------------------------------------------------------------------------
// Role-Based Access Control
// ---------------------------------------------------------------------------

/**
 * Validates the request session and asserts the caller holds the required role(s).
 *
 * @throws {AuthError} 401 if not authenticated.
 * @throws {AuthError} 403 if role is insufficient.
 * @returns {SessionPayload} The validated session (user + sessionId).
 */
export async function requireRole(
  req: Request,
  role: Role | Role[]
): Promise<SessionPayload> {
  const session = await getSession(req);

  if (!session) {
    throw new AuthError(401, 'Not authenticated. Please log in.');
  }

  const allowedRoles = Array.isArray(role) ? role : [role];

  if (!allowedRoles.includes(session.user.role)) {
    throw new AuthError(
      403,
      `Insufficient permissions. Required role: ${allowedRoles.join(' or ')}.`
    );
  }

  return session;
}

/**
 * Validates that the session exists (any role).
 * Use on routes accessible to all authenticated users.
 *
 * @throws {AuthError} 401 if not authenticated.
 */
export async function requireAuth(req: Request): Promise<SessionPayload> {
  const session = await getSession(req);
  if (!session) {
    throw new AuthError(401, 'Not authenticated. Please log in.');
  }
  return session;
}

// ---------------------------------------------------------------------------
// Error response helper
// ---------------------------------------------------------------------------

/**
 * Converts an AuthError (or any unknown error) into a structured JSON Response.
 * Use in API route catch blocks.
 */
export function toAuthErrorResponse(err: unknown): Response {
  if (err instanceof AuthError) {
    return Response.json(
      { error: err.message },
      { status: err.statusCode }
    );
  }
  console.error('[auth] Unexpected error:', err);
  return Response.json(
    { error: 'An internal server error occurred.' },
    { status: 500 }
  );
}
