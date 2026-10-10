# Lumina Portal — Freelancer Client Portal & Invoicing Suite

[![CI Pipeline](https://github.com/your-username/customer-portal-for-freelancers/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/customer-portal-for-freelancers/actions)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.10-2d3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0-yellow?style=flat&logo=vitest)](https://vitest.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?style=flat&logo=docker)](https://www.docker.com/)

A modern, full-stack client portal and project management platform built for independent professionals, consultants, and creative studios. The system streamlines milestone tracking, deliverable distribution, client invoicing, and online payment collection within an isolated, white-labeled client environment.

---

## Architecture Overview

```
                                 ┌─────────────────────────┐
                                 │   Lumina Portal Suite   │
                                 └────────────┬────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
         ┌─────────────────────────┐                     ┌─────────────────────────┐
         │  Freelancer Admin Space │                     │  Client-Facing Portal   │
         │       (/dashboard)      │                     │     (/portal/[id])      │
         └────────────┬────────────┘                     └────────────┬────────────┘
                      │                                               │
                      ├─ Contract & Scope Management                  ├─ Read-Only Milestones
                      ├─ Revenue Analytics & Cash Flow                ├─ Asset Download Center
                      ├─ Client Rosters & Email Invites               ├─ Stripe Online Checkout
                      └─ Invoice Publishing Engine                    └─ Real-Time Status Track
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
         ┌─────────────────────────┐                     ┌─────────────────────────┐
         │ PostgreSQL via Prisma 7 │                     │ Zero-Config Fallback    │
         │   (Relational Backend)  │                     │  (Isolated Local Store) │
         └─────────────────────────┘                     └─────────────────────────┘
```

---

## Core Capabilities

### 1. Freelancer Administrative Workspace (`/dashboard`)
- **Financial Analytics & Cash Flow:** KPI metrics tracking total collected volume, outstanding receivables, active client contracts, and monthly cash flow charts powered by Recharts.
- **Project & Milestone Tracking:** Comprehensive management of client contracts with interactive milestones (`TODO`, `IN_PROGRESS`, `DONE`) and dynamic progress calculation.
- **Client Management & Invitations:** Directory of client organizations, transaction history, and magic-link invitation dispatching via Resend.
- **Invoicing Suite:** Creation and distribution of professional line-item invoices linked to milestones with live rendering previews.

### 2. White-Labeled Client Experience (`/portal/[clientId]`)
- **Dedicated Client Workspace:** Clean interface isolated strictly to the authenticated client's active contracts, files, and billing statements.
- **Deliverables Distribution Engine:** Secure streaming of generated PDF specifications, design tokens, and digital assets.
- **Direct Checkout Integration:** Integrated Stripe Checkout workflows supporting instant receipt handling and status synchronization.

### 3. High-Resilience Data Layer
- **Relational PostgreSQL:** Primary schema managed via Prisma 7 with strict foreign key constraints and transactional integrity.
- **Zero-Dependency Evaluation Fallback:** Built-in persistence fallback mechanism enabling full local demonstration and testing without an external PostgreSQL instance.

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16.3](https://nextjs.org/) (App Router, Turbopack, Server Actions) |
| **Frontend** | [React 19.2](https://react.dev/), TypeScript, [Tailwind CSS v4](https://tailwindcss.com/), Framer Motion |
| **Data Layer** | [Prisma ORM 7](https://www.prisma.io/) with `@prisma/adapter-pg` & PostgreSQL |
| **Authentication** | [NextAuth.js v5 (Auth.js)](https://authjs.dev/) with Credentials & JWT Session Strategy |
| **Billing & Payments** | Stripe SDK (Checkout Sessions, Webhooks) |
| **Email Service** | Resend API integration |
| **Document Engine** | PDF-Lib (Dynamic cryptographic document generation) |
| **Testing** | [Vitest](https://vitest.dev/) (Unit & Service integration tests) |
| **Quality Gates** | ESLint 9, TypeScript strict mode, GitHub Actions CI |

---

## Repository Structure

```
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI automated pipeline
├── docs/
│   └── MANUAL_TESTING_GUIDE.md  # Step-by-step QA verification runbook
├── prisma/
│   ├── schema.prisma            # Prisma relational data model
│   └── seed.ts                  # Database seeding script
├── public/                      # Static assets & brand media
├── src/
│   ├── __tests__/               # Automated unit & service test suites
│   ├── app/                     # Next.js App Router (pages, layouts, API routes)
│   │   ├── api/                 # Backend REST endpoints (Stripe, Health, Deliverables)
│   │   ├── auth/                # Sign-in and registration views
│   │   ├── dashboard/           # Freelancer administrative workspace
│   │   └── portal/              # White-labeled client portal views
│   ├── components/              # Modular UI components & design system primitives
│   ├── lib/                     # Data stores, services, Prisma client & utilities
│   │   ├── actions/             # Server actions for state mutations
│   │   └── services/            # Business logic (Dashboard, Portal, PDF generation)
│   └── types/                   # TypeScript domain definitions
├── Dockerfile                   # Multi-stage production container image
├── docker-compose.yml           # Local multi-service infrastructure composition
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
└── vitest.config.mts            # Vitest runner configuration
```

---

## Getting Started

### Prerequisites
- Node.js `20.x` or `22.x`
- npm, pnpm, or yarn
- Docker & Docker Compose *(optional, for containerized PostgreSQL)*

### 1. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/customer-portal-for-freelancers.git
cd customer-portal-for-freelancers
npm install
```

### 2. Environment Configuration
Copy the sample environment file and configure variables as needed:

```bash
cp .env.example .env
```

Primary variables:
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lumina_portal?schema=public"
AUTH_SECRET="replace-with-a-secure-random-32-character-secret"

# Optional: Add live credentials when connecting external services
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
RESEND_API_KEY="re_..."
```

### 3. Database Migration & Seeding *(Optional for local PostgreSQL)*
When running against a PostgreSQL database:

```bash
# Generate Prisma Client & push schema
npx prisma generate
npx prisma db push

# Seed test fixtures
npx tsx prisma/seed.ts
```

> **Note:** If a PostgreSQL instance is not configured, the application automatically activates its built-in local store so all features remain functional out of the box.

### 4. Development Server
Start the local Next.js development server:

```bash
npm run dev
```

Navigate to `http://localhost:3000` in your browser.

---

## Test Accounts & Evaluation Access

For rapid evaluation without registration:

| Context | Route | Method |
|---|---|---|
| **Demo Freelancer** | `/auth/login` | Click **"Try Demo Account"** or use `demo@luminaportal.com` / `demoPassword2026!` |
| **Demo Client Portal** | `/portal/demo` | Direct white-labeled client preview for *Apex Tech Labs* |

---

## Quality Assurance & Automated Verification

The codebase adheres to strict engineering quality standards. Validate the codebase using the following commands:

```bash
# Execute automated unit and integration tests
npm run test

# Run code style & static analysis checks
npm run lint

# Verify type safety across the entire repository
npx tsc --noEmit

# Compile production-optimized bundle
npm run build
```

For complete step-by-step manual test cases, refer to the [QA Verification Runbook](docs/MANUAL_TESTING_GUIDE.md).

---

## Containerized Deployment (Docker)

To launch the application alongside PostgreSQL using Docker Compose:

```bash
docker compose up -d
```

The service will be accessible at `http://localhost:3000` with automated healthchecks configured.

---

## API Reference

| Endpoint | Method | Authentication | Description |
|---|---|---|---|
| `/api/health` | `GET` | Public | System observability, service latency, and subsystem health |
| `/api/auth/demo` | `POST` | Public | Instant 1-click evaluation session provisioning |
| `/api/auth/register` | `POST` | Public | Account creation with salted password hashing |
| `/api/clients/invite` | `POST` | Authenticated | Dispatches transactional onboarding email with magic link |
| `/api/deliverables/download` | `GET` | Public / Verified | Streams generated, validated PDF deliverable document |
| `/api/stripe/checkout` | `POST` | Authenticated | Provisions a Stripe Checkout Session |
| `/api/stripe/webhook` | `POST` | Signature Verified | Processes Stripe event webhooks (`checkout.session.completed`) |

---

## Security Practices

- **Zero Plaintext Secrets:** Passwords hashed with `bcryptjs`. Sensitive keys managed via environment variables.
- **Tenant Isolation:** Client portal views restrict access strictly to resources linked to the target client profile.
- **Strict Input Validation:** Server boundary sanitization across forms, payment sessions, and deliverable streaming endpoints.
- **Safe CI Pipeline:** Continuous quality gates execute type check, linting, tests, and build validation on every push.

---
