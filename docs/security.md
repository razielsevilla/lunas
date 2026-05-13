# SECURITY.md — Lunas Security & Privacy Framework

## Compliance Basis

Lunas is designed to be compliant with:
- **Republic Act 10173** — Philippine Data Privacy Act of 2012
- **Principles:** Transparency, Legitimate Purpose, Proportionality, Data Minimization

---

## 1. Encryption: Data at Rest

All Personal Health Information (PHI) is encrypted **at the application layer** before being written to the database. This means even direct database access yields only ciphertext.

### Implementation

```typescript
// lib/crypto.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'); // 32 bytes = 64 hex chars
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, encryptedHex] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}
```

### Fields Encrypted

| Model | Encrypted Fields |
|---|---|
| `PatientProfile` | `bloodType`, `heightCm`, `weightKg` |
| `Allergy` | `allergen`, `reaction` |
| `Medication` | `name`, `dosage`, `frequency`, `prescribedFor` |
| `Surgery` | `procedure`, `datePerformed`, `hospital`, `notes` |
| `EmergencyContact` | `name`, `relationship`, `mobile`, `email` |

> `rxNormCode` on Medication is NOT encrypted — it's a non-identifying code needed for drug interaction queries.

---

## 2. Password & PIN Hashing

```typescript
// lib/auth.ts
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export const hashPassword = (plain: string) => bcrypt.hash(plain, SALT_ROUNDS);
export const verifyPassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);

// Same functions used for PINs
export const hashPin = hashPassword;
export const verifyPin = verifyPassword;
```

Passwords and PINs are **never stored in plaintext** at any point.

---

## 3. Session Management

Sessions use **httpOnly, Secure, SameSite=Strict** cookies.

```typescript
// On login success
res.setHeader('Set-Cookie', serialize('session', sessionToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 60 * 60 * 8, // 8 hours
  path: '/',
}));
```

Sessions are stored in the `Session` table with an expiry. On logout, the DB record is deleted and the cookie is cleared.

---

## 4. Role-Based Access Control (RBAC)

Every protected API route begins with a role check.

```typescript
// lib/auth.ts
export async function requireRole(req: Request, role: Role | Role[]) {
  const session = await getSession(req);
  if (!session) throw new AuthError(401, 'Not authenticated.');
  const roles = Array.isArray(role) ? role : [role];
  if (!roles.includes(session.user.role)) {
    throw new AuthError(403, 'Insufficient permissions.');
  }
  return session.user;
}
```

**Route → Required Role mapping:**

| Route prefix | Required Role |
|---|---|
| `/api/patient/*` | `PATIENT` |
| `/api/professional/*` | `PROFESSIONAL` |
| `/api/admin/*` | `ADMIN` |
| `/api/scan/access` | `PROFESSIONAL` with `prcStatus = VERIFIED` |
| `GET /api/scan/:uuid` | Public (no auth) |

---

## 5. Professional PIN Access & Brute-Force Protection

### PIN Generation (on admin approval)
```typescript
// Generate a cryptographically random 6-digit PIN
const pin = crypto.randomInt(100000, 999999).toString();
const pinHash = await hashPin(pin);
// Store pinHash in DB, send plaintext PIN to professional via email once
```

### Brute-Force Lockout
On each failed PIN attempt via `POST /api/scan/access`:

```typescript
await prisma.professionalProfile.update({
  where: { userId: professional.userId },
  data: { pinFailCount: { increment: 1 } }
});

if (professional.pinFailCount + 1 >= 5) {
  // Lock this professional's access to this QR point
  // Log LOCKOUT event to AdminAuditLog
  return res.status(423).json({ status: 'LOCKED', error: 'Too many failed attempts.' });
}
```

- After **5 consecutive failures**, the professional's access is locked.
- A lockout is logged to `AdminAuditLog` with event type `FAILED_PIN_LOCKOUT`.
- Lockout can only be cleared by an admin.

---

## 6. Zero-Knowledge Admin Principle

Admin API routes are structured to **never query decryptable PHI fields**.

