from __future__ import annotations

import argparse
import shutil
from pathlib import Path

from .extractors import ExtractionError, extract_text
from .parser import parse_invoice
from .report import write_json_report, write_markdown_report
from .validator import validate_invoice


def main() -> int:
    parser = argparse.ArgumentParser(description="发票分析、命名、校验与汇总 agent")
    parser.add_argument("input", type=Path, help="发票文件或包含发票的目录")
    parser.add_argument("-o", "--output", type=Path, default=Path("invoice-output"), help="输出目录")
    parser.add_argument("--rename-copy", action="store_true", help="按建议命名复制发票文件")
    args = parser.parse_args()

    records = []
    errors = []
    for path in collect_files(args.input):
        try:
            text = extract_text(path)
            record = parse_invoice(path, text)
            validate_invoice(record)
            records.append(record)
        except ExtractionError as exc:
            errors.append(str(exc))

    args.output.mkdir(parents=True, exist_ok=True)
    write_markdown_report(records, args.output / "summary.md")
    write_json_report(records, args.output / "summary.json")

    if args.rename_copy:
        renamed_dir = args.output / "renamed"
        renamed_dir.mkdir(exist_ok=True)
        for record in records:
            target = unique_path(renamed_dir / record.suggested_name)
            shutil.copy2(record.source_path, target)

    if errors:
        (args.output / "errors.txt").write_text("\n".join(errors) + "\n", encoding="utf-8")

    total = sum(record.amount or 0 for record in records)
    print(f"已分析 {len(records)} 个文件，合计 {total:.2f} 元。")
    print(f"报告已生成：{args.output / 'summary.md'}")
    if errors:
        print(f"有 {len(errors)} 个文件未能分析，详见：{args.output / 'errors.txt'}")
    return 0


def collect_files(input_path: Path) -> list[Path]:
    if input_path.is_file():
        return [input_path]
    if not input_path.exists():
        raise SystemExit(f"输入路径不存在：{input_path}")
    suffixes = {".md", ".txt", ".pdf", ".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tif", ".tiff"}
    return sorted(path for path in input_path.rglob("*") if path.is_file() and path.suffix.lower() in suffixes)


def unique_path(path: Path) -> Path:
    if not path.exists():
        return path
    stem = path.stem
    suffix = path.suffix
    index = 2
    while True:
        candidate = path.with_name(f"{stem}-{index}{suffix}")
        if not candidate.exists():
            return candidate
        index += 1


if __name__ == "__main__":
    raise SystemExit(main())
