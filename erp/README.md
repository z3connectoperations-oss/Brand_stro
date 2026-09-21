# Brandstro ERP — frontend

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · lucide-react. Frontend only, but stateful: the seed data in `src/data/` loads into a client-side store (`src/lib/store.ts`), every form and action updates it immutably, alerts and reports are computed from it (`src/lib/rules.ts`), and the result persists in `localStorage` so a demo survives reloads. No backend, no auth yet. **Settings → Reset demo data** returns to the seed.

## Run

```sh
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also type-checks)
npm run lint
```

## Switching roles

There is no login. Pick who you are from the user menu at the bottom of the sidebar, or open any page with `?as=<role>`:

`founder` · `creative-head` · `crm` · `team-leader` · `designer` · `rnd` · `sketch` · `hr`

The choice is kept in `localStorage`. Each role sees its own sidebar and dashboard; shared pages (projects, board, review, incentives…) scope their content to the role.

## Pages (what the PDFs require, nothing more)

| Route | Who | Source rule |
|---|---|---|
| `/dashboard` | all (role-specific) | Role briefs: "Your rhythm", KPIs |
| `/leads`, `/leads/[id]` | Founder | Incentive Plan sales target; CRM brief "Sales handover notes" |
| `/clients`, `/clients/[id]` | Founder, CRM | CRM brief: Client Database, 7-step onboarding, feedback log, complaints |
| `/projects`, `/projects/[id]` | all | Guide ch. 6 lifecycle; deliverable-level stages; payment release gate |
| `/board` | Founder, CH, TL | Handbook §18 shared status view |
| `/queue`, `/queue/[id]` | R&D, Sketch | R&D brief (P1/P2/P3, 6-section template, handoff); Sketch brief (3–5 concepts) |
| `/tasks`, `/tasks/[id]` | Designer | Designer briefs: daily workflow, self-QC, file naming, versions |
| `/review`, `/review/[id]` | TL, CH | TL briefs: mandatory first-level QC; Handbook §28 7-point review |
| `/feedback` | Designer | Designer briefs: correction handling |
| `/approvals` | CRM, Founder | CRM brief: correction vs scope change; sign-off |
| `/follow-ups` | CRM | CRM brief: response-time SLAs, 3-day stall rule |
| `/payments` | Founder, CRM | 50/50 payment terms; escalation after one follow-up |
| `/complaints` | CRM | CRM brief: complaint process and categories |
| `/team` | Founder, CH, TL | Handbook §17 capacity tools; TL assignment rules |
| `/incentives` | all (scoped) | Incentive Plan: baselines, targets, tiers, 70/30 |
| `/alerts` | Founder, CH | All rule-driven escalations |
| `/reports` | Founder, CH | Handbook §30 dashboard, §25 revision tracking |
| `/reviews`, `/reviews/scorecard` | CH | Handbook §07 weekly TL review, §45 scorecard |
| `/settings` | Founder | Products, revision limits, rate table, SLAs, calendar |
| `/hr/attendance`, `/hr/leave`, `/hr/employees`, `/hr/checklists` | HR | HR brief |
| `/discovery`, `/discovery/[id]` | CRM | Handbook §27 briefing checklist with [CLIENT INPUT REQUIRED] flags → hands the brief to R&D |
| `/revisions` | Founder, CH, CRM, TL | Handbook §25 revision management |
| `/audit` | Founder, CH | Every action with actor and old → new value |

## What actually works (state changes)

Create project (from package template) · add lead / move lead stage · record payment (advance unblocks R&D queue; final unlocks files) · run discovery call → brief to R&D · R&D start / hand off · acknowledge handoff · sketch submit · assign work by load · designer submit to TL (self-check gate) · TL approve / rework · CRM submit to client · log feedback → classify (in scope / scope change / unclear) · Founder scope decision · client sign-off · reply to thread · log / advance complaint · send payment reminder. Each writes an audit entry.

`npx tsx scripts/store-walkthrough.ts` runs the whole lifecycle through the store and asserts every stage gate.

## Structure

```
src/
  app/            routes (App Router)
  components/
    shell/        sidebar, topbar, app shell
    ui/           primitives (Kpi, Pill, Card, Table, Checklist…)
    dashboards/   one dashboard per role
  forms/        create project, log feedback, assign work, add lead, log complaint
  data/           seed data: people, clients, projects, ops
  lib/            types, nav, role context, store + actions, selectors, rules (alerts/reports), formatting
scripts/          store lifecycle walkthrough
```

## Design

Follows the Stitch export in `../stitch_brandstro_founder_command_center/`: white sidebar, slate canvas, indigo primary, Plus Jakarta Sans + JetBrains Mono, KPI strip → filters → dense table/kanban, detail pages with a right-hand panel.

## Next steps

1. Settle the open questions in the Master Guide, Chapter 13 (team size, included revisions, CRM authority, work calendar).
2. Add a backend (PostgreSQL) behind the same entity shapes in `src/lib/types.ts`; replace `src/data/*` with API calls.
3. Auth and real role permissions (see Guide §12.4).
4. WhatsApp/email notifications for the alert rules in §12.5.
