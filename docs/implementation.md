# IMPLEMENTATION_PLAN.md — Lunas 24-Hour Sprint

## Team Roster & Roles

| # | Member | Role | Device |
|---|---|---|---|
| 1 | **You (Team Lead)** | Project Lead / Integration & QA | ✅ Codes |
| 2 | **Dev A** | Backend Lead (Auth, DB, API core) | ✅ Codes |
| 3 | **Dev B** | Backend (QR, Scan flow, Notifications) | ✅ Codes |
| 4 | **Dev C** | Frontend Lead (Patient flows) | ✅ Codes |
| 5 | **Dev D** | Frontend (Professional flows) | ✅ Codes |
| 6 | **Dev E** | Frontend (Admin panel + shared components) | ✅ Codes |
| 7 | **Member G** | Landing Page Developer + QA | ✅ Codes |
| 8 | **Member H** | Design QA + Demo Prep + Slide Deck | ❌ No device |

> Member H operates on borrowed time for non-coding tasks; Member G has a device and will code the landing page and assist with QA.

---

## Branch Strategy

```
main            ← protected; only merged to for final demo
develop         ← integration branch; everyone merges into here

feature/auth              → Dev A
feature/patient-api       → Dev A / Dev B
feature/qr-scan-flow      → Dev B
feature/notifications     → Dev B
feature/patient-ui        → Dev C
feature/professional-ui   → Dev D
feature/admin-ui          → Dev E
feature/shared-components → Dev E (early) then everyone uses
```

**Rule:** No one pushes directly to `develop`. Open a PR; Team Lead reviews and merges. Keep PRs small.

---

## Timeline Overview

| Phase | Hours | Focus |
|---|---|---|
| **Phase 0** | 0:00–1:00 | Setup & scaffolding — everyone unblocked |
| **Phase 1** | 1:00–5:00 | Foundation — DB, Auth, shared lib, core components |
| **Phase 2** | 5:00–13:00 | Core feature development (parallel tracks) |
| **Phase 3** | 13:00–19:00 | Integration, drug interaction, notifications |
| **Phase 4** | 19:00–22:00 | QA, bug fixing, polish |
| **Phase 5** | 22:00–24:00 | Demo prep, seed data, final deploy |

---

---

## PHASE 0 — Setup (Hours 0:00–1:00)
**All hands on deck. Goal: everyone can run the app locally by H+1.**

### Team Lead (You)
- [ ] Create GitHub repo, set up branch protection on `main`
- [ ] Run `npx create-next-app@latest lunas --typescript --tailwind --app`
- [ ] Install all dependencies (see `ENVIRONMENT.md`)
- [ ] Initialize Prisma: `npx prisma init`
- [ ] Paste full schema from `DATABASE_SCHEMA.md` into `prisma/schema.prisma`
- [ ] Create `.env.example` from `ENVIRONMENT.md`
- [ ] Create `.env` with real values (Supabase DB, Gmail SMTP, generated keys)
- [ ] Run `npx prisma migrate dev --name init && npx prisma generate`
- [ ] Push to GitHub. Share `.env` privately with the team (Discord DM / secure note)
- [ ] Confirm everyone can `git clone`, `npm install`, copy `.env`, and `npm run dev`

### All Coders (Dev A–E)
- [ ] Clone repo
- [ ] Set up `.env`
- [ ] Run `npm run dev` — confirm app loads
- [ ] Check out your assigned feature branch

### Member G
### Member G
- [ ] Create the project landing page: design, copy, and implementation
- [ ] Scaffold `app/landing` (or `pages/index.tsx`) with a responsive Tailwind layout
- [ ] Coordinate visuals and copy with Member H and prepare demo CTA / assets

### Member H
- [ ] Begin slide deck outline (Problem → Solution → Demo → Tech Stack → Team)
- [ ] Prepare demo script: patient registration → QR generation → professional scan → emergency view

---

---

## PHASE 1 — Foundation (Hours 1:00–5:00)
**Parallel tracks start. Goal: auth works, DB is live, shared components exist.**

---

### Dev A — Backend Lead
**Track: Auth + DB utilities**

Hour 1–2:
- [ ] `lib/db.ts` — Prisma client singleton
- [ ] `lib/crypto.ts` — `encrypt()` / `decrypt()` functions (see `SECURITY.md`)
- [ ] `lib/session.ts` — `createSession()`, `getSession()`, `deleteSession()`
- [ ] `lib/auth.ts` — `hashPassword()`, `verifyPassword()`, `requireRole()`

