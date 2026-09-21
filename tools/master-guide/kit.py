"""Layout kit for the Brandstro master guide: fonts, styles, flowable helpers, doc template."""
import re
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
                                Table, TableStyle, PageBreak, KeepTogether, CondPageBreak)
from reportlab.platypus.tableofcontents import TableOfContents

FONT_DIR = "C:/Windows/Fonts/"
pdfmetrics.registerFont(TTFont("UI", FONT_DIR + "segoeui.ttf"))
pdfmetrics.registerFont(TTFont("UI-B", FONT_DIR + "segoeuib.ttf"))
pdfmetrics.registerFont(TTFont("UI-I", FONT_DIR + "segoeuii.ttf"))
pdfmetrics.registerFont(TTFont("UI-BI", FONT_DIR + "segoeuiz.ttf"))
pdfmetrics.registerFontFamily("UI", normal="UI", bold="UI-B", italic="UI-I", boldItalic="UI-BI")

NAVY = colors.HexColor("#1B2A41")
ACCENT = colors.HexColor("#E0662B")
TEAL = colors.HexColor("#2A7F8F")
RED = colors.HexColor("#B83A3A")
GREEN = colors.HexColor("#3C7D4E")
LIGHT = colors.HexColor("#F3F1EC")
LINE = colors.HexColor("#C9C4B8")
MUTED = colors.HexColor("#5E6470")

PAGE_W, PAGE_H = A4
MARGIN = 18 * mm
CONTENT_W = PAGE_W - 2 * MARGIN

ST = {
    "body": ParagraphStyle("body", fontName="UI", fontSize=9.6, leading=13.6, spaceAfter=5, textColor=colors.black),
    "small": ParagraphStyle("small", fontName="UI", fontSize=8.2, leading=11, textColor=MUTED),
    "cell": ParagraphStyle("cell", fontName="UI", fontSize=8.4, leading=11),
    "cellb": ParagraphStyle("cellb", fontName="UI-B", fontSize=8.4, leading=11, textColor=colors.white),
    "h1": ParagraphStyle("h1", fontName="UI-B", fontSize=21, leading=26, textColor=NAVY, spaceAfter=4),
    "kicker": ParagraphStyle("kicker", fontName="UI-B", fontSize=8.5, leading=11, textColor=ACCENT, spaceAfter=2),
    "lede": ParagraphStyle("lede", fontName="UI-I", fontSize=11, leading=15.5, textColor=MUTED, spaceAfter=10),
    "h2": ParagraphStyle("h2", fontName="UI-B", fontSize=13.5, leading=17, textColor=NAVY, spaceBefore=10, spaceAfter=5, keepWithNext=1),
    "h3": ParagraphStyle("h3", fontName="UI-B", fontSize=10.6, leading=14, textColor=TEAL, spaceBefore=7, spaceAfter=3, keepWithNext=1),
    "bullet": ParagraphStyle("bullet", fontName="UI", fontSize=9.6, leading=13.4, leftIndent=12, bulletIndent=2, spaceAfter=2),
    "flow": ParagraphStyle("flow", fontName="UI-B", fontSize=7.8, leading=9.6, alignment=TA_CENTER, textColor=NAVY),
    "arrow": ParagraphStyle("arrow", fontName="UI-B", fontSize=11, leading=12, alignment=TA_CENTER, textColor=ACCENT),
    "toc1": ParagraphStyle("toc1", fontName="UI-B", fontSize=10.5, leading=15, leftIndent=0, textColor=NAVY),
    "toc2": ParagraphStyle("toc2", fontName="UI", fontSize=9, leading=12.5, leftIndent=14, textColor=MUTED),
}

_AMP = re.compile(r"&(?!amp;|lt;|gt;|#\d+;)")


def esc(text):
    return _AMP.sub("&amp;", str(text))


def P(text, style="body"):
    return Paragraph(esc(text), ST[style])


def H1(text, kicker=None, lede=None):
    out = [PageBreak()]
    if kicker:
        out.append(P(kicker.upper(), "kicker"))
    h = P(text, "h1")
    h._toc = (0, text)
    out.append(h)
    out.append(Table([[""]], colWidths=[CONTENT_W], rowHeights=[2],
                     style=[("LINEABOVE", (0, 0), (-1, -1), 2, ACCENT)]))
    out.append(Spacer(1, 6))
    if lede:
        out.append(P(lede, "lede"))
    return out


def H2(text):
    h = P(text, "h2")
    h._toc = (1, text)
    return [CondPageBreak(40 * mm), h]


def H3(text):
    return P(text, "h3")


def B(items, style="bullet"):
    return [Paragraph(esc(i), ST[style], bulletText="•") for i in items]


