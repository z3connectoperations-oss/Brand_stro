---
name: Executive Enterprise Operations
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#684000'
  on-tertiary: '#ffffff'
  tertiary-container: '#885500'
  on-tertiary-container: '#ffd4a4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  code-xs:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 12px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system delivers a high-density, authoritative operating environment tailored for executive leadership, agency partners, and operational directors. The visual voice is uncompromisingly precise, functional, and prestigious—balancing high-throughput workflow utilities with the refined tactility of private wealth and corporate governance software.

The interface merges **Corporate Modernism** with **High-Density Utility**:
- Anchored by a monolithic, deep slate-navy rail that establishes structural permanence.
- Crisp, clinical content containers sitting on a cool slate canvas that eliminate visual fatigue across 10-hour workdays.
- Precision micro-interactions, subtle differential indicators (Old → New audit snapshots), and high-legibility typographic hierarchy designed to reduce cognitive overhead during high-stakes resource allocation and billing workflows.

## Colors

The palette establishes an immediate hierarchy between platform architecture and actionable enterprise data:

- **Canvas & Framing**: The main workspace canvas rests on `#F8FAFC` (Slate 50), bounded by structural borders in `#E2E8F0` (Slate 200). The global navigation rail utilizes `#0F172A` (Slate 900) to create clear spatial separation between system routing and workspace execution.
- **Brand & Action (Primary)**: `#4F46E5` (Indigo 600) drives primary CTAs, active focus rings, and selection indicators. Its dark variant `#4338CA` serves hover states, while `#EEF2FF` isolates active-state badge backgrounds.
- **Audit & Warning (Tertiary)**: `#F59E0B` (Amber 500) accents billing variances, provisional approvals, and impending budget thresholds, complemented by `#FEF3C7` (Amber 50) for containment badges.
- **Health & Metrics**: `#10B981` (Emerald 500) represents positive margin variance, finalized deliverables, and signed contracts, backed by `#ECFDF5` for subtle pills.
- **Critical & Diff Indicators**: `#EF4444` (Rose 500) denotes resource over-allocations, SLA breaches, and historical field revocations (`diff-removed`).

## Typography

The type stack is built on **Inter** for structural interfaces, pairing extreme legibility at small optical sizes with calibrated tabular figures. **JetBrains Mono** handles audit metadata, currency hashes, timestamps, and enterprise diff arrays.

- All numerical values within data grids, KPI banners, and balance rows must use open-type tabular numbers (`font-variant-numeric: tabular-nums`).
- Section labels and table headers utilize uppercase styling (`label-sm`) with tracked letterforms (+0.04em) in `#64748B`.
- Mobile scaling clamps headline sizes: `display-lg` drops to `24px` / `32px` line height under 768px viewport widths to prevent clipping across complex multi-currency metrics.

## Layout & Spacing

The layout is built on a responsive multi-pane structure:
- **Navigation Pane**: Fixed 260px dark rail (`#0F172A`), collapsible to an 72px icon-only micro-rail on viewports under 1280px.
- **Content Canvas**: Fluid container with a maximum width boundary of `1680px` for ultra-wide displays, maintaining centered rhythm with safe margins.
- **Grid Structure**: 12-column dynamic grid utilizing 16px (`gutter`) spacing on tablets and 24px (`gutter-desktop`) on desktop screens.
- **Density Density**: High-density spacing scale configured strictly on a 4px base. Tables and form stacks use `space-xs` (4px) and `space-sm` (8px) gaps to ensure maximum visibility of dense operational data above the fold.

## Elevation & Depth

This system avoids expressive blur or whimsical dropshadows, opting for architectural crispness through **low-contrast outlines** and **micro-depth anchoring**:

- **Level 0 (Canvas)**: Solid `#F8FAFC`, zero elevation.
- **Level 1 (Cards & Data Grids)**: Solid `#FFFFFF`, bordered by 1px solid `#E2E8F0`. Shadow is an ambient, ultra-diffused micro-offset: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Dropdowns, Popovers & Context Menus)**: `#FFFFFF` surface with an elevated shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`, bounded by `#CBD5E1`.
- **Level 3 (Modals & Slide-over Drawers)**: `#FFFFFF` bounded by `#94A3B8` on top of a 40% `#0F172A` tinted backdrop. Shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.06)`.

## Shapes

The design uses balanced, modern geometric curvature:
- **Cards & Primary Modules**: Strict 10px to 12px radii (`rounded-lg`), delivering crisp containment without harsh edges.
- **Buttons, Inputs & Selectors**: 6px to 8px radii, balancing tactical click targets with data compactness.
- **Status Pills & Diff Modules**: Fully rounded (9999px) for status indicators and micro tags to immediately distinguish operational states from rectangular input elements.

## Components

### Buttons
- **Primary**: Solid `#4F46E5`, white text, 8px radius, height 36px (compact) or 40px (default). Inset micro-highlight border `1px solid rgba(255, 255, 255, 0.15)`. Hover: `#4338CA`.
- **Secondary**: `#FFFFFF` background, `#0F172A` text, 1px `#E2E8F0` border. Hover: `#F8FAFC` background with `#CBD5E1` border.
- **Destructive**: Subdued `#FEF2F2` background, `#DC2626` text, 1px `#FEE2E2` border. Hover: `#FEE2E2`.

### Inputs & Controls
- **Text Inputs**: Height 36px, `#FFFFFF` background, 1px `#CBD5E1` border, 6px radius. Placeholder text in `#94A3B8`. Active focus triggers a 1px `#4F46E5` border with an accompanying 3px outer glow `rgba(79, 70, 229, 0.12)`.
- **Checkboxes & Radios**: 16px square/circle, `#E2E8F0` border. When checked: `#4F46E5` fill with a sharp white checkmark glyph.

### Compact Data Tables
- Row height: 40px fixed.
- Header: `#F8FAFC` background, 1px solid bottom border `#E2E8F0`, typography `label-sm` in `#64748B`.
- Row Zebra: Alternating subtle `#FFFFFF` and `#FCFDFE` with `#F1F5F9` hover state.
- Numeric alignment: Right-aligned using `JetBrains Mono` at `12px`.

### Executive Audit Trail & Diff Pills
- **Inline Diff Tag**: Container pill using a monospaced structure. Displays previous and updated values side by side:
  - `Old Value`: `#FEF2F2` background, `#991B1B` text with a subtle strike-through.
  - `Arrow`: Monospaced `→` in `#94A3B8`.
  - `New Value`: `#ECFDF5` background, `#065F46` text, bold weight.
- **Audit Timeline Log**: A vertical 2px rule in `#E2E8F0` connecting event nodes. Nodes feature an 8px circular indicator color-coded by event tier (Indigo: Deployment/Contract, Amber: Budget Revision, Green: Payment Cleared).

### Brand Badges & Client Switches
- Located in the upper section of the `#0F172A` rail.
- 32x32px squircle avatar with a 1px border `rgba(255, 255, 255, 0.12)`. Accompanied by agency moniker, client environment dropdown, and a live emerald `#10B981` status beacon.