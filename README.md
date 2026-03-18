# Incentive Platform — MVP Hackathon

Plataforma de gestión de incentivos y bonos con reglas configurables, trazabilidad completa y flujo de aprobación.

## Stack
- **Next.js 15** (App Router) + TypeScript
- **Supabase** (PostgreSQL + Auth)
- **Tailwind CSS** + shadcn/ui
- **Vitest** para tests del rules engine

## Estructura
```
app/(admin)/     → Panel admin (dashboard, excepciones, payout)
app/(employee)/  → Vista empleado (mis objetivos, mi bono)
lib/domain/      → Rules engine puro + tipos
lib/dal/         → Data access layer (Supabase)
lib/demo-data.ts → Seed en memoria para demo sin DB
```

## Setup local
```bash
cp .env.example .env.local
# Completar variables de Supabase y Google OAuth
npm install
npm run dev
```

## Tests
```bash
npm test
```

## Demo (sin DB)
La app corre en modo demo con datos en memoria definidos en `lib/demo-data.ts`.
Navegar a:
- `/my-objectives` → Vista empleado (María Pérez)
- `/dashboard` → Panel admin
- `/exceptions` → Cola de revisión
- `/payout` → Payout run

## Migraciones Supabase
```bash
supabase db push
# o ejecutar manualmente:
# supabase/migrations/0001_init_schema.sql
# supabase/migrations/0002_rls_policies.sql
# supabase/seed/demo-data.sql
```