def T(rows, widths=None, header=True, zebra=True, head_color=NAVY, font_size=None):
    """Table with wrapped cells. widths are fractions of CONTENT_W."""
    cell = ST["cell"] if font_size is None else ParagraphStyle("c2", parent=ST["cell"], fontSize=font_size, leading=font_size + 2.6)
    cellb = ST["cellb"] if font_size is None else ParagraphStyle("cb2", parent=ST["cellb"], fontSize=font_size, leading=font_size + 2.6)
    data = []
    for r, row in enumerate(rows):
        s = cellb if (header and r == 0) else cell
        data.append([Paragraph(esc(c), s) for c in row])
    n = len(rows[0])
    widths = widths or [1 / n] * n
    t = Table(data, colWidths=[w * CONTENT_W for w in widths], repeatRows=1 if header else 0)
    cmds = [("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("GRID", (0, 0), (-1, -1), 0.4, LINE),
            ("TOPPADDING", (0, 0), (-1, -1), 3.5), ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5),
            ("LEFTPADDING", (0, 0), (-1, -1), 4.5), ("RIGHTPADDING", (0, 0), (-1, -1), 4.5)]
    if header:
        cmds.append(("BACKGROUND", (0, 0), (-1, 0), head_color))
    if zebra:
        start = 1 if header else 0
        for i in range(start, len(rows)):
            if (i - start) % 2 == 1:
                cmds.append(("BACKGROUND", (0, i), (-1, i), LIGHT))
    t.setStyle(TableStyle(cmds))
    return [t, Spacer(1, 7)]


def Callout(title, text, color=ACCENT):
    body = [Paragraph(esc(f"<b>{title}</b>"), ParagraphStyle("ct", parent=ST["body"], textColor=color, spaceAfter=2))]
    items = text if isinstance(text, list) else [text]
    body += [Paragraph(esc(x), ParagraphStyle("cb", parent=ST["body"], spaceAfter=2)) for x in items]
    t = Table([[body]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), LIGHT),
                           ("LINEBEFORE", (0, 0), (0, -1), 3, color),
                           ("LEFTPADDING", (0, 0), (-1, -1), 9), ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                           ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6)]))
    return [KeepTogether(t), Spacer(1, 8)]


def Flow(steps, per_row=5, fill=colors.white):
    """Boxes joined by arrows, wrapping every per_row boxes."""
    rows_out = []
    for start in range(0, len(steps), per_row):
        chunk = steps[start:start + per_row]
        cells, widths = [], []
        box_w = (CONTENT_W - (per_row - 1) * 5 * mm) / per_row
        for i, s in enumerate(chunk):
            cells.append(Paragraph(esc(s), ST["flow"]))
            widths.append(box_w)
            if i < len(chunk) - 1:
                cells.append(Paragraph("→", ST["arrow"]))
                widths.append(5 * mm)
        t = Table([cells], colWidths=widths)
        cmds = [("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("LEFTPADDING", (0, 0), (-1, -1), 2), ("RIGHTPADDING", (0, 0), (-1, -1), 2)]
        for i in range(0, len(cells), 2):
            cmds += [("BOX", (i, 0), (i, 0), 0.8, NAVY), ("BACKGROUND", (i, 0), (i, 0), fill)]
        t.setStyle(TableStyle(cmds))
        t.hAlign = "LEFT"
        rows_out.append(t)
        if start + per_row < len(steps):
            rows_out.append(Paragraph("↓", ParagraphStyle("dn", parent=ST["arrow"], alignment=0, leftIndent=CONTENT_W - box_w / 2 - 6)))
    return [KeepTogether(rows_out), Spacer(1, 8)]


class GuideDoc(BaseDocTemplate):
    def __init__(self, path, **kw):
        super().__init__(path, pagesize=A4, leftMargin=MARGIN, rightMargin=MARGIN,
                         topMargin=20 * mm, bottomMargin=18 * mm, **kw)
        frame = Frame(MARGIN, 18 * mm, CONTENT_W, PAGE_H - 38 * mm, id="f")
        self.addPageTemplates([PageTemplate("cover", [frame], onPage=_cover_page),
                               PageTemplate("main", [frame], onPage=_main_page)])
        self._bm = 0

    def beforeDocument(self):
        self._bm = 0  # multiBuild runs several passes; keys must match between them

    def afterFlowable(self, flowable):
        toc = getattr(flowable, "_toc", None)
        if not toc:
            return
        level, text = toc
        key = f"bm{self._bm}"
        self._bm += 1
        self.canv.bookmarkPage(key)
        self.canv.addOutlineEntry(re.sub("<[^>]+>", "", text), key, level=level, closed=level == 0)
        self.notify("TOCEntry", (level, text, self.page, key))


def _cover_page(canv, doc):
    canv.saveState()
    canv.setFillColor(NAVY)
    canv.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    canv.setFillColor(ACCENT)
    canv.rect(0, PAGE_H * 0.44, PAGE_W, 5, stroke=0, fill=1)
    canv.restoreState()


def _main_page(canv, doc):
    canv.saveState()
    canv.setFont("UI-B", 7.5)
    canv.setFillColor(ACCENT)
    canv.drawString(MARGIN, PAGE_H - 12 * mm, "BRANDSTRO")
    canv.setFont("UI", 7.5)
    canv.setFillColor(MUTED)
    canv.drawString(MARGIN + pdfmetrics.stringWidth("BRANDSTRO", "UI-B", 7.5) + 8, PAGE_H - 12 * mm, "Master Operating Guide — all source documents explained, for the ERP build")
    canv.setStrokeColor(LINE)
    canv.setLineWidth(0.5)
    canv.line(MARGIN, PAGE_H - 13.8 * mm, PAGE_W - MARGIN, PAGE_H - 13.8 * mm)
    canv.drawRightString(PAGE_W - MARGIN, 10 * mm, f"Page {doc.page}")
    canv.drawString(MARGIN, 10 * mm, "Internal — prepared from 10 Brandstro source PDFs")
    canv.restoreState()


def make_toc():
    toc = TableOfContents()
    toc.levelStyles = [ST["toc1"], ST["toc2"]]
    toc.dotsMinLevel = 0
    return toc
