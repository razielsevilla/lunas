# DATABASE_SCHEMA.md — Lunas Prisma Schema

## Setup

```bash
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
```

---

## Full Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

enum Role {
  PATIENT
  PROFESSIONAL
  ADMIN
}

enum PrcStatus {
  PENDING      // Submitted, awaiting admin review
  VERIFIED     // Approved and active
  SUSPENDED    // License found expired/revoked by re-validation
  REJECTED     // Rejected by admin
}

enum AccessStatus {
  SUCCESS
  DENIED       // Wrong PIN
  LOCKED       // Too many failed attempts
}

enum Allergyseverity {
  MILD
  MODERATE
  SEVERE
  LIFE_THREATENING
}

enum InteractionSeverity {
  LOW
  MODERATE
  HIGH
  CONTRAINDICATED
}

// ─────────────────────────────────────────────
// CORE USER (all roles share this table)
// ─────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  firstName     String
  lastName      String
  mobile        String?
  role          Role      @default(PATIENT)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  patientProfile      PatientProfile?
  professionalProfile ProfessionalProfile?
  sessions            Session[]
}

// ─────────────────────────────────────────────
// SESSION
// ─────────────────────────────────────────────

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ─────────────────────────────────────────────
// PATIENT PROFILE (PHI — encrypted at app layer)
// All String fields marked "// ENCRYPTED" are
// AES-256 encrypted before being written to DB.
// ─────────────────────────────────────────────

model PatientProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  qrUuid          String   @unique @default(uuid()) // The UUID embedded in the QR code URL
  
  // Basic Medical Info (ENCRYPTED)
  bloodType       String?  // ENCRYPTED
  heightCm        String?  // ENCRYPTED
  weightKg        String?  // ENCRYPTED
  isOrganDonor    Boolean  @default(false)
  
  profileComplete Int      @default(0) // 0-100 percentage
  lastUpdated     DateTime @default(now())
  createdAt       DateTime @default(now())

  // Relations
  user              User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  allergies         Allergy[]
  medications       Medication[]
  surgeries         Surgery[]
  emergencyContacts EmergencyContact[]
  accessLogs        AccessLog[]
  drugInteractions  DrugInteraction[]
}

// ─────────────────────────────────────────────
// ALLERGIES
// ─────────────────────────────────────────────

model Allergy {
  id               String          @id @default(cuid())
  patientProfileId String
  allergen         String          // ENCRYPTED
  reaction         String?         // ENCRYPTED
  severity         Allergyseverity
  createdAt        DateTime        @default(now())

  patientProfile PatientProfile @relation(fields: [patientProfileId], references: [id], onDelete: Cascade)
}

// ─────────────────────────────────────────────
// MEDICATIONS
// ─────────────────────────────────────────────

model Medication {
  id               String   @id @default(cuid())
  patientProfileId String
  name             String   // ENCRYPTED — normalized via RxNorm before save
  rxNormCode       String?  // Stored for drug interaction lookup
  dosage           String?  // ENCRYPTED
  frequency        String?  // ENCRYPTED
  prescribedFor    String?  // ENCRYPTED
  createdAt        DateTime @default(now())

  patientProfile PatientProfile @relation(fields: [patientProfileId], references: [id], onDelete: Cascade)
}

// ─────────────────────────────────────────────
// DRUG INTERACTIONS (computed, cached)
// ─────────────────────────────────────────────

model DrugInteraction {
  id               String              @id @default(cuid())
  patientProfileId String
  drug1Name        String
  drug2Name        String
  severity         InteractionSeverity
  description      String              // Plain-language warning
  checkedAt        DateTime            @default(now())

  patientProfile PatientProfile @relation(fields: [patientProfileId], references: [id], onDelete: Cascade)
}

// ─────────────────────────────────────────────
// SURGERIES / MEDICAL HISTORY
// ─────────────────────────────────────────────

model Surgery {
  id               String   @id @default(cuid())
  patientProfileId String
  procedure        String   // ENCRYPTED
  datePerformed    String?  // ENCRYPTED (stored as string for flexibility)
  hospital         String?  // ENCRYPTED
  notes            String?  // ENCRYPTED
  createdAt        DateTime @default(now())

  patientProfile PatientProfile @relation(fields: [patientProfileId], references: [id], onDelete: Cascade)
}