Hour 2–4:
- [ ] `POST /api/auth/register/patient`
- [ ] `POST /api/auth/register/professional`
- [ ] `POST /api/auth/login`
- [ ] `POST /api/auth/logout`
- [ ] `GET /api/auth/me`

Hour 4–5:
- [ ] `lib/audit.ts` — `logAdminEvent()` (hashed, zero-knowledge)
- [ ] Middleware: `middleware.ts` — redirect unauthenticated users from protected routes
- [ ] Merge `feature/auth` → `develop`

---

### Dev B — Backend (QR + Scan + Notifications)
**Track: QR generation utility + notification stubs**

Hour 1–2:
- [ ] `lib/mailer.ts` — Nodemailer setup, `sendEmail(to, subject, body)`
- [ ] `lib/sms.ts` — Twilio stub (or `console.log` fallback for demo)
- [ ] `lib/drugcheck.ts` — DrugBank API call + local fallback table (20 common dangerous pairs)

Hour 2–4:
- [ ] `lib/qr.ts` — `generateQrImage(uuid: string): Promise<string>` (returns base64 PNG)
- [ ] `GET /api/patient/qr` — returns QR UUID and base64 image
- [ ] `GET /api/scan/[uuid]` — public, returns minimal patient info for PIN entry screen

Hour 4–5:
- [ ] Write local drug interaction fallback table (at least 15 common pairs with severity)
- [ ] Test `generateQrImage()` in isolation — confirm PNG output
- [ ] Stub out notification function: `notifyEmergencyContacts(patientProfileId: string)`

---

### Dev C — Frontend Lead (Patient flows)
**Track: Auth pages + Patient dashboard skeleton**

Hour 1–2:
- [ ] `components/ui/` — Button, Input, Card, Badge, Spinner (Tailwind-based)
- [ ] `components/layout/PatientLayout.tsx` — sidebar nav (Dashboard, Medical Profile, QR Code, Access Logs, Logout)
- [ ] `app/(auth)/register/patient/page.tsx` — patient registration form

Hour 2–4:
- [ ] `app/(auth)/login/page.tsx` — login form (shared for all roles, redirect by role after login)
- [ ] `app/(patient)/dashboard/page.tsx` — skeleton: profile completion %, QR status, recent access (mock data OK)
- [ ] `app/(patient)/profile/page.tsx` — skeleton with sections: Basic Info, Allergies, Medications, Surgeries, Emergency Contacts

Hour 4–5:
- [ ] Wire registration and login pages to Auth API (`/api/auth/*`)
- [ ] Confirm login → redirect to `/patient/dashboard`
- [ ] Confirm `GET /api/auth/me` drives the dashboard user display

---

### Dev D — Frontend (Professional flows)
**Track: Professional registration + dashboard skeleton**

Hour 1–2:
- [ ] `components/layout/ProfessionalLayout.tsx` — sidebar (Dashboard, Scan Patient QR, Recent Patients, My Profile, Logout)
- [ ] `app/(auth)/register/professional/page.tsx` — professional registration form (includes PRC number, specialization, hospital fields)

Hour 2–4:
- [ ] `app/(professional)/dashboard/page.tsx` — skeleton: scans today, patients this week, pending notes, PRC status, recent patient list
- [ ] `app/(professional)/scan/page.tsx` — QR scanner UI (use `react-qr-reader` or camera access + `jsQR`)
- [ ] `app/scan/[uuid]/page.tsx` — public PIN entry page (no auth required, shows patient first name, PIN input, authenticate button)

Hour 4–5:
- [ ] Wire professional registration to API
- [ ] Wire login → redirect to `/professional/dashboard`
- [ ] PIN entry page should call `POST /api/scan/access` (wire up in Phase 2)

---

### Dev E — Frontend (Admin + Shared)
**Track: Shared UI components + Admin panel skeleton**

Hour 1–2:
- [ ] `components/ui/Table.tsx` — reusable sortable table
- [ ] `components/ui/StatusBadge.tsx` — colored badge (Active/Pending/Suspended/Denied/Success)
- [ ] `components/ui/MetricCard.tsx` — stat display card (used across all dashboards)
- [ ] `components/layout/AdminLayout.tsx` — sidebar (Overview, Users, Expert Verifications, Audit Logs, System Health)

