# VR-Digital Backend API

Complete REST API for the **VR-Digital** lawyer booking platform.  
Matches the frontend (lawyers, clients, appointments, cases, dashboards, auth).

## Stack

- **Node.js 22+**
- **Express 4**
- **MongoDB** (use MongoDB Compass to inspect data)
- **Mongoose 8**
- **JWT** authentication
- **bcryptjs** password hashing
- Helmet, CORS, Morgan

> MySQL is not required for this backend. All data lives in MongoDB.  
> You can still use MySQL Shell / Compass side-by-side if you later add a hybrid setup.

## Quick Start

### 1. Prerequisites
- Node.js **22** or higher
- MongoDB running locally (or Atlas URI)
  - Install MongoDB Community + **MongoDB Compass** to view collections visually

### 2. Install
```bash
cd vr-digital-backend
cp .env.example .env
npm install
```

### 3. Configure `.env`
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/vr_digital
JWT_SECRET=change-this-to-a-long-random-string
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### 4. Seed sample data (matches frontend)
```bash
npm run seed
```

Demo accounts (password for all: `password123`):
- **Client**: `hassan.mehmood@email.com`  → Dashboard shows "Welcome back, Hassan Mehmood"
- **Lawyer**: `ayesha.khan@vrdigital.pk`

### 5. Run
```bash
npm run dev     # with --watch (Node 22)
# or
npm start
```

API: `http://localhost:5000`  
Health: `http://localhost:5000/api/health`

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register client/lawyer |
| POST | `/api/auth/login` | No | Login → JWT |
| GET | `/api/auth/me` | Yes | Current user |
| PUT | `/api/auth/profile` | Yes | Update profile |

### Lawyers
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/lawyers` | No | List / filter (city, area, q, online, sort) |
| GET | `/api/lawyers/:id` | No | Lawyer profile |
| POST | `/api/lawyers/register` | No | Join as lawyer |
| GET | `/api/lawyers/cities` | No | Cities list |
| GET | `/api/lawyers/practice-areas` | No | Practice areas |

### Appointments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/appointments` | Yes | Book appointment |
| GET | `/api/appointments` | Yes | My appointments |
| GET | `/api/appointments/calendar` | Yes | Calendar data |
| PATCH | `/api/appointments/:id/status` | Yes | Update status |

### Cases
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cases` | Yes | My cases |
| GET | `/api/cases/:id` | Yes | Case detail |
| POST | `/api/cases` | Yes | Create case |
| PATCH | `/api/cases/:id` | Yes | Update progress/status |

### Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard/client` | Client | Client stats + upcoming + cases |
| GET | `/api/dashboard/lawyer` | Lawyer | Lawyer stats + bookings + earnings |

---

## Example Requests

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hassan.mehmood@email.com","password":"password123"}'
```

**List lawyers in Lahore**
```bash
curl "http://localhost:5000/api/lawyers?city=Lahore&sort=rating"
```

**Book appointment** (use token from login)
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"lawyerId":"LAWYER_OBJECT_ID","date":"2026-08-20","time":"11:00","type":"video"}'
```

---

## Project Structure
```
vr-digital-backend/
├── src/
│   ├── config/db.js
│   ├── models/          User, Appointment, Case
│   ├── controllers/
│   ├── routes/
│   ├── middleware/      auth, errorHandler
│   ├── utils/
│   └── server.js
├── scripts/seed.js
├── .env.example
├── package.json
└── README.md
```

## Connect Frontend

In your React frontend, set:
```
VITE_API_URL=http://localhost:5000/api
```

Then replace mock data calls with `fetch` / axios to these endpoints.

## Notes on MySQL / React Native

- **MongoDB Compass**: open `mongodb://127.0.0.1:27017` → database `vr_digital` to browse Users, Appointments, Cases.
- **MySQL Shell**: not used by this API. If you need MySQL later, you can add a dual-write layer; current design is pure MongoDB.
- **React Native / Expo**: consume the same REST API. Auth header: `Authorization: Bearer <token>`.

© 2026 VR-Digital
