from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class ValidationIssue:
    level: str
    message: str


@dataclass
class TripLeg:
    date: str | None = None
    origin: str | None = None
    destination: str | None = None
    transport: str | None = None


@dataclass
class InvoiceRecord:
    source_path: Path
    raw_text: str
    category: str = "未知类型"
    expense_type: str = "未分类"
    amount: float | None = None
    currency: str = "CNY"
    person_name: str | None = None
    invoice_date: str | None = None
    invoice_number: str | None = None
    trip_legs: list[TripLeg] = field(default_factory=list)
    suggested_name: str = ""
    issues: list[ValidationIssue] = field(default_factory=list)

    @property
    def amount_display(self) -> str:
        if self.amount is None:
            return "金额未知"
        if self.amount.is_integer():
            return f"{int(self.amount)}元"
        return f"{self.amount:.2f}元"