Hour 2–4:
- [ ] `app/(admin)/overview/page.tsx` — system metrics (mock data OK)
- [ ] `app/(admin)/verifications/page.tsx` — list with Approve/Reject buttons (skeleton)
- [ ] `app/(admin)/users/page.tsx` — user list table (skeleton)

Hour 4–5:
- [ ] `app/(admin)/audit-logs/page.tsx` — log table with event type filter (skeleton)
- [ ] `app/(admin)/system-health/page.tsx` — service status cards (skeleton)
- [ ] Push all shared UI components. Announce to team that `components/ui/*` is ready to use.

---

### Team Lead (You) — Hour 1–5
- [ ] Review and merge Auth PR from Dev A as soon as it's ready
- [ ] Set up `app/api/` folder structure (create placeholder files for all routes so no 404s block others)
- [ ] Write `prisma/seed.ts` — seed 1 admin, 2 patients, 2 verified professionals, sample data
- [ ] Run seed: `npx prisma db seed`
- [ ] Coordinate blockers — if anyone is stuck for >20 min, jump in

---

---

## PHASE 2 — Core Feature Development (Hours 5:00–13:00)
**Longest phase. Full parallel development. All major features built.**

---

### Dev A — Patient Profile API
- [ ] `GET /api/patient/profile` — fetch + decrypt full profile
- [ ] `PUT /api/patient/profile` — update basic info (encrypt before save)
- [ ] `POST /api/patient/allergies` + `DELETE /api/patient/allergies/:id`
- [ ] `POST /api/patient/medications` + `DELETE /api/patient/medications/:id`
  - On every medication add/delete: call `lib/drugcheck.ts` and update `DrugInteraction` records
- [ ] `POST /api/patient/surgeries` + `DELETE /api/patient/surgeries/:id`
- [ ] `POST /api/patient/emergency-contacts` + `DELETE /api/patient/emergency-contacts/:id`
- [ ] `GET /api/patient/access-logs`
- [ ] Admin routes: `GET /api/admin/overview`, `GET /api/admin/users`

---

### Dev B — Emergency Access Flow + Notifications
- [ ] `POST /api/scan/access` — the most critical endpoint (full implementation):
  1. Find patient by UUID
  2. Find professional by session
  3. Check `prcStatus === VERIFIED`
  4. Check `pinFailCount < 5`
  5. Verify PIN with `bcrypt.compare()`
  6. If fail: increment `pinFailCount`, log `DENIED`, return error
  7. If locked: log `LOCKED`, return 423
  8. If success: log `SUCCESS` (access log), fire `notifyEmergencyContacts()` async, decrypt and return patient record
- [ ] `notifyEmergencyContacts()` — fetch emergency contacts, decrypt mobile/email, send email + SMS
- [ ] `GET /api/admin/verifications`, `POST /api/admin/verifications/:id/approve`, `POST /api/admin/verifications/:id/reject`
  - Approve flow: generate PIN → hash → store → email PIN to professional
- [ ] `GET /api/admin/audit-logs`
- [ ] `GET /api/admin/system-health` — check DB connectivity, return mock status for other services

---

### Dev C — Patient UI (Full Implementation)
Using the real API now (not mock data).

- [ ] `app/(patient)/profile/page.tsx` — full form implementation:
  - Basic info section (blood type dropdown, height, weight, organ donor toggle)
  - Allergies section: list + add form (allergen, reaction, severity dropdown) + delete
  - Medications section: list + add form + delete (shows drug interaction warnings inline)
  - Surgeries section: list + add form + delete
  - Emergency contacts section: list + add form + delete
  - Save button → `PUT /api/patient/profile`
  - Profile completion % display (calculate client-side based on filled fields)
- [ ] `app/(patient)/access-logs/page.tsx` — table with professional name, PRC #, timestamp, duration, status badge
- [ ] Wire dashboard to real `GET /api/patient/profile` data

---

### Dev D — Professional UI (Full Implementation)
- [ ] `app/scan/[uuid]/page.tsx` — full PIN entry page:
  - Show patient first name ("Accessing medical passport of Maria")
  - 6-dot PIN input (masked)
  - Submit → `POST /api/scan/access`
  - Show attempt count / lockout message
  - On success → redirect to emergency view with patient data in state (or query param token)
