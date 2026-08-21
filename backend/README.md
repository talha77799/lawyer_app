# ZOR-Style Lawyer Booking Backend (VR-Digital API)

Complete REST API inspired by **https://zorservices.co/** — ready for **Web**, **Play Store**, and **App Store** clients.

## Stack
- Node.js 22+
- Express 4
- MongoDB + Mongoose 8
- JWT auth + Email OTP
- Swagger UI docs
- Helmet, CORS, Morgan

## Features (matched to ZOR)
| Module | Capabilities |
|--------|----------------|
| **Auth** | Register, login, JWT, profile, Email OTP |
| **Lawyers** | Search by city/area/online, profiles, join-as-lawyer |
| **Appointments** | Book video/in-person, calendar, status updates |
| **Cases** | Track Filed → Hearing → Judgment → Closed |
| **Availability** | Weekly slots, fee video/in-person, locations |
| **Wallet** | Lawyer balance, transactions, payout requests |
| **Reviews** | Rate lawyers, auto-update rating |
| **Dashboard** | Client + Lawyer stats |

## Quick Start

```bash
cd vr-digital-backend
cp .env.example .env
# Edit MONGODB_URI (Atlas recommended if local Mongo/Docker fails)
npm install
npm run seed
npm run dev
```

API: `http://localhost:5000` (or PORT from .env)  
Docs: `http://localhost:5000/api/docs`

### Demo logins (after seed)
Password for all: `password123`
- Client: `hassan.mehmood@email.com`
- Lawyer: `ayesha.khan@vrdigital.pk`

The seed script also creates the company owner admin account. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` before running `npm run seed`; the development fallback is `owner@vrdigital.pk` / `change-this-admin-password`. Admin registration is intentionally disabled.

## Main Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/otp/send
POST   /api/auth/otp/verify
GET    /api/auth/me

GET    /api/lawyers?city=&area=&q=&online=&sort=
GET    /api/lawyers/:id
POST   /api/lawyers/register
GET    /api/lawyers/cities
GET    /api/lawyers/practice-areas

POST   /api/appointments
GET    /api/appointments
GET    /api/appointments/calendar
PATCH  /api/appointments/:id/status

GET    /api/cases
POST   /api/cases
PATCH  /api/cases/:id

GET    /api/dashboard/client
GET    /api/dashboard/lawyer

GET    /api/availability/lawyer/:id
GET    /api/availability/me
PUT    /api/availability/me

GET    /api/wallet
POST   /api/wallet/payout

GET    /api/reviews/lawyer/:id
POST   /api/reviews

# Admin-only endpoints (Bearer token for a user with role=admin)
GET    /api/admin/overview
GET    /api/admin/:resource
PATCH  /api/admin/:resource/:id
DELETE /api/admin/:resource/:id
```

Same routes also under `/api/v1/...`

## Mobile (Play Store / App Store)
Point React Native / Expo / Capacitor apps at your deployed HTTPS API:

```
https://api.yourdomain.com/api
```

Auth header: `Authorization: Bearer <token>`

## .env
```
PORT=5001
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/vr_digital
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
SMTP_USER=   # optional – OTP prints in console if empty
SMTP_PASS=
RESEND_API_KEY=   # alternatively use Resend
RESEND_FROM="VR-Digital" <verified-email@yourdomain.com>
```

## Project structure
```
src/
  config/     db.js, swagger.js
  models/     User, Appointment, Case, Otp, Review, Wallet, Availability
  controllers/
  routes/
  middleware/ auth, errorHandler
  utils/      generateToken, sendEmail
  server.js
scripts/seed.js
```

© 2026 VR-Digital / ZOR-style legal booking API
