"""Chapters 1-6: orientation, business, organisation, project lifecycle."""
from reportlab.platypus import Paragraph, Spacer, NextPageTemplate, PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from kit import P, H1, H2, H3, B, T, Callout, Flow, ST, esc, ACCENT, TEAL, RED, GREEN, make_toc


def cover():
    white = ParagraphStyle("cw", fontName="UI", fontSize=11, leading=16, textColor=colors.HexColor("#D6DCE6"))
    return [
        Spacer(1, 70),
        Paragraph("BRANDSTRO", ParagraphStyle("ck", fontName="UI-B", fontSize=12, leading=16, textColor=ACCENT)),
        Spacer(1, 10),
        Paragraph("Master Operating Guide", ParagraphStyle("ct", fontName="UI-B", fontSize=34, leading=40, textColor=colors.white)),
        Spacer(1, 6),
        Paragraph("Every Brandstro document in one place, explained step by step, and turned into a blueprint for the ERP.",
                  ParagraphStyle("cs", fontName="UI", fontSize=14, leading=20, textColor=colors.white)),
        Spacer(1, 150),
        Paragraph(esc("<b>Combines:</b> Creative Head Leadership Handbook · Performance Incentive Plan · Role briefs for the "
                      "CRM, HR / Admin, R&D, Sketch Artist, Logo Team Leader, Logo Designer, Packaging Team Leader and Packaging Designer"), white),
        Spacer(1, 10),
        Paragraph(esc("<b>Part A</b> (this guide): explanation, analysis and ERP blueprint<br/>"
                      "<b>Part B</b> (appendix): all 10 original PDFs, unchanged, bookmarked"), white),
        Spacer(1, 10),
        Paragraph("Prepared: 21 September 2026 · Version 1.0", white),
        NextPageTemplate("main"),
        PageBreak(),
        P("Contents", "h1"),
        Spacer(1, 6),
        make_toc(),
    ]


def ch_how_to_read():
    return [
        *H1("How to Read This Guide", "Start here",
            "Brandstro's rules currently live in ten separate PDFs written for different readers. This guide puts them into one "
            "picture: what the business sells, who does what, how work moves, how people are measured and paid, and what an ERP "
            "has to model to run all of it."),
        H3("Who this is for"),
        P("Anyone designing or building the Brandstro ERP: the Founder, a product designer, or a developer who has never worked "
          "in a branding agency. You don't need to read the originals first. Every rule below points back to the "
          "document it came from."),
        H3("How it is organised"),
        *T([["Chapter", "What you get", "Read it if you want to…"],
            ["2. At a glance", "The whole business on one page", "a 5-minute overview"],
            ["3. Source documents", "What each of the 10 PDFs is for", "to know which document says what"],
            ["4. What Brandstro sells", "Products, prices, monthly targets, capacity", "to design products, orders, billing"],
            ["5. Organisation", "People, reporting lines, salary bands", "to design users, roles, permissions"],
            ["6. Project lifecycle", "Every stage from lead to final files", "to design the project workflow and statuses"],
            ["7. Roles in detail", "Each role's duties, rhythm, checklists, KPIs", "to design each person's screens and tasks"],
            ["8. Company-wide rules", "SLAs, scope, escalation, naming, QC, leave", "to design validations and automations"],
            ["9. Incentive plan", "Targets and bonus formulas, recalculated", "to design the incentive/payroll engine"],
            ["10. Leadership system", "The Creative Head's management framework", "to design dashboards, reviews, scorecards"],
            ["11. Tools today → ERP", "Sheets and WhatsApp groups the ERP replaces", "to plan data migration"],
            ["12. ERP blueprint", "Modules, entities, statuses, permissions, alerts", "to start building"],
            ["13. Gaps and contradictions", "Where documents disagree or are silent", "to know what to ask the Founder first"],
            ["14. Glossary and numbers", "Terms and key numbers", "a quick reference"]],
          [0.25, 0.4, 0.35]),
        H3("Conventions used"),
        *B(["<b>Source tags</b> such as [CRM] or [Handbook §24] show which document a rule comes from.",
            "Amounts are in Indian Rupees (₹), written in Indian digit grouping as in the originals (₹3,53,500 = 353,500).",
            "<b>ERP note</b> boxes turn a business rule into something the system must do.",
            "<b>Watch out</b> boxes (red) mark a contradiction or gap between documents. These are collected in Chapter 13."]),
        *Callout("Source tags used in this guide",
                 ["[Handbook] Creative Head Leadership Handbook · [Incentive] Performance Incentive Plan · [CRM] [HR] [R&D] [Sketch] "
                  "[LogoTL] [LogoDes] [PackTL] [PackDes] = the individual role briefs."], TEAL),
    ]


