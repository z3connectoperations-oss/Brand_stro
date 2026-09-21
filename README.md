# Brand_stro

Source material and designs for the Brandstro ERP.

## Contents

| Path | What it is |
|---|---|
| `Brandstro_Master_Guide.pdf` | **Start here.** All documents below combined and explained (Part A, 44 pages: business, org, project lifecycle, roles, rules, incentive maths, ERP blueprint, open questions), followed by the 10 originals (Part B). |
| `Brandstro - Creative Head Leadership Handbook.pdf` | 70-page leadership curriculum for the Creative Head |
| `Brandstro_Incentive_Plan.pdf` | Monthly targets, bonus rules and company economics |
| `Brandstro_*_Brief.pdf` | Role briefs: CRM, HR, R&D, Sketch Artist, Logo TL, Logo Designer, Packaging TL, Packaging Designer |
| `stitch_brandstro_founder_command_center/` | Google Stitch UI export: one folder per screen with `code.html` and `screen.png` |
| `tools/master-guide/` | Python scripts that regenerate `Brandstro_Master_Guide.pdf` |

## Regenerating the master guide

Requires Python 3, `reportlab`, `pypdf`, and Windows (it uses the Segoe UI fonts from `C:/Windows/Fonts`).

```sh
pip install reportlab pypdf
python tools/master-guide/build.py
```

## Note

These documents are internal (salaries, incentive targets). Keep this repository private.