- [ ] `app/(professional)/emergency-view/page.tsx` — the emergency patient view:
  - Dark/high-contrast mode
  - Header: patient name, age, blood type, organ donor status
  - Allergies list (life-threatening shown in RED with bold text)
  - Medications list
  - Drug interactions section (HIGH severity in red, MODERATE in yellow)
  - Surgeries/history
  - Footer: "EMERGENCY VIEW — ACCESS LOGGED — CONTACTS NOTIFIED"
- [ ] `app/(professional)/dashboard/page.tsx` — wire to `GET /api/professional/dashboard`
- [ ] `app/(professional)/profile/page.tsx` — wire to `GET /api/professional/profile`

---

### Dev E — Admin UI (Full Implementation)
- [ ] `app/(admin)/overview/page.tsx` — wire to `GET /api/admin/overview`
- [ ] `app/(admin)/verifications/page.tsx` — wire to `GET /api/admin/verifications`:
  - Table with professional name, PRC #, profession, submitted date
  - Approve → `POST /api/admin/verifications/:id/approve` → success toast → refresh
  - Reject → modal with reason → `POST /api/admin/verifications/:id/reject`
- [ ] `app/(admin)/users/page.tsx` — wire to `GET /api/admin/users`
- [ ] `app/(admin)/audit-logs/page.tsx` — wire to `GET /api/admin/audit-logs`
- [ ] `app/(admin)/system-health/page.tsx` — wire to `GET /api/admin/system-health`, show service status cards

---

### Team Lead (You) — Hour 5–13
- [ ] Continuous integration: merge PRs as they come in, resolve conflicts
- [ ] Test the auth flow end-to-end (register → login → dashboard for all 3 roles)
- [ ] Test the QR scan flow end-to-end as soon as Dev B's endpoint and Dev D's UI are ready
- [ ] Keep a running list of bugs for Phase 4
- [ ] Check in with G and H on progress

### Member G (Landing Page)
- [ ] Implement landing page sections: Hero, Features, Tech Stack, Team, Demo CTA
- [ ] Ensure responsive and accessible design; include screenshots and a quick demo GIF
- [ ] Add a simple contact/demo signup form (placeholder) and SEO/meta tags

### Member H (Design QA + Demo Prep, no device)
- [ ] Pair with Dev D — guide the emergency view UI for high-stress readability (font size, contrast, info hierarchy)
- [ ] Build the demo slide deck:
  - Slide 1: Team name + tagline
  - Slide 2: The Problem (statistics from rationale)
  - Slide 3: The Solution — Lunas overview
  - Slide 4: How it works (3-step flow: patient QR → professional scan → emergency view)
  - Slide 5: Key features table
  - Slide 6: Tech stack
  - Slide 7: Security & compliance
  - Slide 8: Live demo (placeholder — "DEMO HERE")
  - Slide 9: Team + contact
- [ ] Write the live demo script (step-by-step narrator guide for the demo segment)

---

---

## PHASE 3 — Integration & Polish (Hours 13:00–19:00)
**Connect everything. Fill gaps. No major new features.**

### Dev A
- [ ] Finalize input validation with `zod` on all API routes
- [ ] Add proper HTTP status codes and error messages everywhere
- [ ] Test all patient API routes with Postman or Thunder Client

### Dev B
- [ ] End-to-end test the full scan flow: scan → PIN → access log created → notification sent
- [ ] Confirm drug interaction check fires correctly on medication add/delete
- [ ] Test the admin approve flow: approve → PIN generated → PIN emailed to professional

### Dev C
- [ ] Polish patient profile form UX (loading states, success toasts, error messages)
- [ ] Add drug interaction warnings inline in the Medications section
- [ ] Ensure profile completion percentage updates on save

### Dev D
- [ ] Polish the emergency view — make it look excellent for the demo
- [ ] Add a "QR Scanner" page using device camera (use `jsQR` library or `react-zxing`)
- [ ] Test: scan a real printed/displayed QR code → lands on correct PIN entry page

### Dev E
- [ ] Wire admin verifications approve/reject with real API
- [ ] Add empty state handling (e.g., "No pending verifications" message)
- [ ] Test admin panel never shows patient PHI (console.log check on responses)

