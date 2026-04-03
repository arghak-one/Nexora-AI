# Nexora AI - School Management Platform

## Overview
A Next-Gen AI-powered school management platform built with React, TypeScript, and Vite. Migrated from Lovable to Replit.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite (pure frontend, no backend server)
- **Routing**: React Router DOM v6
- **UI**: shadcn/ui components + Tailwind CSS + Radix UI primitives
- **State/Data**: TanStack React Query
- **Charts**: Recharts

## Pages
- `/` - Login / Index
- `/dashboard` - Main dashboard
- `/students` - Student list
- `/students/:id` - Student profile
- `/classes` - Class management
- `/teachers` - Teacher management
- `/results` - Academic results
- `/attendance` - Attendance tracking
- `/behaviour` - Behaviour records
- `/analytics` - Analytics overview
- `/ai-insights` - AI Insights page
- `/fees` - Fee management
- `/reports` - Reports
- `/parents` - Parent portal
- `/settings` - Settings
- `/profile` - User profile

## Running the App
- **Dev**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build` (outputs to `dist/`)
- **Preview**: `npm run preview`

## Key Configuration
- Vite configured to run on `0.0.0.0:5000` with `allowedHosts: true` for Replit compatibility
- Path alias `@` maps to `./src`
- `lovable-tagger` removed (Lovable-specific, not needed on Replit)
