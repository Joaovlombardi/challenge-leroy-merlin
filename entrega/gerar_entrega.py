"""Gera o PDF e os dois ZIPs exigidos para a entrega do Sprint 2.

Requer Python 3 e reportlab. Execute na raiz do repositório:
    python entrega/gerar_entrega.py
"""

from __future__ import annotations

import subprocess
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "entrega"
PDF = OUT / "Leroy-Guia.pdf"
SOURCE_ZIP = OUT / "Leroy-Guia-codigo.zip"
FINAL_ZIP = OUT / "Leroy-Guia-entrega.zip"
SITE = "https://leroy-guia-fiap.vercel.app"
VIDEO = "https://youtu.be/7BwmxwrZSIQ"
MEMBERS = (
    "Miguel de França Monteiro",
    "Isabele Maciel Viana de Freitas",
    "Gabriel Dantas Borges Soares",
    "João Vitor Lombardi Hayashi",
    "Maria Eduarda Santos Pedro",
)


def fonts() -> None:
    font_dir = Path("C:/Windows/Fonts")
    pdfmetrics.registerFont(TTFont("Arial", str(font_dir / "arial.ttf")))
    pdfmetrics.registerFont(TTFont("Arial-Bold", str(font_dir / "arialbd.ttf")))


def draw_pdf() -> None:
    fonts()
    width, height = A4
    green = colors.HexColor("#147D18")
    dark = colors.HexColor("#15251A")
    muted = colors.HexColor("#526358")
    line = colors.HexColor("#D8E3D9")
    pdf = canvas.Canvas(str(PDF), pagesize=A4)
    pdf.setTitle("Leroy Guia - Entrega Sprint 2")
    pdf.setAuthor("Time Leroy Guia")

    pdf.setFillColor(green)
    pdf.rect(0, height - 16, width, 16, fill=1, stroke=0)
    pdf.setFont("Arial-Bold", 11)
    pdf.drawString(54, height - 68, "FIAP  /  CHALLENGE LEROY MERLIN")
    pdf.setFillColor(dark)
    pdf.setFont("Arial-Bold", 29)
    pdf.drawString(54, height - 112, "Leroy Guia")
    pdf.setFont("Arial", 12)
    pdf.setFillColor(muted)
    pdf.drawString(54, height - 136, "Entrega do Sprint 2  |  Time Leroy Guia")
    pdf.setStrokeColor(line)
    pdf.line(54, height - 164, width - 54, height - 164)

    y = height - 200
    pdf.setFillColor(dark)
    pdf.setFont("Arial-Bold", 13)
    pdf.drawString(54, y, "Integrantes")
    y -= 27
    pdf.setFont("Arial", 11)
    for member in MEMBERS:
        pdf.drawString(54, y, member)
        y -= 23

    y -= 24
    pdf.setFont("Arial-Bold", 13)
    pdf.drawString(54, y, "Site publicado")
    y -= 26
    pdf.setFillColor(green)
    pdf.setFont("Arial", 11)
    pdf.drawString(54, y, SITE)
    pdf.linkURL(SITE, (54, y - 3, 350, y + 14), relative=0)

    y -= 51
    pdf.setFillColor(dark)
    pdf.setFont("Arial-Bold", 13)
    pdf.drawString(54, y, "Vídeo de apresentação")
    y -= 26
    pdf.setFillColor(green)
    pdf.setFont("Arial", 11)
    pdf.drawString(54, y, VIDEO)
    pdf.linkURL(VIDEO, (54, y - 3, 350, y + 14), relative=0)

    pdf.setStrokeColor(line)
    pdf.line(54, 72, width - 54, 72)
    pdf.setFillColor(muted)
    pdf.setFont("Arial", 9)
    pdf.drawString(54, 52, "Leroy Guia - encontre, compare e localize produtos na loja.")
    pdf.save()


def source_files() -> list[Path]:
    raw = subprocess.check_output(
        ["git", "-c", f"safe.directory={ROOT.as_posix()}", "ls-files", "--cached", "--others", "--exclude-standard", "-z"],
        cwd=ROOT,
    )
    excluded_dirs = {".git", "node_modules", "target", "dist", "build", ".venv", "__pycache__"}
    files = []
    for item in raw.decode("utf-8").split("\0"):
        if not item:
            continue
        path = Path(item)
        if any(part in excluded_dirs for part in path.parts):
            continue
        if path.name == ".env" or path.name.startswith(".env."):
            continue
        if path.suffix.lower() in {".zip", ".pdf"}:
            continue
        if (ROOT / path).is_file():
            files.append(path)
    return sorted(set(files))


def draw_zips() -> None:
    files = source_files()
    if not files:
        raise RuntimeError("Nenhum arquivo de projeto encontrado para o ZIP")
    with ZipFile(SOURCE_ZIP, "w", ZIP_DEFLATED, compresslevel=9) as archive:
        for path in files:
            archive.write(ROOT / path, Path("challenge-leroy-merlin") / path)
    with ZipFile(FINAL_ZIP, "w", ZIP_DEFLATED, compresslevel=9) as archive:
        archive.write(PDF, PDF.name)
        archive.write(SOURCE_ZIP, SOURCE_ZIP.name)


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    draw_pdf()
    draw_zips()
    print(f"Gerados: {PDF.name}, {SOURCE_ZIP.name}, {FINAL_ZIP.name}")
