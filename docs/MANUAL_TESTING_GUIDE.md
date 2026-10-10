# Quality Assurance & Manual Verification Runbook

This document outlines the manual verification procedures for the Lumina Portal suite. It covers end-to-end user workflows across both the Freelancer Administration Workspace and the White-Labeled Client Portal.

---

## 1. Environment & Setup

Ensure the application is running locally before conducting test procedures:

```bash
# Start local development server
npm run dev

# Or start containerized stack
docker compose up -d
```

Base URL: `http://localhost:3000`

---

## 2. Test Suites & Verification Procedures

### Suite 1: Theme Consistency & Responsive Layout

| Field | Detail |
|---|---|
| **Objective** | Verify theme persistence, contrast compliance, and viewport responsiveness. |
| **Route** | `/` (Landing Page) |

**Execution Steps:**
1. Navigate to `http://localhost:3000`.
2. Locate the theme toggle icon in the top navigation bar.
3. Toggle between Dark Mode and Light Mode.
4. Open browser developer tools (`F12`), toggle device emulation mode, and inspect layouts across mobile (`375px`), tablet (`768px`), and desktop (`1280px+`) viewports.

**Expected Results:**
- Visual styles transition smoothly without flashing or hydration mismatch.
- Layout remains fluid with no horizontal overflow across all tested viewports.
- Active theme persists across navigation.

---

### Suite 2: Authentication & Demo Mode Access

| Field | Detail |
|---|---|
| **Objective** | Verify session initiation, route protection, and 1-click evaluation access. |
| **Routes** | `/`, `/auth/login`, `/auth/register`, `/dashboard` |

**Execution Steps:**
1. Navigate to `http://localhost:3000` and click **"Try Demo Account"**.
2. Verify redirect to `/dashboard` with demo banner displayed.
3. Click **Sign Out** from the dashboard header menu.
4. Attempt navigating directly to `http://localhost:3000/dashboard` while unauthenticated.
5. Navigate to `/auth/login` and authenticate with test credentials:
   - **Email:** `demo@luminaportal.com`
   - **Password:** `demoPassword2026!`
6. Navigate to `/auth/register` to verify the account creation form inputs and client-side validations.

**Expected Results:**
- Demo login provisions a valid session and redirects to `/dashboard` immediately.
- Unauthenticated access to `/dashboard` redirects to the login route.
- Standard credentials authentication succeeds and maintains JWT session state.

---

### Suite 3: Freelancer Dashboard & Project Management

| Field | Detail |
|---|---|
| **Objective** | Verify revenue metrics calculation, Recharts graph rendering, and project state mutations. |
| **Routes** | `/dashboard`, `/dashboard/projects`, `/dashboard/projects/[id]`, `/dashboard/projects/new` |

**Execution Steps:**
1. Navigate to `/dashboard` and inspect the primary KPI cards:
   - Total Collected Revenue
   - Outstanding Invoices
   - Active Contracts Count
   - Managed Clients Count
2. Hover over the **Monthly Revenue Analytics** chart to inspect tooltips and data point rendering.
3. Navigate to `/dashboard/projects` and apply status filters (`ALL`, `IN PROGRESS`, `PLANNING`, `COMPLETED`).
4. Enter search terms in the search field to verify real-time client/title filtering.
5. Click **"Create New Project"**, fill in title, client, budget, and initial deliverables, then submit.
6. Open an existing project (e.g., *Enterprise Design System*) and click a task checkbox to cycle its state (`TODO` -> `IN_PROGRESS` -> `DONE`).
7. Update the project status from the header dropdown menu.

**Expected Results:**
- Chart renders responsive SVG elements with accurate month/value tooltips.
- Project filtering operates with zero latency.
- Task status toggles update the overall project progress bar dynamically.
- Project creation and detail updates persist across page reloads.

---

### Suite 4: White-Labeled Client Portal

| Field | Detail |
|---|---|
| **Objective** | Verify client tenant isolation, read-only permissions, and deliverables downloading. |
| **Route** | `/portal/demo` (or `/portal/[clientId]`) |

**Execution Steps:**
1. Navigate to `http://localhost:3000/portal/demo`.
2. Verify white-labeled presentation: admin navigation bars and freelancer controls are removed.
3. Open the **"Projects & Milestones"** tab and verify milestone tasks render in read-only state.
4. Open the **"Deliverables & Files"** tab and click **"Download Deliverable"** on an asset.
5. Verify downloaded file integrity and HTTP response headers (`Content-Type: application/pdf`).

**Expected Results:**
- Client interface remains strictly isolated from administrative actions.
- Progress bar accurately mirrors milestone completion.
- Deliverable downloads stream signed, validated PDF documents successfully.

---

### Suite 5: Client Invitation Workflow

| Field | Detail |
|---|---|
| **Objective** | Verify client record creation and transactional invitation dispatching. |
| **Route** | `/dashboard/clients` |

**Execution Steps:**
1. Navigate to `/dashboard/clients`.
2. Inspect client ledger containing total contract values and direct portal URLs.
3. Click **"Invite New Client"** to open the modal dialog.
4. Input Company Name, Contact Name, and valid email address.
5. Submit the form and observe modal confirmation state.

**Expected Results:**
- New client profile is recorded in storage.
- Invitation dispatch triggers email service adapter with magic link URL.
- Error notification appears if duplicate or malformed email address is entered.

---

### Suite 6: Invoice Generation & Stripe Checkout Integration

| Field | Detail |
|---|---|
| **Objective** | Verify invoice ledger calculations, real-time preview card, and Stripe session generation. |
| **Routes** | `/dashboard/invoices`, `/dashboard/invoices/new`, `/portal/demo` |

**Execution Steps:**
1. Navigate to `/dashboard/invoices` and review status breakdown (`PAID`, `PENDING`, `OVERDUE`).
2. Navigate to `/dashboard/invoices/new`:
   - Select an assigned project.
   - Enter an amount (e.g., `3500`).
   - Observe the live preview card update dynamically in the right panel.
   - Click **"Publish Invoice"**.
3. Open the client portal at `/portal/demo` and select the **"Invoices & Payments"** tab.
4. Locate the pending invoice and click **"Pay with Stripe"**.
5. Observe checkout initialization, session creation, and callback state handling.

**Expected Results:**
- Live invoice preview card reflects input changes instantly.
- Invoice appears in both admin and client portals with `PENDING` status.
- Stripe payment flow initiates valid checkout session and updates status upon confirmation.

---

### Suite 7: Health Check & System Monitoring

| Field | Detail |
|---|---|
| **Objective** | Verify system observability, latency metrics, and subsystem availability. |
| **Route** | `/api/health` |

**Execution Steps:**
1. Request `GET http://localhost:3000/api/health` via browser or HTTP client:
   ```bash
   curl -i http://localhost:3000/api/health
   ```
2. Verify HTTP `200 OK` status and structured JSON response payload.

**Expected Response Schema:**
```json
{
  "status": "healthy",
  "service": "Lumina Portal SaaS",
  "version": "1.0.0",
  "responseTimeMs": 12,
  "checks": {
    "database": "operational",
    "auth": "operational",
    "stripe": "configured",
    "email": "configured"
  }
}
```

---

## 3. Automated Regression Verification

In addition to manual tests, execute the automated test and validation pipeline before releasing changes:

```bash
# 1. Type validation
npx tsc --noEmit

# 2. Linting rules
npm run lint

# 3. Automated unit & service test suite
npm run test

# 4. Production build compilation
npm run build
```