def ch_glance():
    return [
        *H1("Brandstro at a Glance", "Chapter 2",
            "A young branding agency in Tamil Nadu that designs logos, brand identities, labels and packaging for "
            "clients, run by its Founder (Zameel) with a 12-person production and support team plus a Creative Head."),
        H2("The business in one paragraph"),
        P("Brandstro sells four products: <b>Logo Design</b> (₹6,000), a <b>Branding + Logo Package</b> (₹15,000), "
          "<b>Standalone Label Design</b> (₹2,500) and <b>Standalone Packaging Design</b> (₹3,500). The client pays 50% up front "
          "and 50% before final files are released. Every project starts with <b>research</b> (R&D). Logo work then goes to a "
          "<b>hand sketch</b> (Sketch Artist) and on to <b>digital design</b> (Logo Team). Packaging, labels and branding collateral "
          "go to the <b>Packaging Team</b>. A <b>Team Leader review</b> checks all work before the <b>Client Relationship Manager (CRM)</b>, "
          "the only person who talks to clients, presents it. Corrections loop back until the client signs off. Then the "
          "second payment is collected and final files are delivered."),
        H2("The key numbers"),
        *T([["Measure", "Value", "Source"],
            ["Company age (when handbook was written)", "About 3 months", "[Handbook §16]"],
            ["Monthly sales target", "47 client engagements = ₹3,53,500 revenue", "[Incentive]"],
            ["Team covered by incentive plan", "12 people", "[Incentive]"],
            ["Fixed monthly payroll", "₹1,26,000", "[Incentive]"],
            ["Bonus payout if everyone hits target", "₹61,900", "[Incentive]"],
            ["Overheads (rent, software, electricity, misc.)", "₹17,000 / month", "[Incentive]"],
            ["Profit at full target", "₹1,48,600 (~42% margin; required band 40–50%)", "[Incentive]"],
            ["The hard capacity limit", "Sketch Artist: 1 concept set/day ≈ 24/month", "[Sketch][Incentive]"],
            ["The problem that triggered all this", "30 new clients in a month, only 6–8 projects completed", "[Handbook §17]"]],
          [0.42, 0.40, 0.18]),
        H2("The six ideas that run through every document"),
        *T([["Principle", "What it means in practice", "Why it matters for the ERP"],
            ["1. One voice to the client", "Only the CRM (or Founder) speaks to clients. Designers, R&D and the Sketch Artist never do unless authorised.",
             "Client messages and submissions must flow through the CRM. Other roles need no client-contact screens."],
            ["2. If it's not in the sheet, it didn't happen", "WhatsApp is for speed, but every status change, deadline, feedback item and approval must be logged.",
             "The ERP becomes the single source of truth. WhatsApp only notifies."],
            ["3. Nothing skips Team Leader review", "Every logo, label, pack and collateral piece passes a QC checklist before a client sees it.",
             "A mandatory 'TL Review' status gate with a checklist record."],
            ["4. Scope is protected", "A correction refines what was agreed. A new direction or extra deliverable is a scope change, escalated to the Founder.",
             "Feedback must be classified; scope changes need an approval workflow."],
            ["5. Bottlenecks are protected", "R&D and the Sketch Artist cap the whole company's output. Their queues follow strict priority.",
             "Queue management with P1/P2/P3 priority and capacity visibility."],
            ["6. Fix systems, not symptoms", "Recurring problems get a checklist, tracker or rule, not a pep talk.",
             "Dashboards, trend reports and repeat-issue detection are core features, not extras."]],
          [0.22, 0.43, 0.35]),
    ]


