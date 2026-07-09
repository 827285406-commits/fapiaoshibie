from __future__ import annotations

from pathlib import Path


SUPPORTED_TEXT_SUFFIXES = {".md", ".txt"}


class ExtractionError(RuntimeError):
    pass


def extract_text(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix in SUPPORTED_TEXT_SUFFIXES:
        return path.read_text(encoding="utf-8")
    if suffix == ".pdf":
        return _extract_pdf_text(path)
    if suffix in {".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tif", ".tiff"}:
        raise ExtractionError(
            f"{path.name}: 图片发票需要接入 OCR 或视觉模型后分析。请先用 OCR 导出文本，"
            "或按 README 中的说明实现 image_ocr.extract_text_from_image。"
        )
    raise ExtractionError(f"{path.name}: 暂不支持的文件类型 {suffix or '(无扩展名)'}")


def _extract_pdf_text(path: Path) -> str:
    try:
        from pypdf import PdfReader
    except ImportError as exc:
        raise ExtractionError("分析 PDF 需要安装依赖：pip install -e .[pdf]") from exc

    reader = PdfReader(str(path))
    pages = []
    for page in reader.pages:
        pages.append(page.extract_text() or "")
    text = "\n".join(pages).strip()
    if not text:
        raise ExtractionError(f"{path.name}: PDF 没有可提取文字，可能需要 OCR。")
    return text
