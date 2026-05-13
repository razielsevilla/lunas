# API_REFERENCE.md — Lunas API Endpoints

All API routes live under `/api/`. All responses are JSON. All protected routes require a valid session cookie.

---

## Auth Conventions

| Header / Cookie | Description |
|---|---|
| `Cookie: session=<token>` | Set on login; checked on all protected routes |
| `Content-Type: application/json` | Required on all POST/PUT/PATCH requests |

**Error shape (all errors):**
```json
{ "error": "Human-readable message" }
```

---

## 1. Authentication

### `POST /api/auth/register/patient`
Register a new patient account.

**Body:**
```json
{
  "firstName": "Maria",
  "lastName": "Santos",
  "email": "maria@example.com",
  "mobile": "+639171234567",
  "password": "securePassword123"
}
```

**Response `201`:**
```json
{ "userId": "clxxx...", "message": "Account created. Please log in." }
```

---

### `POST /api/auth/register/professional`
Register a new professional account (starts as PENDING).

**Body:**
```json
{
  "firstName": "Ramon",
  "lastName": "Cruz",
  "email": "dr.cruz@stlukes.ph",
  "mobile": "+639179876543",
  "password": "securePassword123",
  "prcNumber": "0097451",
  "profession": "Physician",
  "specialization": "Emergency Medicine",
  "hospitalAffiliation": "St. Luke's Medical Center"
}
```

**Response `201`:**
```json
{ "userId": "clxxx...", "message": "Registration submitted. Awaiting PRC verification." }
```

---

### `POST /api/auth/login`
Login for any role.

**Body:**
```json
{ "email": "maria@example.com", "password": "securePassword123" }
```

**Response `200`:**
```json
{ "userId": "clxxx...", "role": "PATIENT", "firstName": "Maria" }
```
Sets `session` httpOnly cookie.

---

### `POST /api/auth/logout`
Clears the session cookie and invalidates the DB session.

**Response `200`:** `{ "message": "Logged out." }`

---

### `GET /api/auth/me`
Returns the current authenticated user's basic info.

**Response `200`:**
```json
{ "userId": "clxxx...", "role": "PATIENT", "firstName": "Maria", "lastName": "Santos" }
```

---

## 2. Patient Profile

All routes require `role = PATIENT`.

### `GET /api/patient/profile`
Fetch the authenticated patient's full medical profile (decrypted).

**Response `200`:**
```json
{
  "profileId": "clxxx...",
  "qrUuid": "uuid-v4-here",
  "bloodType": "O+",
  "heightCm": "162",
  "weightKg": "54",
  "isOrganDonor": true,
  "profileComplete": 92,
  "lastUpdated": "2026-05-09T00:00:00Z",
  "allergies": [
    { "id": "clxxx...", "allergen": "Penicillin", "reaction": "Anaphylaxis", "severity": "LIFE_THREATENING" }
  ],
  "medications": [
    { "id": "clxxx...", "name": "Salbutamol 100mcg", "dosage": "1 puff", "frequency": "As needed" }
  ],
  "surgeries": [],
  "emergencyContacts": [
    { "id": "clxxx...", "name": "Jose Santos", "relationship": "Spouse", "mobile": "+639171112222" }
  ],
  "drugInteractions": [
    { "drug1Name": "Salbutamol", "drug2Name": "Losartan", "severity": "MODERATE", "description": "May reduce effectiveness of beta-blockers." }
  ]
}
```

---

### `PUT /api/patient/profile`
Update the patient's basic medical info. Triggers drug interaction re-check.

**Body (all fields optional):**
```json
{
  "bloodType": "O+",
  "heightCm": "162",
  "weightKg": "54",
  "isOrganDonor": true
}
```

**Response `200`:** Updated profile object.

---

### `POST /api/patient/allergies`
Add a new allergy entry.

**Body:**
```json
{ "allergen": "Shellfish", "reaction": "Swelling", "severity": "SEVERE" }
```

**Response `201`:** The created allergy object.

---

### `DELETE /api/patient/allergies/:id`
Remove an allergy entry.

**Response `200`:** `{ "message": "Allergy removed." }`

---

### `POST /api/patient/medications`
Add a medication. Triggers drug interaction re-check on all current meds.

**Body:**
```json
{ "name": "Losartan 50mg", "dosage": "50mg", "frequency": "Once daily", "prescribedFor": "Hypertension" }
```

**Response `201`:** The created medication + any newly detected interactions.

---

### `DELETE /api/patient/medications/:id`
Remove a medication and re-run interaction check.

**Response `200`:** `{ "message": "Medication removed." }`

---

### `POST /api/patient/surgeries`
Add a surgery/medical history entry.

**Body:**
```json
{ "procedure": "Appendectomy", "datePerformed": "2023-03", "hospital": "PGH", "notes": "No complications." }
```

**Response `201`:** The created surgery object.

---

### `DELETE /api/patient/surgeries/:id`
**Response `200`:** `{ "message": "Record removed." }`

---

### `POST /api/patient/emergency-contacts`
Add an emergency contact.

**Body:**
```json
{ "name": "Jose Santos", "relationship": "Spouse", "mobile": "+639171112222", "email": "jose@example.com" }
```

**Response `201`:** The created contact.

---