def ch_sources():
    return [
        *H1("The Source Documents", "Chapter 3",
            "Ten PDFs, 107 pages. One long leadership handbook, one financial plan, and eight short role briefs that share the same layout."),
        *T([["#", "Document", "Pages", "Written for", "What it covers"],
            ["1", "Creative Head Leadership Handbook (v1.0)", "70", "Creative Head + Founder",
             "49 sections in 8 parts: the Creative Head's role, leading Team Leaders, running the department, agency-specific leadership, "
             "operating rhythm, a 30/60/90-day plan, 16 office scenarios, a monthly scorecard."],
            ["2", "Performance Incentive Plan (final draft)", "13", "Founder",
             "Monthly sales target, each role's baseline, target and bonus per project, company economics (revenue, payroll, bonus, profit)."],
            ["3", "CRM Brief", "3", "Client Relationship Manager", "Client onboarding, SLAs, correction flow, scope rules, complaints, escalation."],
            ["4", "HR / Admin Brief", "3", "HR / Admin", "Attendance, leave, records, discipline, onboarding and exit."],
            ["5", "R&D Brief", "3", "R&D researcher", "Research brief template, P1/P2/P3 queue, handoff rules, 2 briefs/day benchmark."],
            ["6", "Sketch Artist Brief", "3", "Sketch Artist", "3–5 distinct concepts per logo, quality checklist, 1 set/day benchmark."],
            ["7", "Logo Team Leader Brief", "3", "Logo Team Leader", "Assigning work, Logo QC checklist, mandatory review, file naming, escalation."],
            ["8", "Logo Designer Brief", "3", "Logo Designers", "Daily workflow, self-QC, file naming, corrections, KPIs."],
            ["9", "Packaging Team Leader Brief", "3", "Packaging Team Leader", "Assigning work, print-readiness QC, branding-package planning."],
            ["10", "Packaging Designer Brief", "3", "Packaging Designers", "Packaging, labels and collateral workflow, print-ready checklist, file naming."]],
          [0.04, 0.24, 0.07, 0.17, 0.48], font_size=8),
        H2("How the documents fit together"),
        P("The <b>eight role briefs</b> all share one structure: a mission quote, <i>What you own</i>, <i>Your rhythm</i> "
          "(daily/weekly/monthly), a workflow, a checklist, <i>What you decide vs. what you escalate</i>, KPIs, and a <i>Day 1</i> list. "
          "Each says it is part of the <b>'Brandstro Internal Operating System — Phase 1'</b> and points to a <b>master SOP</b> "
          "(e.g. 'Full SOP: Section 6.3'). The <b>Incentive Plan</b> puts numbers on the same roles. The <b>Handbook</b> sits above them "
          "all: it describes how the Creative Head should manage the Team Leaders who run those roles."),
        *Callout("Watch out: the master SOP is referenced but not included",
                 "Every brief says 'Full detail in the master SOP, Sections 6.x, 7, 9, 10, 12–20, 22, 24, 28–31, 34–38'. That SOP is "
                 "not among the ten files. It probably holds details the ERP needs (package definitions, revision limits, "
                 "folder structure 01–08, payment terms). Ask the Founder for it before finalising the data model.", RED),
    ]


def ch_products():
    return [
        *H1("What Brandstro Sells", "Chapter 4",
            "Four products. The product mix is chosen around one fact: the Sketch Artist can produce only about 24 sketches a month."),
        H2("Products, prices and monthly targets"),
        *T([["Product", "Price", "Monthly target", "Revenue", "Who produces it"],
            ["Logo Design Only", "₹6,000", "8", "₹48,000", "R&D → Sketch Artist → Logo Team"],
            ["Branding + Logo Package", "₹15,000", "16", "₹2,40,000", "R&D → Sketch → Logo Team (logo) + Packaging Team (collateral)"],
            ["Standalone Label Design", "₹2,500 (1st)", "15", "₹37,500", "R&D → Packaging Team"],
            ["Standalone Packaging Design", "₹3,500 (1st)", "8", "₹28,000", "R&D → Packaging Team"],
            ["<b>Total</b>", "", "<b>47</b>", "<b>₹3,53,500</b>", ""]],
          [0.26, 0.13, 0.13, 0.14, 0.34]),
        H3("What is inside the Branding + Logo Package"),
        P("From [PackDes], [PackTL] and [Incentive]: the logo, plus a coordinated set of non-logo deliverables: <b>brand guideline book, "
          "visiting card, letterhead, t-shirt, and custom packaging</b>. The Packaging Team Leader must plan this whole set 'as one "
          "coordinated job, not scattered pickups'. A logo client presentation is typically a <b>~5-page mockup</b> [Handbook §24]."),
        H2("Why the mix looks like this (the capacity logic)"),
        *B(["Logo-only and Branding both need a sketch. 8 + 16 = <b>24 sketches</b>, exactly the Sketch Artist's monthly capacity.",
            "The Sketch Artist can't do more, so the plan sells more of the <b>higher-value</b> Branding package (₹15,000) and fewer Logo-only "
            "jobs (₹6,000) within the same 24 slots. Revenue rises with no extra sketch work.",
            "Label and Packaging were cut (Label 28 → 15, Packaging 12 → 8). This gives the Packaging Team slack: it uses about "
            "<b>58 of its 84</b> available working days a month (4 people × 21 days).",
            "Result: fewer projects (47, down from 64) and more revenue (₹3,53,500, up from ₹3,46,000)."]),
        *Callout("Risk the plan itself names",
                 "Branding packages carry more deliverables per project than Logo-only. With 16 a month (up from 10), watch whether the Logo "
                 "and Packaging teams keep pace. The ERP's capacity dashboard should track this from month one.", ACCENT),
        H2("Payment terms"),
        *B(["<b>50% advance</b> when the order is confirmed. Work (the discovery call and R&D) starts only after this [Handbook §24][R&D: queue is 'in the order payment was confirmed'].",
            "<b>50% final</b> collected <b>before</b> final files are handed over [Handbook §24].",
            "The CRM confirms payment status per project, and on-time 50/50 collection is part of the CRM's bonus [Incentive]."]),
        *Callout("ERP note",
                 ["Products need: name, base price, <i>price for additional units</i> (the '(1st)' in label/packaging pricing suggests a "
                  "different price for extra labels/packs), included deliverables, included revision rounds, and which teams/stages they route through.",
                  "Orders need two invoice milestones (advance and final), and 'final files released' must be blocked until the final payment is recorded."], TEAL),
    ]


