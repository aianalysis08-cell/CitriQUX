# CritiqUX — AI-Powered UX Review Platform

> Get instant, expert-level UX feedback on your designs powered by AI.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4 + ShadCN UI
- **State**: Zustand + React Query
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **AI Engine**: OpenAI GPT-4o (Vision)
- **Payments**: Stripe
- **Email**: Resend
- **Deploy**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- OpenAI API key
- Stripe account (for billing features)

### Setup

```bash
# Install dependencies
npm install

# Copy env template and fill in values
cp .env.example .env.local

# Run the Supabase migration
# (via Supabase dashboard or CLI)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (marketing)/           # Public pages (landing, pricing)
│   ├── (auth)/                # Auth pages (login, signup)
│   ├── (dashboard)/           # Protected pages (dashboard, tools)
│   ├── admin/                 # Admin panel
│   ├── api/                   # API route handlers
│   └── feedback/[token]/      # Public feedback form
├── components/
│   ├── ui/                    # ShadCN UI primitives
│   ├── layout/                # Navbar, Sidebar, Footer, Topbar
│   ├── landing/               # Hero, Features, Pricing, CTA
│   ├── dashboard/             # StatsCards, RecentProjects
│   ├── project/               # ProjectCard, DesignUpload
│   ├── analysis/              # AnalysisReport, ScoreCard
│   ├── feedback/              # FeedbackForm
│   ├── billing/               # PlanSelector, UsageChart
│   ├── admin/                 # UserTable, PromptEditor
│   └── shared/                # Providers, LoadingSpinner
├── config/                    # Env validation, constants
├── hooks/                     # React Query hooks
├── lib/                       # Supabase clients, utils
├── prompts/                   # AI prompt templates
├── schemas/                   # Zod validation schemas
├── services/                  # AI engine, billing, email
├── stores/                    # Zustand stores
├── types/                     # TypeScript type definitions
└── utils/                     # API helpers, formatters
supabase/
├── migrations/                # SQL migration files
└── seed/                      # Seed data
```

## Features

| Feature | Status |
|---------|--------|
| UX Analysis (100-point scoring) | 🟡 Stub |
| A/B Testing | 🟡 Stub |
| Competitor Spy | 🟡 Stub |
| Redesign Generator | 🟡 Stub |
| Design Token Extraction | 🟡 Stub |
| Prototype Testing | 🟡 Stub |
| User Story Generator | 🟡 Stub |
| Feedback Collection | 🟡 Stub |
| Stripe Billing (Free/Pro) | 🟡 Stub |
| Team Collaboration | 🟡 Stub |
| Admin Panel | 🟡 Stub |

## ARB Build Progress

- [x] Phase 1 — Architecture Design
- [x] Phase 2 — Repository Generation
- [ ] Phase 3 — Database Generator
- [ ] Phase 4 — Backend API Generator
- [ ] Phase 5 — AI Engine Generator
- [ ] Phase 6 — Frontend Generator
- [ ] Phase 7 — Billing System
- [ ] Phase 8 — Security + Hardening
- [ ] Phase 9 — Deployment Generator

## License

Proprietary — © 2026 CritiqUX
