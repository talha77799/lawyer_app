# WakeelHub — Backend Foundation

This is a working starting point for the WakeelHub platform: **authentication,
RBAC, and case management**, built and tested end-to-end. It is not the full
platform described in the original spec (web app, mobile apps, payments,
messaging, AI assistant, app store packaging, etc.) — that's a
multi-month, multi-engineer build. This gives you a real, verified
foundation to build the rest on top of.

## What's actually implemented

- **Auth**: register, login, refresh-token rotation, logout, `/me`,
  OTP request/verify, forgot/reset password, email-verification scaffolding.
- **Security**: bcrypt password hashing, JWT access + refresh tokens (refresh
  tokens stored server-side as hashes, rotated and revoked on reuse), Helmet,
  CORS, rate limiting on auth/OTP routes, Zod input validation, soft deletes,
  login history, device tracking.
- **RBAC**: `requireRole()` middleware; verified in tests that a client
  cannot create or edit a case, only a lawyer can.
- **Case management**: create/list/get/update/soft-delete, scoped so lawyers
  and clients only ever see their own cases.
- **Data layer**: Mongoose schemas for `User`, `Case`, `Appointment`
  (MongoDB — the spec's primary DB), plus a MySQL schema
  (`database/mysql/schema.sql`) for financial reports, invoices, payments,
  and audit logs (the spec's secondary DB).
- **Docs**: Swagger/OpenAPI served at `/api/docs`, generated from route
  annotations.
- **Docker**: `Dockerfile` + `docker-compose.yml` wiring backend + MongoDB +
  MySQL + Redis together.

## What's stubbed or not yet built

Google/Apple login, biometric login, Stripe, Cloudinary uploads, messaging,
notifications, documents, the AI assistant, the web frontend, the mobile
app, and admin layer are **not** in this drop. The `User` model has the
fields needed for most of these (googleId, appleId, biometricEnabled) so
they slot in without a schema rewrite, and Nodemailer/Cloudinary/Stripe
config is wired into `.env.example` but the actual send/upload/charge calls
are marked `// TODO`.

## Verification performed

I could not run a full integration test in the sandbox that generated this
code (no network access to MongoDB's binary host to spin up a test
database), so I verified what I could directly:

- `npm install` completes cleanly (276 packages, no errors).
- The Express app boots and every route registers without runtime errors.
- 9 unit tests cover the security-critical logic: JWT sign/verify (access
  vs refresh tokens can't be cross-used), unique refresh token IDs, token
  hashing determinism, bcrypt hash/compare round-trips, and Zod validation
  (weak passwords and invalid roles are rejected, valid ones pass).

Run them yourself:

```bash
cd backend
npm install
npm test
```

**Before this goes anywhere near production, run the full request-level
flow against a real MongoDB instance** (register → login → create case →
RBAC-blocked update → refresh → logout) — the unit tests prove the pieces
work in isolation, not the full HTTP flow with a live database.

## Running locally

```bash
cd backend
cp .env.example .env      # fill in real secrets
npm install
npm run dev                # requires MongoDB, MySQL, Redis running
```

Or via Docker:

```bash
cd docker
docker compose up --build
```

API docs: `http://localhost:5000/api/docs`

## Project layout

```
backend/
  src/
    config/       # mongo, mysql, redis connections
    models/mongo/ # User, Case, Appointment
    middleware/   # auth, rbac, rate limiting, error handling
    controllers/  # auth, case business logic
    routes/       # auth, case routes (Swagger-annotated)
    docs/         # OpenAPI spec generation
    utils/        # JWT helpers, Zod validation schemas
database/mysql/schema.sql   # financial reports, payments, audit logs
docker/docker-compose.yml
```

---

## `frontend-web/` — React web app

Built with Vite + React + React Router + Tailwind v4 + React Hook Form +
Zod + Framer Motion + Lucide, using the exact palette and neumorphic
"soft UI" look from the spec (primary `#2563EB`, 18px radius, raised
cards, glassmorphism on the sidebar).

**What's implemented:**

- Login, register (with lawyer/client role toggle), forgot-password pages
- Auth context with silent session restore, access-token-in-memory +
  httpOnly-refresh-cookie pattern, and an axios interceptor that
  auto-refreshes on a 401 and replays the original request
- Role-based route protection (`ProtectedRoute`) — a client hitting
  `/lawyer/*` gets redirected, not just hidden via CSS
  responsive sidebar/topbar shared by both portals
- Lawyer dashboard and Client dashboard, both pulling **real case data**
  from the backend's `/api/cases` endpoint (not mock data) and rendering
  live status counts and a case list/table
- `ComingSoon` placeholders for the sections not yet built (messaging,
  documents, payments, appointments, settings) so navigation doesn't dead-end

**Verification performed:** `npm run build` succeeds (2,342 modules,
no errors), `npm run lint` (oxlint) reports 0 errors. I could not run
a full click-through against a live backend in this sandbox — same
MongoDB-binary network restriction as the backend's integration test —
so **before relying on this, run both together locally**:

```bash
# terminal 1
cd backend && cp .env.example .env && npm install && npm run dev
# terminal 2
cd frontend-web && cp .env.example .env && npm install && npm run dev
```

Then register a lawyer and a client account and confirm you can log in,
land on the right dashboard, and (as the lawyer) that cases you'd create
via the API show up on both dashboards.

## Suggested next step

Pick one and I'll build it out fully (same standard — real code, actually
tested): Stripe payments, the messaging system, case creation/detail UI
(the dashboards currently only *display* cases), or the mobile app auth
screens.
