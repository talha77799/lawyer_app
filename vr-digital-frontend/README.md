# VR-Digital Frontend

Complete frontend for **VR-Digital** — a lawyer booking platform inspired by zorservices.co.

## Features

- **Home** — Hero search, popular practice areas, cities, how-it-works
- **Find Lawyers** — Filter by city, specialization, online status, sort by rating/fee/experience
- **Lawyer Profile** — Bio, education, bar council, availability slots, book CTA
- **Book Appointment** — Video / in-person, slot selection, notes, payment summary
- **Client Dashboard** — Stats, upcoming appointments, case progress, recommended lawyers
- **Lawyer Dashboard** — Bookings, clients, earnings, case overview table
- **Calendar** — Month view with appointments, upcoming events table
- **Case Tracker** — Multi-step progress (Filed → Hearing → Judgment → Closed)
- **Join as Lawyer** — Registration form with benefits
- **Login / Sign Up** — Client & Lawyer roles

## Mock Data Included

- 8 verified lawyers across major Pakistani cities
- 5 clients
- 5 appointments
- 4 cases with progress tracking
- Cities & practice areas lists

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router v6
- Lucide React icons
- date-fns

## Run Locally

```bash
cd vr-digital-frontend
npm install
npm run dev
```

Open http://localhost:5173

## App download links

Set these Vite environment variables to enable the download buttons on `/download-app`:

```bash
VITE_ANDROID_APP_URL=https://play.google.com/store/apps/details?id=your-published-app-id
VITE_IOS_APP_URL=https://apps.apple.com/app/your-app-id
```

## Build for Production

```bash
npm run build
```

Output in `dist/` — ready for web hosting.  
The web build is installable as a PWA. Android and iOS builds use the included Capacitor projects in `android/` and `ios/`; publish those builds and set `VITE_ANDROID_APP_URL` and `VITE_IOS_APP_URL` to their store listings.

```bash
npm run cap:sync
npm run android:open
npm run ios:open
```

## Project Structure

```
src/
  components/   Navbar, Footer, LawyerCard
  pages/        Home, Lawyers, LawyerProfile, Dashboards, Calendar, etc.
  data/         mockData.ts (lawyers, clients, appointments, cases)
  styles/       index.css (complete design system)
```

© 2026 VR-Digital