// ─────────────────────────────────────────────
// EMERGENCY CONTACTS
// ─────────────────────────────────────────────

model EmergencyContact {
  id               String  @id @default(cuid())
  patientProfileId String
  name             String  // ENCRYPTED
  relationship     String  // ENCRYPTED
  mobile           String  // ENCRYPTED — used to send SMS notifications
  email            String? // ENCRYPTED — used to send email notifications

  patientProfile PatientProfile @relation(fields: [patientProfileId], references: [id], onDelete: Cascade)
}

// ─────────────────────────────────────────────
// PROFESSIONAL PROFILE
// ─────────────────────────────────────────────

model ProfessionalProfile {
  id               String    @id @default(cuid())
  userId           String    @unique
  prcNumber        String    @unique
  profession       String
  specialization   String?
  hospitalAffil    String?
  prcStatus        PrcStatus @default(PENDING)
  pin              String?   // bcrypt hashed 6-digit PIN
  pinFailCount     Int       @default(0)
  lastPrcCheck     DateTime?
  verifiedAt       DateTime?
  createdAt        DateTime  @default(now())

  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessLogs AccessLog[]
}

// ─────────────────────────────────────────────
// ACCESS LOG (Immutable audit trail)
// ─────────────────────────────────────────────

model AccessLog {
  id                    String       @id @default(cuid())
  patientProfileId      String
  professionalProfileId String
  accessedAt            DateTime     @default(now())
  status                AccessStatus
  durationSeconds       Int?         // Null until session ends
  ipHash                String?      // Hashed IP for anomaly detection — not plaintext

  patientProfile      PatientProfile      @relation(fields: [patientProfileId], references: [id])
  professionalProfile ProfessionalProfile @relation(fields: [professionalProfileId], references: [id])
}

// ─────────────────────────────────────────────
// ADMIN AUDIT LOG (Zero-knowledge — no PHI)
// ─────────────────────────────────────────────

model AdminAuditLog {
  id          String   @id @default(cuid())
  eventType   String   // e.g. "PROFESSIONAL_APPROVED", "FAILED_PIN_LOCKOUT", "PRC_REVALIDATION"
  actorIdHash String   // Hashed user ID — never plaintext
  targetIdHash String? // Hashed target ID if applicable
  metadata    String?  // JSON string of non-PHI context (e.g. PRC number, event count)
  createdAt   DateTime @default(now())
}
```

---

## Key Design Decisions

### Why encrypt at the application layer?
Encrypting in the app (before Prisma writes to DB) ensures that even if the database is compromised directly (e.g. via a DB admin account), the PHI remains unreadable. The encryption key lives only in the application environment, never in the DB.

### Why store `rxNormCode` in Medication?
Drug interaction checking via DrugBank/RxNorm requires standardized drug codes. Storing the code at save-time means you can re-check interactions without re-normalizing the name on every query.

### Why is `qrUuid` separate from the profile `id`?
The `id` (cuid) is used internally in joins. The `qrUuid` is a true UUID v4 embedded in the public-facing QR URL. Keeping them separate prevents enumeration attacks based on sequential or predictable IDs.

### Why is `AccessLog` append-only?
Access logs must be immutable for legal and compliance purposes. No `UPDATE` or `DELETE` operations should ever be run on this table. Enforce this at the application layer — no delete API route for logs.

---

## Indexes to Add

```prisma
@@index([qrUuid])           // on PatientProfile — hot path: QR scan lookup
@@index([patientProfileId]) // on AccessLog — patient dashboard log query
@@index([prcNumber])        // on ProfessionalProfile — PRC re-validation job
@@index([createdAt])        // on AdminAuditLog — time-range admin queries
```

---

## Seeding (for demo)

Create `prisma/seed.ts` with:
- 1 admin user
- 2–3 patient users with full profiles, QR codes, allergies, medications
- 2 verified professional users with PINs
- Sample access logs showing the audit trail
- Sample drug interaction warnings

```bash
npx prisma db seed
```