### `DELETE /api/patient/emergency-contacts/:id`
**Response `200`:** `{ "message": "Contact removed." }`

---

### `GET /api/patient/access-logs`
Fetch the patient's full access history.

**Response `200`:**
```json
[
  {
    "accessedAt": "2026-05-09T09:14:00Z",
    "status": "SUCCESS",
    "durationSeconds": 312,
    "professional": {
      "name": "Dr. Ramon Cruz",
      "prcNumber": "0097451",
      "specialization": "Emergency Medicine",
      "hospitalAffiliation": "St. Luke's Medical Center"
    }
  }
]
```

---

## 3. QR Code

### `GET /api/patient/qr`
Returns the patient's QR UUID and the full QR image as a base64 PNG.

**Response `200`:**
```json
{
  "qrUuid": "uuid-v4-here",
  "qrImageBase64": "data:image/png;base64,..."
}
```

---

### `GET /api/scan/:uuid` (Public — no auth required)
Landing page data for a QR scan. Returns minimal info to render the PIN entry screen.

**Response `200`:**
```json
{ "patientFirstName": "Maria", "uuid": "uuid-v4-here" }
```

**Response `404`:** `{ "error": "QR code not found." }`

---

### `POST /api/scan/access`
Core emergency access endpoint. Validates the professional's PIN and returns the decrypted patient record if successful. Logs the event and fires notifications regardless of outcome.

**Body:**
```json
{ "uuid": "patient-qr-uuid", "pin": "482910" }
```

**Response `200` (SUCCESS):**
```json
{
  "status": "SUCCESS",
  "patient": {
    "firstName": "Maria",
    "lastName": "Santos",
    "age": 34,
    "bloodType": "O+",
    "heightCm": "162",
    "weightKg": "54",
    "isOrganDonor": true,
    "allergies": [...],
    "medications": [...],
    "surgeries": [...],
    "drugInteractions": [...]
  }
}
```

**Response `401` (DENIED — wrong PIN):**
```json
{ "status": "DENIED", "attemptsRemaining": 3 }
```

**Response `423` (LOCKED):**
```json
{ "status": "LOCKED", "error": "Too many failed attempts. Access point locked." }
```

**Response `403` (PRC issue):**
```json
{ "status": "FORBIDDEN", "error": "Your PRC license is not currently active." }
```

---

## 4. Professional

All routes require `role = PROFESSIONAL`.

### `GET /api/professional/dashboard`
Fetch the professional's dashboard stats and recent patients.

**Response `200`:**
```json
{
  "scansToday": 7,
  "patientsThisWeek": 24,
  "pendingNotes": 3,
  "prcStatus": "VERIFIED",
  "recentPatients": [
    { "firstName": "Maria", "lastName": "Santos", "accessedAt": "2026-05-13T09:14:00Z" }
  ]
}
```

---

### `GET /api/professional/profile`
Returns the professional's own profile and credentials.

**Response `200`:**
```json
{
  "name": "Dr. Ramon Cruz",
  "email": "dr.cruz@stlukes.ph",
  "prcNumber": "0097451",
  "profession": "Physician",
  "specialization": "Emergency Medicine",
  "hospitalAffiliation": "St. Luke's Medical Center",
  "prcStatus": "VERIFIED",
  "verifiedAt": "2026-01-15T00:00:00Z"
}
```

---

## 5. Admin

All routes require `role = ADMIN`. **None of these routes return patient PHI.**

### `GET /api/admin/overview`
System-level metrics only.

**Response `200`:**
```json
{
  "totalPatients": 12840,
  "totalVerifiedProfessionals": 487,
  "qrScans24h": 1322,
  "uptimePercent": 99.98,
  "pendingVerifications": 9
}
```

---

### `GET /api/admin/verifications`
List professionals pending PRC verification.

**Response `200`:** Array of `{ id, name, prcNumber, profession, specialization, hospitalAffiliation, submittedAt }`

---

### `POST /api/admin/verifications/:id/approve`
Approve a professional. Generates their unique PIN and stores it hashed.

**Response `200`:** `{ "message": "Professional approved. PIN has been sent to their registered contact." }`

---

### `POST /api/admin/verifications/:id/reject`
**Body:** `{ "reason": "PRC number not found in registry." }`
**Response `200`:** `{ "message": "Professional rejected." }`

---

### `GET /api/admin/audit-logs`
Fetch system audit logs (no PHI).

**Query params:** `?page=1&limit=50&eventType=FAILED_PIN_LOCKOUT`

**Response `200`:** Array of `{ id, eventType, actorIdHash, metadata, createdAt }`

---

### `GET /api/admin/users`
List all user accounts with role and status (no medical data).

**Response `200`:** Array of `{ id, firstName, lastName, email, role, prcStatus?, createdAt }`

---

### `GET /api/admin/system-health`
Returns operational status of infrastructure services.

**Response `200`:**
```json
{
  "api": { "status": "operational", "latencyMs": 45 },
  "database": { "status": "operational", "connections": 12 },
  "qrService": { "status": "operational" },
  "emailGateway": { "status": "operational" },
  "backupPipeline": { "status": "operational", "lastRun": "2026-05-13T00:00:00Z" },
  "auditStream": { "status": "operational" }
}
```
