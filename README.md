# Nexora AI

Nexora AI is a modern school management dashboard built with React, TypeScript, Vite, and Tailwind CSS. It combines academic operations, student lifecycle management, reporting, parent engagement, and AI-inspired insights into a single responsive admin interface.

The project is designed as a polished frontend experience for schools, coaching centers, and academic administrators who want a clean workflow for monitoring performance, attendance, behaviour, fees, and institutional activity.

## Highlights

- Unified dashboard for academic operations and institutional monitoring
- Student, teacher, class, and parent management flows
- AI-style risk scoring and insight cards for proactive intervention
- Attendance, results, behaviour, fees, and reports modules
- Global search across core entities
- Local persistence using `localStorage` for an app-like demo experience
- Responsive UI built with Tailwind CSS and shadcn/ui-inspired components

## Core Modules

### Dashboard
- KPI cards for attendance, marks, AI score, and risk indicators
- Performance charts and subject progress widgets
- Recent activity feed and AI insight summaries

### Students
- Create, edit, search, and remove student records
- Auto-calculated risk level and AI score based on attendance and marks
- Dedicated student profile pages with academic snapshots and suggestions

### Teachers
- Faculty directory with subject, class, email, and rating data
- Add, update, search, and remove teacher records

### Classes
- Class-wise overview with teacher, strength, average score, and attendance
- Search, filter, create, edit, and delete workflows

### Results
- Add and manage assessment records
- Grade, pass/fail status, and percentage calculation
- Filtering by class, subject, and search query

### Attendance
- Daily attendance summary and class-level tracking

### Behaviour
- Behaviour log management with positive, concern, and warning records
- View, edit, preview, and delete flows with confirmation modals

### AI Insights
- Insight cards for at-risk students, attendance alerts, subject weak zones, and smart recommendations

### Parents
- Parent profile and relationship management linked to student records

### Fees
- Fee tracking with paid, partial, and unpaid states
- Collection summary cards and CRUD workflows

### Reports
- Report listing, preview, edit, and delete flows
- Support for report-style content management inside the UI

### Settings & Profile
- Profile details, settings sections, and admin-style preferences screens

## Tech Stack

- React 18
- TypeScript
- Vite 5
- Tailwind CSS
- React Router DOM
- TanStack Query
- Recharts
- Radix UI primitives
- Vitest

## Project Structure

```text
src/
  components/     Reusable layout, widgets, modals, and UI building blocks
  hooks/          Shared React hooks
  lib/            Utility helpers and local storage-backed data store
  pages/          Route-level screens
  test/           Vitest setup and sample tests
public/           Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Installation

```bash
npm install
```

### Run The Development Server

```bash
npm run dev
```

By default, Vite will start a local development server and print the URL in your terminal.

### Build For Production

```bash
npm run build
```

### Preview The Production Build

```bash
npm run preview
```

### Run Tests

```bash
npm test
```

### Lint The Project

```bash
npm run lint
```

## Data Model Notes

This project currently behaves like a rich frontend prototype or standalone demo application:

- Core data is seeded with realistic academic sample records
- Updates are persisted in the browser through `localStorage`
- No backend or database is required for local usage

That makes it ideal for UI demos, portfolio presentation, rapid prototyping, and future API integration.

## Use Cases

- School admin dashboard prototypes
- EdTech product demos
- Academic analytics interfaces
- Student performance monitoring systems
- Parent communication and reporting portals

## Future Improvement Ideas

- Backend integration with authentication and role-based access control
- Real AI/ML prediction services for risk and recommendation engines
- Export pipelines for PDF, CSV, and scheduled reports
- Notification delivery via email, SMS, or push
- Multi-school tenancy and admin roles

## Status

Nexora AI is currently a frontend-first application with working module flows, local persistence, and a production-style UI foundation suitable for extension into a full-stack platform.
