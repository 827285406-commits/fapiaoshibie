from __future__ import annotations

import json
from pathlib import Path

from .models import InvoiceRecord


def write_markdown_report(records: list[InvoiceRecord], output_path: Path) -> None:
    total = sum(record.amount or 0 for record in records)
    lines = [
        "# 发票分析汇总",
        "",
        f"- 发票数量：{len(records)}",
        f"- 合计金额：{total:.2f} 元",
        "",
        "## 明细",
        "",
        "| 文件 | 建议命名 | 姓名 | 类型 | 金额 | 行程 | 问题 |",
        "| --- | --- | --- | --- | ---: | --- | --- |",
    ]
    for record in records:
        trip = format_trip(record)
        issues = "<br>".join(f"{issue.level}: {issue.message}" for issue in record.issues) or "无"
        lines.append(
            "| "
            + " | ".join(
                [
                    escape_md(record.source_path.name),
                    escape_md(record.suggested_name),
                    escape_md(record.person_name or "-"),
                    escape_md(f"{record.category}/{record.expense_type}"),
                    record.amount_display,
                    escape_md(trip),
                    escape_md(issues),
                ]
            )
            + " |"
        )

    lines.extend(["", "## 行程总结", ""])
    lines.append(build_trip_summary(records))
    output_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_json_report(records: list[InvoiceRecord], output_path: Path) -> None:
    payload = {
        "count": len(records),
        "total_amount": round(sum(record.amount or 0 for record in records), 2),
        "records": [
            {
                "source_file": str(record.source_path),
                "suggested_name": record.suggested_name,
                "category": record.category,
                "expense_type": record.expense_type,
                "amount": record.amount,
                "currency": record.currency,
                "person_name": record.person_name,
                "invoice_date": record.invoice_date,
                "invoice_number": record.invoice_number,
                "trip_legs": [leg.__dict__ for leg in record.trip_legs],
                "issues": [issue.__dict__ for issue in record.issues],
            }
            for record in records
        ],
    }
    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def build_trip_summary(records: list[InvoiceRecord]) -> str:
    names = sorted({record.person_name for record in records if record.person_name})
    name_text = "、".join(names) if names else "未识别姓名"
    trip_parts: list[str] = []
    for record in records:
        for leg in record.trip_legs:
            date = leg.date or record.invoice_date or "日期未知"
            origin = leg.origin or "出发地未知"
            destination = leg.destination or "目的地未知"
            transport = leg.transport or record.category
            trip_parts.append(f"{date} 乘坐{transport}从{origin}到{destination}")
    if not trip_parts:
        return f"{name_text}：未识别到完整行程。"
    return f"{name_text}：" + "；".join(trip_parts) + "。"


def format_trip(record: InvoiceRecord) -> str:
    if not record.trip_legs:
        return "-"
    return "; ".join(
        f"{leg.date or record.invoice_date or '日期未知'} {leg.origin or '?'}->{leg.destination or '?'}"
        for leg in record.trip_legs
    )


def escape_md(value: str) -> str:
    return value.replace("|", "\\|").replace("\n", "<br>")