def ch_org():
    return [
        *H1("Organisation & People", "Chapter 5",
            "A small, flat agency: a Founder who also sells, a Creative Head over the creative teams, two Team Leaders, "
            "two single-person bottleneck roles, and two support roles."),
        H2("Reporting structure"),
        *Flow(["Founder (Zameel)<br/>sales · pricing · hiring · escalations"], per_row=1),
        *T([["Reports to Founder", "Reports to Creative Head", "Reports to Logo TL", "Reports to Packaging TL"],
            ["Creative Head<br/>Client Relationship Manager (CRM)<br/>HR / Admin",
             "R&D (1)<br/>Sketch Artist (1)<br/>Logo Team Leader (1)<br/>Packaging Team Leader (1)<br/>Internal Content Team Leader",
             "Logo Designers (3 per Incentive; 4 per LogoTL brief)",
             "Packaging Designers (3)"]],
          [0.25, 0.3, 0.23, 0.22]),
        H2("Headcount, pay and targets"),
        *T([["Role", "People", "Base salary", "Target monthly earning", "Reports to", "Brief"],
            ["R&D", "1", "₹10,000", "₹12,000", "Creative Head", "[R&D]"],
            ["Sketch Artist", "1", "₹10,000", "₹15,000", "Creative Head", "[Sketch]"],
            ["Logo Designer", "3", "₹10,000", "₹15,000", "Logo TL", "[LogoDes]"],
            ["Logo Team Leader", "1", "₹12,000", "₹17,000", "Creative Head", "[LogoTL]"],
            ["Packaging Designer", "3", "₹10,000–12,000 (one senior at ₹12,000)", "₹15,000–17,000", "Packaging TL", "[PackDes]"],
            ["Packaging Team Leader", "1", "₹12,000", "₹17,000", "Creative Head", "[PackTL]"],
            ["Client Relationship Manager", "1", "₹10,000", "₹20,000", "Founder", "[CRM]"],
            ["HR / Admin (called 'HR / Personal Assistant' in Incentive)", "1", "₹10,000", "₹15,000", "Founder", "[HR]"],
            ["<b>Total covered by incentive plan</b>", "<b>12</b>", "<b>₹1,26,000</b>", "", "", ""],
            ["Creative Head", "1", "not stated", "not stated", "Founder", "[Handbook]"],
            ["Internal Content Team", "not stated", "not stated", "not stated", "Creative Head", "[Handbook §29]"]],
          [0.28, 0.08, 0.2, 0.16, 0.14, 0.14], font_size=8),
        P("Check of the payroll figure: 10k (R&D) + 10k (Sketch) + 30k (3 Logo) + 12k (Logo TL) + 32k (Packaging: 12k + 10k + 10k) + 12k "
          "(Pack TL) + 10k (CRM) + 10k (HR) = <b>₹1,26,000</b>. This matches the Incentive Plan and confirms it assumes 3 Logo Designers "
          "and <b>excludes the Creative Head and the Content Team</b>.", "small"),
        H2("Who decides what: the authority layers"),
        *T([["Layer", "Owns", "Source"],
            ["Founder", "Business direction, pricing and packages, sales, major escalations, culture, final call on hiring, discipline warnings, HR policy, refunds.",
             "[Handbook §05][CRM][HR]"],
            ["Creative Head", "Department-wide performance, Team Leader development, cross-team coordination, productivity, quality standards, "
             "capacity planning, process improvement. Approves urgent (P1) R&D projects, missed client deadlines, extra unpaid revisions.", "[Handbook §05][LogoTL][R&D]"],
            ["Team Leaders", "Daily team management, task allocation, first-level QC review, team deadlines, coaching, rework decisions.", "[Handbook §05][LogoTL][PackTL]"],
            ["Team Members", "Executing assigned work to standard and deadline, flagging blockers early, following process.", "[Handbook §05]"],
            ["CRM (side role)", "All client communication, in-scope corrections, complaint first response, payment follow-up.", "[CRM]"],
            ["HR / Admin (side role)", "Attendance, leave, records. Administers policy but does not set it. Never involved in creative decisions.", "[HR]"]],
          [0.18, 0.64, 0.18]),
        *Callout("Watch out: Logo Team size",
                 "The Logo Team Leader brief says 'balance load across all <b>4</b> designers … you're not just the 5th designer'. The Incentive "
                 "Plan and payroll use <b>3</b> Logo Designers. The Handbook says a 'four-person Logo team' (likely TL + 3). The ERP should not hard-code team "
                 "sizes, but the Founder must confirm the real number because it changes capacity and bonus targets.", RED),
    ]


