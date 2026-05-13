# ENVIRONMENT.md — Environment Variables & Setup Guide

## Step 1: Initialize the Project

```bash
npx create-next-app@latest lunas --typescript --tailwind --app --src-dir=false --import-alias="@/*"
cd lunas
npm install prisma @prisma/client bcrypt nodemailer qrcode zod
npm install -D @types/bcrypt @types/nodemailer @types/qrcode ts-node
```

> For SMS (optional in MVP): `npm install twilio`
> For DrugBank: use their REST API with fetch (no SDK needed)

---

## Step 2: Create `.env` File

Copy `.env.example` and fill in all values:

```bash
cp .env.example .env
```

---

## `.env.example`

```env
# ─────────────────────────────────────────
# DATABASE
# ─────────────────────────────────────────

# PostgreSQL connection string
# Local: postgresql://postgres:password@localhost:5432/lunas
# Supabase: Get from Project Settings > Database > Connection string (URI)
# Railway: Get from your Railway PostgreSQL service
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/lunas"

# ─────────────────────────────────────────
# APP
# ─────────────────────────────────────────

# Base URL of the app (used for QR code URLs and email links)
# Development: http://localhost:3000
# Production: https://your-app.vercel.app
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ─────────────────────────────────────────
# SECURITY & CRYPTO
# ─────────────────────────────────────────

# AES-256 encryption key for PHI fields
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY="your-64-char-hex-key-here"

# Salt for hashing IDs in audit logs (prevents rainbow table attacks)
# Generate: node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
HASH_SALT="your-32-char-hex-salt-here"

# Session secret (sign session tokens)
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET="your-64-char-hex-session-secret-here"

# ─────────────────────────────────────────
# EMAIL (SMTP)
# ─────────────────────────────────────────

# Option A: Gmail (for hackathon/demo)
# Enable "App Passwords" in Google Account > Security
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-gmail@gmail.com"
SMTP_PASS="your-gmail-app-password"
SMTP_FROM="Lunas Emergency System <your-gmail@gmail.com>"

# Option B: Resend (recommended — free tier available)
# SMTP_HOST="smtp.resend.com"
# SMTP_PORT="465"
# SMTP_USER="resend"
# SMTP_PASS="re_xxxxxxxxxxxx"
# SMTP_FROM="Lunas <onboarding@resend.dev>"

# ─────────────────────────────────────────
# SMS (Optional for MVP)
# ─────────────────────────────────────────

# Twilio — free trial available at twilio.com
# If not set, SMS will be skipped (email-only notifications)
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1xxxxxxxxxx"

# ─────────────────────────────────────────
# DRUG INTERACTION API
# ─────────────────────────────────────────

# External drug interaction lookup (optional)
# - The MVP uses a local hardcoded table of the 20 most common dangerous drug pairs by default
#   to guarantee the demo works without external API keys.
# - If you provide `DRUGBANK_API_KEY` the app may query DrugBank for expanded interaction data.
# - Optionally, you can integrate NIH RxNorm normalization/lookup for improved matching.
DRUGBANK_API_KEY="your-drugbank-api-key"

# ─────────────────────────────────────────
# ADMIN BOOTSTRAP
# ─────────────────────────────────────────

# Email and password for the initial admin account (created during seed)
ADMIN_EMAIL="admin@lunas.app"
ADMIN_PASSWORD="ChangeMe_Before_Demo_2026!"
```

---

## Step 3: Generate Secret Keys

Run these in your terminal and paste the output into `.env`:

```bash
# Encryption key (AES-256)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Hash salt
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

# Session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 4: Set Up Database

### Option A — Local PostgreSQL (if you have it installed)

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE lunas;"

# DATABASE_URL = postgresql://postgres:yourpassword@localhost:5432/lunas
```

### Option B — Supabase (Recommended for hackathon)

1. Go to [supabase.com](https://supabase.com) and create a free project
2. Go to **Settings > Database > Connection string (URI)**
3. Copy the connection string into `DATABASE_URL`

### Option C — Railway

1. Go to [railway.app](https://railway.app) and add a PostgreSQL service
2. Copy the connection string from the service dashboard

### Run Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Seed the Database (Demo Data)

```bash
npx prisma db seed
```

---

## Step 5: Email Setup (Gmail Quick Start)

1. Go to your Google Account → **Security** → **2-Step Verification** (must be enabled)
2. Then go to **Security** → **App Passwords**
3. Generate an app password for "Mail" / "Other (custom name: Lunas)"
4. Paste that 16-character password into `SMTP_PASS`

---

## Step 6: Run the App

```bash
npm run dev
# App running at http://localhost:3000
```

---

## Environment Variable Usage Reference

| Variable | Used In | Required |
|---|---|---|
| `DATABASE_URL` | `lib/db.ts` (Prisma) | ✅ Yes |
| `NEXT_PUBLIC_APP_URL` | QR code URL generation, email links | ✅ Yes |
| `ENCRYPTION_KEY` | `lib/crypto.ts` | ✅ Yes |
| `HASH_SALT` | `lib/audit.ts` | ✅ Yes |
| `SESSION_SECRET` | `lib/session.ts` | ✅ Yes |
| `SMTP_HOST/PORT/USER/PASS/FROM` | `lib/mailer.ts` | ✅ Yes |
| `TWILIO_*` | `lib/sms.ts` | ⚠️ Optional |
| `DRUGBANK_API_KEY` | `lib/drugcheck.ts` | ⚠️ Optional — the app defaults to a local 20-pair table for the MVP; external lookup only when configured |
| `ADMIN_EMAIL/PASSWORD` | `prisma/seed.ts` | ✅ Yes (for seeding) |

---

## Vercel Deployment

1. Push your repo to GitHub
2. Import into Vercel
3. Go to **Settings > Environment Variables**
4. Add all variables from `.env` (do NOT add the `NEXT_PUBLIC_` prefix ones as secrets — Vercel handles those automatically)
5. Deploy

> Important: In production, set `NEXT_PUBLIC_APP_URL` to your actual Vercel URL before the final demo.