```typescript
// CORRECT — admin user list
const users = await prisma.user.findMany({
  select: {
    id: true,
    firstName: true,  // Not PHI
    lastName: true,   // Not PHI
    email: true,      // Not PHI
    role: true,
    createdAt: true,
    professionalProfile: { select: { prcStatus: true } }
    // patientProfile is NOT selected — no PHI ever returned
  }
});
```

Admin audit logs use **hashed actor IDs**, never raw user IDs or any patient data:

```typescript
// lib/audit.ts
export async function logAdminEvent(eventType: string, actorId: string, targetId?: string, metadata?: object) {
  await prisma.adminAuditLog.create({
    data: {
      eventType,
      actorIdHash: hashId(actorId),
      targetIdHash: targetId ? hashId(targetId) : null,
      metadata: metadata ? JSON.stringify(metadata) : null,
    }
  });
}

function hashId(id: string): string {
  return crypto.createHash('sha256').update(id + process.env.HASH_SALT).digest('hex');
}
```

---

## 7. Emergency Contact Notification Privacy

Notifications sent to emergency contacts upon QR access:
- ✅ Include: patient's first name, timestamp, "accessed by a verified medical professional"
- ❌ Do NOT include: professional's identity, medical details, specific location, QR UUID

```typescript
// Notification template
const body = `
  Hello ${contact.name},

  This is an automated message from Lunas.

  The medical passport of ${patient.firstName} ${patient.lastName} was accessed 
  by a verified medical professional on ${new Date().toLocaleString('en-PH')}.

  If this was unexpected, please contact emergency services immediately.

  — The Lunas System
`;
```

---

## 8. Data Minimization

| Principle | Implementation |
|---|---|
| Collect only what's needed | No demographic data beyond what emergency care requires |
| Admin cannot read PHI | Zero-knowledge queries enforced in all admin routes |
| QR URL contains no data | Only a UUID — the URL itself is safe to expose |
| Audit logs use hashed IDs | Not linkable back to individuals without the salt |
| Notification content minimal | No PHI in SMS/email notifications |

---

## 9. Input Validation & Sanitization

Use `zod` for all API input validation:

```typescript
// Example: patient registration schema
import { z } from 'zod';

export const registerPatientSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  mobile: z.string().regex(/^\+63\d{10}$/),
  password: z.string().min(8).max(128),
});
```

- All inputs validated before processing
- SQL injection: prevented by Prisma's parameterized queries
- XSS: Next.js escapes output by default; never use `dangerouslySetInnerHTML` with user data

---

## 10. PRC Re-Validation (MVP Simulation)

In the MVP, direct PRC API integration is out of scope. The re-validation is simulated:

```typescript
// lib/prcRevalidation.ts
// In production: call actual PRC registry API
// In MVP: check against a local mock registry or admin-controlled flag

export async function revalidatePrcLicense(prcNumber: string): Promise<'ACTIVE' | 'SUSPENDED'> {
  // MVP: return 'ACTIVE' for all, or check a mock table
  // Production: HTTP call to PRC API
  return 'ACTIVE';
}
```

A background job (cron or on-demand via admin panel) calls this for all verified professionals every 30 days and updates `prcStatus` accordingly.

---

## 11. HTTPS & Transport Security

- All traffic must be served over HTTPS (enforced by Vercel in production)
- HSTS headers enabled
- No sensitive data in URL query parameters (PINs, tokens always in request body or httpOnly cookies)

---

## Security Checklist (Pre-Demo)

- [ ] `ENCRYPTION_KEY` is a random 32-byte hex string set in `.env`
- [ ] `HASH_SALT` is a unique random string set in `.env`
- [ ] `NEXTAUTH_SECRET` (or equivalent) is set
- [ ] All PHI fields are encrypted before `prisma.create()` / `prisma.update()`
- [ ] All PHI fields are decrypted after `prisma.findUnique()` / `prisma.findMany()`
- [ ] Admin routes tested to confirm no PHI in responses
- [ ] PIN brute-force lockout tested (5 wrong PINs → 423 response)
- [ ] Session cookie is httpOnly and not readable from JS console
- [ ] Emergency contact notification does not contain PHI
