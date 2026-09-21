"""Build the Brandstro master PDF: explained guide (Part A) + original PDFs (Part B)."""
import os
import sys
from pypdf import PdfReader, PdfWriter

from kit import GuideDoc
import content1 as c1
import content2 as c2
import content3 as c3

SRC_DIR = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
OUT = os.path.join(SRC_DIR, "Brandstro_Master_Guide.pdf")
TMP = os.path.join(os.path.dirname(os.path.abspath(__file__)), "guide_part_a.pdf")

ORIGINALS = [
    ("Creative Head Leadership Handbook", "Brandstro - Creative Head Leadership Handbook.pdf"),
    ("Performance Incentive Plan", "Brandstro_Incentive_Plan.pdf"),
    ("CRM Brief", "Brandstro_CRM_Brief.pdf"),
    ("HR / Admin Brief", "Brandstro_HR_Brief.pdf"),
    ("R&D Brief", "Brandstro_RND_Brief.pdf"),
    ("Sketch Artist Brief", "Brandstro_SketchArtist_Brief.pdf"),
    ("Logo Team Leader Brief", "Brandstro_LogoTeamLeader_Brief.pdf"),
    ("Logo Designer Brief", "Brandstro_LogoDesigner_Brief.pdf"),
    ("Packaging Team Leader Brief", "Brandstro_PackagingTeamLeader_Brief.pdf"),
    ("Packaging Designer Brief", "Brandstro_PackagingDesigner_Brief.pdf"),
]


def flatten(items):
    for item in items:
        if isinstance(item, (list, tuple)):
            yield from flatten(item)
        else:
            yield item


def story(appendix_entries):
    return list(flatten(_story(appendix_entries)))


def _story(appendix_entries):
    return [*c1.cover(), *c1.ch_how_to_read(), *c1.ch_glance(), *c1.ch_sources(), *c1.ch_products(),
            *c1.ch_org(), *c1.ch_lifecycle(), *c2.ch_roles(), *c2.ch_rules(), *c2.ch_incentive(),
            *c3.ch_leadership(), *c3.ch_tools(), *c3.ch_erp(), *c3.ch_gaps(), *c3.ch_glossary(),
            *c3.ch_appendix(appendix_entries)]


def build_guide(entries):
    doc = GuideDoc(TMP, title="Brandstro Master Operating Guide", author="Brandstro")
    doc.multiBuild(story(entries))
    return len(PdfReader(TMP).pages)


def appendix_entries(guide_pages, readers):
    entries, start = [], guide_pages + 1
    for (label, _), reader in zip(ORIGINALS, readers):
        entries.append((label, len(reader.pages), start))
        start += len(reader.pages)
    return entries


def main():
    readers = []
    for _, fname in ORIGINALS:
        path = os.path.join(SRC_DIR, fname)
        if not os.path.exists(path):
            sys.exit(f"Missing source PDF: {path}")
        readers.append(PdfReader(path))

    # Pass 1 sizes the guide; pass 2 fills the appendix page numbers (same length, only digits change).
    pages = build_guide(appendix_entries(0, readers))
    pages2 = build_guide(appendix_entries(pages, readers))
    if pages2 != pages:
        sys.exit(f"Guide length changed between passes ({pages} -> {pages2}); rerun needed")

    writer = PdfWriter()
    writer.append(TMP)  # keeps the guide's own bookmarks
    parent = writer.add_outline_item("Part B: Original documents", pages)
    for (label, _), reader, (_, _, start) in zip(ORIGINALS, readers, appendix_entries(pages, readers)):
        for page in reader.pages:
            writer.add_page(page)
        writer.add_outline_item(label, start - 1, parent=parent)
    writer.add_metadata({"/Title": "Brandstro Master Operating Guide", "/Author": "Brandstro",
                         "/Subject": "All Brandstro documents combined and explained, with ERP blueprint"})
    writer.page_mode = "/UseOutlines"
    with open(OUT, "wb") as fh:
        writer.write(fh)
    total = len(PdfReader(OUT).pages)
    print(f"Guide pages: {pages}; originals: {total - pages}; total: {total}; written: {OUT}")


if __name__ == "__main__":
    main()
