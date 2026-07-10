# Invoice Agent

Invoice Agent is a GitHub-ready invoice analysis agent for reimbursement workflows. It extracts key fields, suggests clean file names, validates common risks, and writes Markdown/JSON summary reports.

## Features

- Suggests invoice names such as `??--??--980?--??--2026?7?1?.pdf`
- Extracts person, category, expense type, amount, date, invoice number, and travel route
- Builds itinerary summaries, for example: `???2026?7?1? ???????????2026?7?3? ???????????`
- Checks missing amount, missing date, missing travel route, invoice title risk, voided/red/refund keywords, and other manual-review signals
- Calculates the total invoice amount
- Optionally copies uploaded files into a renamed output folder

## Quick start

```bash
git clone https://github.com/your-name/invoice-agent.git
cd invoice-agent
python -m venv .venv
.venv\Scripts\activate
pip install -e .[pdf]
invoice-agent examples/invoices -o invoice-output --rename-copy
```

Outputs:

- `invoice-output/summary.md`: human-readable report
- `invoice-output/summary.json`: structured data for integrations
- `invoice-output/renamed/`: copied files using suggested names
- `invoice-output/errors.txt`: files that could not be analyzed

## Supported inputs

Works out of the box with `.md`, `.txt`, and text-based `.pdf` files. The GitHub Pages web app can upload PDF files and extract embedded text in the browser with PDF.js.

Scanned image PDFs and image invoices such as `.jpg`, `.png`, and `.webp` need OCR or a vision model first. Extend `invoice_agent/extractors.py` to convert images into text, then reuse the same parsing, validation, and reporting pipeline.

## Example

```bash
python -m invoice_agent.cli examples/invoices -o invoice-output --rename-copy
```

Expected sample total: `1560.00 ?`.

## GitHub Actions

The repository includes a smoke-test workflow. After pushing to GitHub, every push or pull request runs the example command and confirms the agent can still generate reports.

## Extension ideas

- Connect OpenAI Vision, Azure Document Intelligence, Baidu OCR, or Aliyun OCR for image invoices
- Add a web upload page
- Add company reimbursement rules for title, tax ID, duplicate invoice number, date range, and budget category
- Export an Excel reimbursement ledger
- Connect GitHub Issues so employees can upload invoice attachments and receive an automatic analysis reply
