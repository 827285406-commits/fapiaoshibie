from __future__ import annotations

import re
from pathlib import Path

from .models import InvoiceRecord, TripLeg


CATEGORY_RULES: list[tuple[str, str, str]] = [
    (r"机票|航空|航班|登机牌|air|flight|机场", "机票", "差旅"),
    (r"火车|高铁|动车|铁路|车票", "火车票", "差旅"),
    (r"出租|网约车|滴滴|打车|客运|汽车票", "交通", "差旅"),
    (r"酒店|住宿|宾馆|旅店|房费", "住宿", "差旅"),
    (r"餐饮|餐费|饭店|餐厅|食品|饮品", "餐饮", "餐饮"),
    (r"办公|耗材|文具|打印|快递", "办公", "办公"),
]

PERSON_PATTERNS = [
    r"(?:姓名|乘机人|旅客|购买方个人|报销人|申请人)[:：\s]*([\u4e00-\u9fa5A-Za-z][\u4e00-\u9fa5A-Za-z·.\s]{1,20})",
]

DATE_PATTERNS = [
    r"(\d{4}[年/-]\d{1,2}[月/-]\d{1,2}日?)",
    r"(\d{1,2}月\d{1,2}日)",
]

INVOICE_NO_PATTERNS = [
    r"(?:发票号码|票据号码|电子客票号码|No\.?|NO\.?)[:：\s]*([A-Z0-9\-]{6,32})",
]


def parse_invoice(path: Path, text: str) -> InvoiceRecord:
    record = InvoiceRecord(source_path=path, raw_text=text)
    record.category, record.expense_type = detect_category(text)
    record.amount = detect_amount(text)
    record.person_name = detect_person_name(text)
    record.invoice_date = detect_first(DATE_PATTERNS, text)
    record.invoice_number = detect_first(INVOICE_NO_PATTERNS, text)
    record.trip_legs = detect_trip_legs(text)
    record.suggested_name = build_suggested_name(record)
    return record


def detect_category(text: str) -> tuple[str, str]:
    normalized = text.lower()
    for pattern, category, expense_type in CATEGORY_RULES:
        if re.search(pattern, normalized, flags=re.IGNORECASE):
            return category, expense_type
    return "未知类型", "未分类"


def detect_amount(text: str) -> float | None:
    candidates: list[float] = []
    strong_patterns = [
        r"(?:价税合计|合计金额|总金额|票价|金额|费用|小计)[:：\s]*(?:人民币|￥|¥|CNY)?\s*([0-9]+(?:\.[0-9]{1,2})?)",
        r"(?:人民币|￥|¥|CNY)\s*([0-9]+(?:\.[0-9]{1,2})?)",
        r"([0-9]+(?:\.[0-9]{1,2})?)\s*元",
    ]
    for pattern in strong_patterns:
        for match in re.finditer(pattern, text, flags=re.IGNORECASE):
            candidates.append(float(match.group(1)))
    if not candidates:
        return None
    return max(candidates)


def detect_person_name(text: str) -> str | None:
    value = detect_first(PERSON_PATTERNS, text)
    if not value:
        return None
    value = re.split(r"\s{2,}|票号|航班|日期|金额|身份证|证件", value.strip())[0]
    return value.strip(" ：:")


def detect_first(patterns: list[str], text: str) -> str | None:
    for pattern in patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return None


def detect_trip_legs(text: str) -> list[TripLeg]:
    legs: list[TripLeg] = []
    compact_lines = [line.strip() for line in text.splitlines() if line.strip()]

    line_pattern = re.compile(
        r"(?:(\d{4}[年/-]\d{1,2}[月/-]\d{1,2}日?|\d{1,2}月\d{1,2}日).{0,20})?"
        r"([\u4e00-\u9fa5A-Za-z]{2,20})\s*(?:至|到|->|→|-)\s*([\u4e00-\u9fa5A-Za-z]{2,20})"
    )
    for line in compact_lines:
        match = line_pattern.search(line)
        if match:
            legs.append(
                TripLeg(
                    date=match.group(1),
                    origin=_clean_place(match.group(2)),
                    destination=_clean_place(match.group(3)),
                    transport=_detect_transport(line),
                )
            )

    if legs:
        return legs

    route_match = re.search(
        r"(?:出发地|始发|起点)[:：\s]*([\u4e00-\u9fa5A-Za-z]{2,20}).{0,20}"
        r"(?:目的地|到达|终点)[:：\s]*([\u4e00-\u9fa5A-Za-z]{2,20})",
        text,
    )
    if route_match:
        legs.append(
            TripLeg(
                date=detect_first(DATE_PATTERNS, text),
                origin=_clean_place(route_match.group(1)),
                destination=_clean_place(route_match.group(2)),
                transport=_detect_transport(text),
            )
        )
    return legs


def _detect_transport(text: str) -> str | None:
    category, _ = detect_category(text)
    if category in {"机票", "火车票", "交通"}:
        return category
    return None


def _clean_place(value: str) -> str:
    return re.sub(r"[，,。；;：:\s].*$", "", value.strip())


def build_suggested_name(record: InvoiceRecord) -> str:
    pieces = [record.category]
    if record.expense_type and record.expense_type != record.category:
        pieces.append(record.expense_type)
    pieces.append(record.amount_display)
    if record.person_name:
        pieces.append(record.person_name)
    if record.invoice_date:
        pieces.append(record.invoice_date)
    name = "--".join(pieces)
    return sanitize_filename(name) + record.source_path.suffix.lower()


def sanitize_filename(name: str) -> str:
    return re.sub(r'[<>:"/\\|?*\n\r\t]+', "-", name).strip(". ")
