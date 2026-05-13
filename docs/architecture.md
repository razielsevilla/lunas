# ARCHITECTURE.md — Lunas System Design

## Overview

Lunas is a monolithic Next.js application using the App Router. All frontend and backend logic lives within a single deployable unit. This reduces infrastructure complexity within the hackathon timeframe while maintaining clean separation of concerns via route groups and API routes.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  Patient Browser │ Professional Mobile │ Admin Dashboard    │
└────────────┬────────────────┬──────────────────┬────────────┘
             │                │                  │
             ▼                ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS APP ROUTER                       │
│                                                             │
│  ┌──────────────┐  ┌─────────────────┐  ┌────────────────┐  │
│  │ (auth) pages │  │ (patient) pages │  │ (admin) pages  │  │
│  └──────────────┘  └─────────────────┘  └────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    API ROUTES (/api/*)                │  │
│  │  auth/ │ patient/ │ professional/ │ qr/ │ admin/      │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
     ┌──────────────┐ ┌──────────┐ ┌──────────────────┐
     │  PostgreSQL  │ │  Prisma  │ │   External APIs  │
     │  (encrypted  │ │   ORM    │ │  DrugBank, Twilio│
     │   at rest)   │ │          │ │  SMTP, PRC check │
     └──────────────┘ └──────────┘ └──────────────────┘
```

---

## Core Modules

### 1. Patient Account & Medical Profile Management
**Purpose:** Allow patients to create accounts and manage their health data.

**Key flows:**
- Patient registers → account created → prompted to build profile
- Patient updates any field → data encrypted (AES-256) → saved → timestamp updated
- Profile uses collapsible sections: Basic Info, Allergies, Medications, Surgeries, Emergency Contacts

**Components:** `PatientDashboard`, `MedicalProfileForm`, `AllergySection`, `MedicationSection`

---

### 2. Permanent QR Code Generation
**Purpose:** Each patient gets one permanent, non-expiring QR code.

**Key flows:**
- On first profile save → UUID generated → stored in DB → QR image generated from UUID URL
- QR URL format: `https://lunas.app/scan/{uuid}` — contains zero medical data
- Patient can download PNG, print card, or share

**Key rule:** The QR code UUID never changes, even if the patient updates their profile.

---

### 3. Emergency Access System (QR Scan → PIN → View)
**Purpose:** The core emergency workflow for medical professionals.

**Key flows:**
1. Professional scans QR → lands on `/scan/{uuid}`
2. Page prompts for 6-digit professional PIN (not the patient's data)
3. PIN validated against professional's account → checked against PRC status
4. If valid: patient record decrypted and displayed in emergency view
5. Access event logged immediately (before data is shown)
6. Emergency contacts notified via SMS/email simultaneously

**Security gates:**
- 5 failed PIN attempts → access point locked for that professional
- PRC status must be `VERIFIED` and `ACTIVE` at time of access

---

### 4. Professional Verification Module
**Purpose:** Ensure only licensed professionals access the system.

**Key flows:**
- Professional registers → submits PRC license number + profession details
- Admin reviews in Expert Verifications Queue → approves or rejects
- On approval → unique 6-digit PIN generated and delivered to professional
- Background job re-validates PRC status every 30 days (simulated in MVP)

---

### 5. Access Logs & Audit Trail
**Purpose:** Full accountability for every record access.

**Patient-facing log fields:** Professional name, PRC number, specialization, timestamp, access duration, PIN attempt status (success/denied)

**Admin audit log fields:** Event type, anonymized actor ID, timestamp, IP hash — no medical content ever

**Anomaly detection:** Flag if >3 failed PIN attempts on a single QR UUID within 10 minutes.

---

### 6. Emergency Contact Notification System
**Purpose:** Alert the patient's designated contacts the moment their QR is accessed.

**Trigger:** Fired immediately after a successful PIN authentication, before the professional sees the full record.

**Notification content (SMS/email):**
- Who was notified: designated contact's name
- What happened: "Your contact [Patient Name]'s medical passport was accessed by a verified medical professional."
- When: timestamp
- Does NOT reveal: medical details, professional identity, or location

---

### 7. AI-Assisted Drug Interaction Alert
**Purpose:** Flag dangerous medication combinations at the point of care.

**Flow:**
- Patient enters medications → system queries DrugBank API + RxNorm normalization
- Dangerous pairs flagged and stored as warnings in the profile
- When professional accesses emergency view → high-severity interactions shown prominently in red
- Patient dashboard also shows their own warnings in plain language

- Patient enters medications → system normalizes names (RxNorm when available) and checks interactions.
- By default (MVP) the system uses a local hardcoded table of the 20 most common dangerous drug pairs to guarantee demo reliability. If `DRUGBANK_API_KEY` (or another external lookup) is configured, the system may perform a live lookup against DrugBank or NIH RxNorm to provide expanded results.
- Dangerous pairs flagged and stored as warnings in the profile
- When professional accesses emergency view → high-severity interactions shown prominently in red
- Patient dashboard also shows their own warnings in plain language

**MVP behavior:** Use a local hardcoded table of the 20 most common dangerous drug pairs as the default interaction source to ensure the demo works offline and without API keys. External lookups (DrugBank / NIH RxNorm) are optional and used only when an API key is provided.

---

### 8. Zero-Knowledge Administrative Dashboard
**Purpose:** System governance without ever exposing patient data.

**What admins CAN see:**
- Total patient accounts (count only)
- Total verified professionals
- QR scan count (last 24h, 7d, 30d)
- System uptime and service health
- PRC verification queue (name, license number, profession — submitted by the professional)
- Audit log (anonymized event stream)

**What admins CANNOT see:**
- Any patient medical profile field
- Decrypted health data
- Emergency contact details

---

## Data Flow: Emergency Access (Critical Path)

```
Professional scans QR
        │
        ▼
GET /scan/[uuid]
  → Look up patient by UUID
  → If not found: 404
  → If found: render PIN entry UI (no patient data sent to client yet)
        │
        ▼
POST /api/qr/access
  { uuid, pin }
  → Validate PIN against professional account
  → Check professional PRC status = ACTIVE
  → Check failed attempt count < 5
  → Log access event (BEFORE decrypting)
  → Trigger notification job (async)
  → Decrypt patient medical profile
  → Return decrypted profile to professional client
        │
        ▼
Professional sees emergency view
  → Drug interaction warnings shown
  → Access duration tracked
  → On session end: duration logged
```

---

## Security Architecture

See `SECURITY.md` for full details.

| Concern | Approach |
|---|---|
| Data at rest | AES-256 encryption on all PHI fields |
| Auth | Session tokens (httpOnly cookie) |
| Role enforcement | Middleware checks role on every protected route |
| PIN brute force | 5-attempt lockout per QR UUID |
| Admin isolation | Admin routes never query the `medical_profiles` encrypted fields |
| PRC re-validation | Cron-style background job every 30 days |

---

## Deployment (MVP / Demo)

| Service | Provider |
|---|---|
| App hosting | Vercel |
| Database | Supabase (PostgreSQL) or Railway |
| Email | Nodemailer + Gmail SMTP or Resend |
| SMS | Twilio (or stub for demo) |
| QR generation | Server-side `qrcode` library |