### Team Lead (You)
- [ ] End-to-end integration test for all three user journeys
- [ ] Fix any broken routes or redirect issues
- [ ] Deploy to Vercel: `vercel --prod`
- [ ] Set all env vars in Vercel dashboard
- [ ] Confirm production URL works before Phase 4

### Member G
- [ ] Finalize landing page content and visuals; collect screenshots and demo assets from dev teams
- [ ] Deploy landing page to Vercel (production) and verify the live route and meta tags
- [ ] Coordinate with Team Lead to ensure demo CTA links point to the live app and provide screenshots/GIFs for the slide deck

### Member H
- [ ] Finalize slide deck
- [ ] Rehearse demo script with Team Lead
- [ ] Prepare seed data personas for demo (name the demo patient "Maria Santos", demo doctor "Dr. Ramon Cruz")
- [ ] Print or prepare a physical/digital QR code for the live scan demo moment

---

---

## PHASE 4 — QA & Bug Fixing (Hours 19:00–22:00)
**All coders fix P1 and P2 bugs from G's list. No new features.**

### Priority Bug Assignments
- Team Lead: assigns P1 bugs to whichever coder is most relevant
- Each coder: fix their own area's bugs first
- Member G: re-test after each fix, update the bug doc; verify landing page updates and fixes
- Member H: do final visual QA pass — check every screen for layout breaks, typos, missing loading states

### All Coders — Checklist
- [ ] All forms show loading state while waiting for API
- [ ] All API errors show a user-friendly message (not a raw JSON error)
- [ ] Login/logout works correctly for all three roles
- [ ] 404 page exists and looks decent
- [ ] Mobile responsive — check patient profile and emergency view on a phone screen
- [ ] No console errors in the browser (fix or suppress non-critical ones)
- [ ] Access log shows correct data after a scan

---

---

## PHASE 5 — Demo Prep & Final Deploy (Hours 22:00–24:00)

### Team Lead
- [ ] Final `git merge develop → main`
- [ ] Final production deploy
- [ ] Run `npx prisma db seed` on production DB (or verify seed data is there)
- [ ] Test the full demo flow on the live URL one final time
- [ ] Confirm QR code scans correctly on a mobile phone on the live URL

### Dev A
- [ ] Verify admin account credentials work on production
- [ ] Confirm all environment variables are set in Vercel

### Dev B
- [ ] Send a test email notification — confirm it arrives
- [ ] Test drug interaction warning shows for the demo medications (Salbutamol + Losartan)

### Dev C + D + E
- [ ] Final UI review of your assigned screens
- [ ] Fix any last-minute visual issues

### Member G
- [ ] Finalize and verify the landing page on the production URL; ensure CTAs link correctly
- [ ] Run final smoke tests of deployed links and capture screenshots/GIFs for slides
- [ ] Document any known limitations of the landing page for the presentation

### Member H
- [ ] Finalize and export slide deck as PDF backup
- [ ] Set up demo device (phone for QR scanning, laptop for the web app)
- [ ] Brief the whole team on the demo order

---

## Demo Flow (Live 5-Minute Demo)

1. **[30 sec]** Open admin panel → show pending verification queue → approve "Dr. Ramon Cruz"
2. **[30 sec]** Show the email that arrives with the professional's PIN
3. **[1 min]** Log in as patient "Maria Santos" → show medical profile (allergies, meds, drug interaction warning) → show QR code
4. **[1 min]** Switch to mobile device → log in as Dr. Cruz → open QR scanner → scan Maria's QR code
5. **[1 min]** Enter the 6-digit PIN on the PIN entry screen → authenticate
6. **[30 sec]** Emergency patient view appears — show blood type, allergies in red, drug interaction banner
7. **[30 sec]** Back to Maria's patient dashboard → show the new access log entry (Dr. Cruz, timestamp, SUCCESS)

**Total: ~5 minutes**

---

## Emergency Fallbacks for Demo

| If this breaks... | Do this instead |
|---|---|
| QR scanner doesn't work | Navigate directly to `/scan/{uuid}` URL from slides |
| Email not sending | Show a pre-sent email in Gmail inbox |
| Drug interaction API down | Local fallback table is auto-used — no action needed |
| Database connection fails | Run locally on localhost:3000 and screen share |
| Professional PIN forgotten | Check DB directly: `npx prisma studio` → ProfessionalProfile → view pin field (it's hashed — use the one stored in your notes) |

> **Always have the PIN written down somewhere before the demo.**