def ch_lifecycle():
    return [
        *H1("How a Project Flows, End to End", "Chapter 6",
            "The most important chapter for the ERP. It combines the flows in the CRM, R&D, Sketch, Logo and Packaging briefs "
            "and the 8-stage process in Handbook §24 into one lifecycle."),
        H2("The master lifecycle"),
        *Flow(["1. Lead &amp; Sale<br/>(Founder)", "2. Advance 50%<br/>paid", "3. Onboarding &amp;<br/>Discovery (CRM)",
               "4. Project Brief<br/>→ R&amp;D", "5. R&amp;D research<br/>brief",
               "6a. Sketch<br/>(logo work)", "6b. Design<br/>(Logo / Packaging)", "7. Team Leader<br/>QC review",
               "8. Client submission<br/>(CRM)", "9. Feedback &amp;<br/>corrections loop",
               "10. Client<br/>sign-off", "11. Final 50%<br/>collected", "12. Final files<br/>delivered", "13. Close &amp;<br/>bonus tally"],
             per_row=5),
        H2("Stage by stage"),
        *T([["#", "Stage", "Owner", "What happens", "Output / record", "Source"],
            ["1", "Lead & sale", "Founder (Sales)", "Leads arrive in the 'Leads' WhatsApp group. The Founder sells a package and price and writes handover notes (package, price, promises made).", "Sales handover notes", "[CRM][Incentive]"],
            ["2", "Advance payment", "CRM / Founder", "50% advance confirmed. This date sets the project's position in the R&D queue (FIFO).", "Payment record", "[Handbook §24][R&D]"],
            ["3", "Onboarding & discovery", "CRM", "Add to Client Database. Send welcome message (package, price, next step). Schedule the meeting in the 'Client Meetings' group. Run a structured discovery call. Collect logos, photos and references into the Drive project folder.", "Client record, discovery notes, materials", "[CRM]"],
            ["4", "Project Brief handed to R&D", "CRM", "Clarify requirements before they reach R&D. Hand over the completed Project Brief with its priority. Missing info is flagged [CLIENT INPUT REQUIRED], not assumed.", "Project Brief", "[CRM][Handbook §27]"],
            ["5", "R&D research", "R&D", "Work the queue by priority (P1 > P2 FIFO > P3). Produce the structured research brief (6 sections). Save it to 02_R&D. Mark it complete in the Project Tracker. Tag the next owner and confirm pickup.", "Research brief", "[R&D]"],
            ["6a", "Sketch (logo & branding only)", "Sketch Artist", "3–5 genuinely distinct concepts (e.g. wordmark vs symbol vs combination mark), with a one-line rationale each. Self-check, then submit to the Logo TL with the research brief attached.", "Concept set", "[Sketch]"],
            ["6b", "Design development", "Logo Designer / Packaging Designer", "TL assigns by load. Logo: typography, colour, composition, refinement, mockup. Packaging: layout, typography, colour, info hierarchy, mockup, print-ready artwork (bleed, safe area, CMYK). Designer self-checks the QC list.", "Versioned design files", "[LogoDes][PackDes]"],
            ["7", "Team Leader review", "Logo TL / Packaging TL", "Mandatory QC checklist on every piece. Pass, or send back for rework. Nothing reaches the Creative Head or CRM without TL sign-off.", "QC checklist log", "[LogoTL][PackTL]"],
            ["8", "Client submission", "CRM", "CRM sends the presentation/mockup. Acknowledge the submission the same business day it's received from production.", "Submission record", "[CRM]"],
            ["9", "Feedback & corrections", "CRM → TL → Designer", "CRM documents the feedback and checks it's clear. In scope: assign to the team. Scope change: escalate to the Founder. Designer fixes, TL reviews again, CRM resubmits.", "Feedback log, revision count", "[CRM]"],
            ["10", "Client sign-off", "CRM", "Explicit final approval. The Handbook notes this step did not exist formally before; the CRM brief now requires it.", "Approval record", "[CRM][Handbook §24]"],
            ["11", "Final payment", "CRM", "Collect the remaining 50%. Follow up once, then escalate to the Founder if it's still unpaid.", "Payment record", "[CRM][Handbook §24]"],
            ["12", "Final files", "Designer / TL", "Only TL-approved final versions go into 08_Final Files and are handed over.", "Final file set", "[LogoDes][PackDes]"],
            ["13", "Close", "TL + CRM", "TL logs completion with the revision count against the person. CRM confirms payment. These feed the month-end bonus tally.", "Completion record", "[Incentive]"]],
          [0.04, 0.13, 0.13, 0.42, 0.14, 0.14], font_size=7.6),
        H2("The three routes through production"),
        H3("Route A: Logo Design Only"),
        *Flow(["R&amp;D brief", "Sketch Artist<br/>3–5 concepts", "Logo TL assigns", "Logo Designer<br/>develops", "Logo TL review",
               "CRM → client", "Corrections", "Sign-off", "Final files"], per_row=5),
        H3("Route B: Branding + Logo Package"),
        P("The logo follows Route A. In parallel, or after the logo is approved (the documents don't say which; see Chapter 13), the Packaging TL plans the "
          "whole collateral set (guidelines, visiting card, letterhead, t-shirt, packaging) as one job for the Packaging Team."),
        H3("Route C: Standalone Label or Packaging"),
        *Flow(["R&amp;D brief", "Packaging TL assigns", "Packaging Designer<br/>concept + artwork", "Packaging TL<br/>print-ready review",
               "CRM → client", "Corrections", "Sign-off", "Print-ready<br/>final files"], per_row=4),
        *Callout("Watch out: the sketch step is not always used",
                 ["Handbook §18 and §24 say that today R&D sometimes briefs the Sketch Artist, sometimes sends ideas straight to Logo, and sometimes "
                  "a logo designer originates the concept. The sketch step is 'sometimes skipped'. The briefs describe the ideal path.",
                  "ERP implication: route is a <b>per-project choice</b> recorded on the project, so everyone can see which path applies."], RED),
        H2("Throughput benchmarks (capacity data)"),
        *T([["Function", "Headcount", "Benchmark", "≈ Monthly capacity", "Source"],
            ["R&D", "1", "2 project briefs/day", "~42–48", "[R&D][Handbook §17]"],
            ["Sketch Artist", "1", "1 concept set/day", "24 (stated)", "[Sketch][Incentive]"],
            ["Logo Designer", "3 (or 4)", "1 logo/day each", "Target 7 finished logos/month each (revision cycles included)", "[LogoDes][Incentive]"],
            ["Packaging Designer", "3", "1 design/day each", "84 team days available, ~58 planned", "[PackDes][Incentive]"],
            ["Standalone label/pack", "—", "1–2 days + a few days for confirmation rounds", "—", "[Handbook §17]"]],
          [0.2, 0.12, 0.26, 0.26, 0.16]),
    ]
