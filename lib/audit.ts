import crypto from 'crypto';
import { prisma } from './db';

// ---------------------------------------------------------------------------
// Zero-Knowledge Admin Audit Logger
//
// Per SECURITY.md §6: Admin audit logs use hashed actor/target IDs — never
// raw user IDs or any patient data. This ensures the audit trail is useful
// for anomaly detection without being a PHI leakage vector.
// ---------------------------------------------------------------------------

/**
 * Deterministically hashes an ID string for use in the audit log.
 * Uses SHA-256 + HASH_SALT (set in .env) to prevent rainbow table attacks.
 * The hash is NOT reversible without the salt.
 */
function hashId(id: string): string {
  const salt = process.env.HASH_SALT;
  if (!salt) {
    throw new Error(
      'HASH_SALT is not set in environment variables. ' +
        'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(16).toString(\'hex\'))"'
    );
  }
  return crypto
    .createHash('sha256')
    .update(id + salt)
    .digest('hex');
}

// ---------------------------------------------------------------------------
// Event type constants
// Centralising event type strings avoids typos across the codebase.
// ---------------------------------------------------------------------------

export const AuditEvent = {
  // Professional lifecycle
  PROFESSIONAL_APPROVED: 'PROFESSIONAL_APPROVED',
  PROFESSIONAL_REJECTED: 'PROFESSIONAL_REJECTED',
  PRC_REVALIDATION: 'PRC_REVALIDATION',

  // Access control
  FAILED_PIN_LOCKOUT: 'FAILED_PIN_LOCKOUT',
  QR_ACCESS_SUCCESS: 'QR_ACCESS_SUCCESS',
  QR_ACCESS_DENIED: 'QR_ACCESS_DENIED',

  // Admin actions
  USER_SUSPENDED: 'USER_SUSPENDED',
  ADMIN_LOGIN: 'ADMIN_LOGIN',
} as const;

export type AuditEventType = (typeof AuditEvent)[keyof typeof AuditEvent];

// ---------------------------------------------------------------------------
// logAdminEvent
// ---------------------------------------------------------------------------

/**
 * Creates a zero-knowledge audit log entry.
 *
 * @param eventType  - One of the AuditEvent constants.
 * @param actorId    - The raw user ID of the admin or system performing the action.
 *                     This is hashed before storage — never stored as plaintext.
 * @param targetId   - (Optional) The raw user/profile ID of the subject of the event.
 *                     Also hashed before storage.
 * @param metadata   - (Optional) Any non-PHI context to store as a JSON string,
 *                     e.g. PRC number, event count, HTTP status code.
 *                     NEVER include patient medical data in this field.
 */
export async function logAdminEvent(
  eventType: string,
  actorId: string,
  targetId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    await prisma.adminAuditLog.create({
      data: {
        eventType,
        actorIdHash: hashId(actorId),
        targetIdHash: targetId ? hashId(targetId) : null,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (err) {
    // Audit logging must never crash the calling request.
    // Log the failure server-side but do not rethrow.
    console.error('[audit] Failed to write audit log entry:', err);
  }
}

// ---------------------------------------------------------------------------
// logAccessEvent (patient access log — separate from admin audit log)
// ---------------------------------------------------------------------------

/**
 * Creates an immutable access log entry for a QR scan attempt.
 * Records are append-only — no UPDATE or DELETE is ever called on AccessLog.
 *
 * @param patientProfileId      - The patient's profile ID.
 * @param professionalProfileId - The professional's profile ID.
 * @param status                - SUCCESS | DENIED | LOCKED.
 * @param ipHash                - (Optional) Hashed IP for anomaly detection.
 */
export async function logAccessEvent(
  patientProfileId: string,
  professionalProfileId: string,
  status: 'SUCCESS' | 'DENIED' | 'LOCKED',
  ipHash?: string
): Promise<void> {
  try {
    await prisma.accessLog.create({
      data: {
        patientProfileId,
        professionalProfileId,
        status,
        ipHash: ipHash ?? null,
      },
    });
  } catch (err) {
    console.error('[audit] Failed to write access log entry:', err);
  }
}

// ---------------------------------------------------------------------------
// hashIpAddress helper (for anomaly detection without storing raw IPs)
// ---------------------------------------------------------------------------

/**
 * Hashes an IP address for anonymous storage in AccessLog.
 * The same IP will always produce the same hash (salted), allowing
 * anomaly detection without storing personally identifiable network data.
 */
export function hashIpAddress(ip: string): string {
  return hashId(ip);
}
