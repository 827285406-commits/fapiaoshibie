from __future__ import annotations

from .models import InvoiceRecord, ValidationIssue


MSG_AMOUNT_MISSING = "\u672a\u8bc6\u522b\u5230\u53d1\u7968\u91d1\u989d\u3002"
MSG_AMOUNT_INVALID = "\u53d1\u7968\u91d1\u989d\u5fc5\u987b\u5927\u4e8e 0\u3002"
MSG_CATEGORY_UNKNOWN = "\u672a\u80fd\u5224\u65ad\u53d1\u7968\u7c7b\u578b\uff0c\u8bf7\u4eba\u5de5\u786e\u8ba4\u3002"
MSG_DATE_MISSING = "\u672a\u8bc6\u522b\u5230\u53d1\u7968\u65e5\u671f\u3002"
MSG_TRIP_MISSING = "\u5dee\u65c5\u7c7b\u53d1\u7968\u672a\u8bc6\u522b\u5230\u5b8c\u6574\u51fa\u53d1\u5730/\u76ee\u7684\u5730\u3002"
MSG_TITLE_MISSING = "\u8d2d\u4e70\u65b9\u62ac\u5934\u6216\u7eb3\u7a0e\u4eba\u8bc6\u522b\u53f7\u53ef\u80fd\u7f3a\u5931\u3002"
MSG_SUSPICIOUS = "\u6587\u672c\u4e2d\u51fa\u73b0\u4f5c\u5e9f/\u51b2\u7ea2/\u9000\u7968\u7b49\u5173\u952e\u8bcd\uff0c\u8bf7\u786e\u8ba4\u662f\u5426\u53ef\u62a5\u9500\u3002"

UNKNOWN_TYPE = "\u672a\u77e5\u7c7b\u578b"
TRAVEL = "\u5dee\u65c5"

BUYER = "\u8d2d\u4e70\u65b9"
TITLE = "\u62ac\u5934"
TAX_ID = "\u7eb3\u7a0e\u4eba\u8bc6\u522b\u53f7"
SOCIAL_CREDIT_CODE = "\u7edf\u4e00\u793e\u4f1a\u4fe1\u7528\u4ee3\u7801"
PERSONAL = "\u4e2a\u4eba"
NONE_TEXT = "\u65e0"
SUSPICIOUS_KEYWORDS = ["\u4f5c\u5e9f", "\u51b2\u7ea2", "\u7ea2\u5b57", "\u9000\u7968", "\u9000\u6b3e", "\u91cd\u590d\u62a5\u9500"]


def validate_invoice(record: InvoiceRecord) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []

    if record.amount is None:
        issues.append(ValidationIssue("error", MSG_AMOUNT_MISSING))
    elif record.amount <= 0:
        issues.append(ValidationIssue("error", MSG_AMOUNT_INVALID))

    if record.category == UNKNOWN_TYPE:
        issues.append(ValidationIssue("warning", MSG_CATEGORY_UNKNOWN))

    if not record.invoice_date:
        issues.append(ValidationIssue("warning", MSG_DATE_MISSING))

    if record.expense_type == TRAVEL and not record.trip_legs:
        issues.append(ValidationIssue("warning", MSG_TRIP_MISSING))

    if _looks_like_invalid_invoice_title(record.raw_text):
        issues.append(ValidationIssue("warning", MSG_TITLE_MISSING))

    if _has_suspicious_keywords(record.raw_text):
        issues.append(ValidationIssue("warning", MSG_SUSPICIOUS))

    record.issues = issues
    return issues


def _looks_like_invalid_invoice_title(text: str) -> bool:
    title = _line_value(text, BUYER) or _line_value(text, TITLE)
    tax_id = _line_value(text, TAX_ID) or _line_value(text, SOCIAL_CREDIT_CODE)
    if title is None:
        return False
    return title.strip() in {"", PERSONAL, NONE_TEXT} and not (tax_id and tax_id.strip())


def _line_value(text: str, label: str) -> str | None:
    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith(label):
            _, sep, value = stripped.partition("\uff1a")
            if not sep:
                _, sep, value = stripped.partition(":")
            return value.strip() if sep else ""
    return None


def _has_suspicious_keywords(text: str) -> bool:
    return any(keyword in text for keyword in SUSPICIOUS_KEYWORDS)
