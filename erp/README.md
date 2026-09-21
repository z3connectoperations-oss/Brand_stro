# Brandstro ERP — frontend

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · lucide-react. Frontend only: all data is in-memory mock data under `src/data/`, shaped like the entities in the Master Operating Guide (Chapter 12). No backend, no auth yet.

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

## Structure

```
src/
  app/            routes (App Router)
  components/
    shell/        sidebar, topbar, app shell
    ui/           primitives (Kpi, Pill, Card, Table, Checklist…)
    dashboards/   one dashboard per role
  data/           mock data: people, clients, projects, ops
  lib/            types, nav config, role context, selectors, formatting
```

## Design

Follows the Stitch export in `../stitch_brandstro_founder_command_center/`: white sidebar, slate canvas, indigo primary, Plus Jakarta Sans + JetBrains Mono, KPI strip → filters → dense table/kanban, detail pages with a right-hand panel.

## Next steps

1. Settle the open questions in the Master Guide, Chapter 13 (team size, included revisions, CRM authority, work calendar).
2. Add a backend (PostgreSQL) behind the same entity shapes in `src/lib/types.ts`; replace `src/data/*` with API calls.
3. Auth and real role permissions (see Guide §12.4).
4. WhatsApp/email notifications for the alert rules in §12.5.
