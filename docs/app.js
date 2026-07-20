const records = [];

const C = {
  flight: "\u673a\u7968",
  train: "\u706b\u8f66\u7968",
  traffic: "\u4ea4\u901a",
  taxi: "\u6253\u8f66",
  hotel: "\u4f4f\u5bbf",
  meal: "\u9910\u996e",
  office: "\u529e\u516c",
  travel: "\u5dee\u65c5",
  uncategorized: "\u672a\u5206\u7c7b",
  unknown: "\u672a\u77e5\u7c7b\u578b",
  yuan: "\u5143",
  amountUnknown: "\u91d1\u989d\u672a\u77e5",
  dateUnknown: "\u65e5\u671f\u672a\u77e5",
  originUnknown: "\u51fa\u53d1\u5730\u672a\u77e5",
  destinationUnknown: "\u76ee\u7684\u5730\u672a\u77e5",
  noInvoices: "\u6682\u65e0\u53d1\u7968\uff0c\u8bf7\u5148\u4e0a\u4f20\u6216\u7c98\u8d34\u6587\u672c\u3002",
  tripHint: "\u4e0a\u4f20\u53d1\u7968\u540e\uff0c\u8fd9\u91cc\u4f1a\u751f\u6210\u5b8c\u6574\u884c\u7a0b\u603b\u7ed3\u3002",
  noName: "\u672a\u8bc6\u522b\u59d3\u540d",
  noTrip: "\u672a\u8bc6\u522b\u5230\u5b8c\u6574\u884c\u7a0b\u3002",
  ride: "\u4e58\u5750",
  from: "\u4ece",
  to: "\u5230",
  ok: "\u672a\u53d1\u73b0\u660e\u663e\u95ee\u9898",
  pasteFile: "\u7c98\u8d34\u6587\u672c.md",
  pdfNoText: "PDF \u672a\u63d0\u53d6\u5230\u53ef\u5206\u6790\u6587\u5b57\uff0c\u53ef\u80fd\u662f\u626b\u63cf\u56fe\u7247\u578b PDF\uff0c\u8bf7\u5148 OCR \u540e\u518d\u4e0a\u4f20\u3002",
  pdfLoadError: "PDF \u89e3\u6790\u7ec4\u4ef6\u672a\u52a0\u8f7d\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u6216\u68c0\u67e5\u7f51\u7edc\u540e\u91cd\u8bd5\u3002",
  ocrLoadError: "OCR \u7ec4\u4ef6\u672a\u52a0\u8f7d\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc\u540e\u5237\u65b0\u9875\u9762\u91cd\u8bd5\u3002",
  ocrStarting: "PDF \u5185\u7f6e\u6587\u5b57\u4e0d\u5b8c\u6574\uff0c\u6b63\u5728 OCR\u3002\u9996\u6b21\u9700\u8981\u4e0b\u8f7d\u7ea6 20MB \u4e2d\u6587\u8bc6\u522b\u6a21\u578b\uff0c\u8bf7\u7a0d\u7b49...",
  ocrPage: "\u6b63\u5728 OCR \u8bc6\u522b PDF \u7b2c",
  ocrPageSuffix: "\u9875...",
};

const categoryRules = [
  [/\u6ef4\u6ef4\u51fa\u884c|DIDI\s*TRAVEL|\u6ef4\u6ef4\u5feb\u8f66|\u6ef4\u6ef4|\u6253\u8f66|\u7f51\u7ea6\u8f66/i, C.taxi, C.travel],
  [/\u673a\u7968|\u822a\u7a7a|\u822a\u73ed|\u767b\u673a\u724c|air|flight|\u673a\u573a|\u56fd\u5185\u822a\u7a7a|\u822a\u7a7a\u8fd0\u8f93|\u673a\u573a\u5efa\u8bbe\u8d39|\u71c3\u6cb9\u9644\u52a0|\u822a\u6bb5|\u822a\u73ed\u53f7/i, C.flight, C.travel],
  [/\u706b\u8f66|\u9ad8\u94c1|\u52a8\u8f66|\u94c1\u8def|\u8f66\u7968|\u94c1\u8def\u7535\u5b50\u5ba2\u7968|\u5217\u8f66|\u8f66\u6b21|\u4e00\u7b49\u5ea7|\u4e8c\u7b49\u5ea7|\u5546\u52a1\u5ea7|\u897f\u5b89\u5317|\u7ef5\u9633|\b[GDCKZ]\d{2,5}\b/i, C.train, C.travel],
  [/\u51fa\u79df|\u5ba2\u8fd0|\u6c7d\u8f66\u7968|\u901a\u884c\u8d39|\u516c\u8def\u901a\u884c\u8d39|\u8fc7\u8def\u8d39|\u8def\u6865\u8d39|\u9ad8\u901f|\u9ad8\u901f\u516c\u8def|\u6536\u8d39\u7ad9|\u5ba2\u8f66|ETC/i, C.traffic, C.travel],
  [/\u9152\u5e97|\u4f4f\u5bbf|\u5bbe\u9986|\u65c5\u5e97|\u623f\u8d39|\u4f4f\u5bbf\u8d39/i, C.hotel, C.travel],
  [/\u9910\u996e|\u9910\u8d39|\u996d\u5e97|\u9910\u5385|\u98df\u54c1|\u996e\u54c1/i, C.meal, C.meal],
  [/\u529e\u516c|\u8017\u6750|\u6587\u5177|\u6253\u5370|\u5feb\u9012/i, C.office, C.office],
];

const datePatterns = [
  /(\d{4}\s*[\u5e74\/-]\s*\d{1,2}\s*[\u6708\/-]\s*\d{1,2}\s*[\u65e5\u53f7]?)/,
  /(\d{1,2}\s*\u6708\s*\d{1,2}\s*[\u65e5\u53f7])/,
];

const fileInput = document.querySelector("#fileInput");
const dropzone = document.querySelector("#dropzone");
const manualText = document.querySelector("#manualText");
const analyzeManual = document.querySelector("#analyzeManual");
const results = document.querySelector("#results");
const totalAmount = document.querySelector("#totalAmount");
const invoiceCount = document.querySelector("#invoiceCount");
const issueCount = document.querySelector("#issueCount");
const tripSummary = document.querySelector("#tripSummary");
const clearAll = document.querySelector("#clearAll");
const exportJson = document.querySelector("#exportJson");
const exportCsv = document.querySelector("#exportCsv");
const summaryTable = document.querySelector("#summaryTable");

fileInput.addEventListener("change", event => handleFiles(event.target.files));

["dragenter", "dragover"].forEach(type => {
  dropzone.addEventListener(type, event => {
    event.preventDefault();
    dropzone.classList.add("dragging");
  });
});

["dragleave", "drop"].forEach(type => {
  dropzone.addEventListener(type, event => {
    event.preventDefault();
    dropzone.classList.remove("dragging");
  });
});

dropzone.addEventListener("drop", event => handleFiles(event.dataTransfer.files));

analyzeManual.addEventListener("click", () => {
  const text = manualText.value.trim();
  if (!text) return;
  records.push(analyzeInvoice(C.pasteFile, text));
  manualText.value = "";
  render();
});

clearAll.addEventListener("click", () => {
  records.splice(0, records.length);
  render();
});

exportJson.addEventListener("click", () => {
  const payload = JSON.stringify({ count: records.length, totalAmount: sumAmount(records), records }, null, 2);
  download("invoice-summary.json", payload, "application/json");
});

exportCsv.addEventListener("click", () => {
  download("invoice-summary.csv", buildSummaryCsv(records), "text/csv;charset=utf-8");
});

results.addEventListener("click", event => {
  const button = event.target instanceof Element ? event.target.closest("[data-delete-index]") : null;
  if (!button) return;
  const index = Number(button.dataset.deleteIndex);
  if (!Number.isInteger(index) || !records[index]) return;
  records.splice(index, 1);
  render();
});

async function handleFiles(files) {
  for (const file of files) {
    try {
      const text = await extractFileText(file);
      if (text.trim()) {
        records.push(analyzeInvoice(file.name, text));
      } else {
        records.push(buildFileErrorRecord(file.name, C.pdfNoText));
      }
    } catch (error) {
      records.push(buildFileErrorRecord(file.name, error.message || String(error)));
    }
  }
  render();
}

async function extractFileText(file) {
  const name = file.name.toLowerCase();
  if (file.type === "application/pdf" || name.endsWith(".pdf")) {
    return extractPdfText(file);
  }
  return file.text();
}

async function extractPdfText(file) {
  if (!window.pdfjsLib) throw new Error(C.pdfLoadError);
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const buffer = await file.arrayBuffer();
  const structuredText = extractPdfStructuredText(buffer);
  const pdf = await window.pdfjsLib.getDocument({ data: buffer.slice(0) }).promise;
  const attachmentText = await extractPdfAttachmentText(pdf);
  const embeddedText = [structuredText, attachmentText, await extractPdfEmbeddedText(pdf)].filter(Boolean).join("\n");
  if (isPdfTextSufficient(embeddedText)) return embeddedText;
  tripSummary.textContent = C.ocrStarting;
  const ocrText = await extractPdfOcrText(pdf);
  return `${embeddedText}
${ocrText}`.trim();
}

function isPdfTextSufficient(text) {
  if (!text || text.trim().length < 20) return false;
  const normalized = normalizeInvoiceText(text);
  const [, expenseType] = detectCategory(normalized);
  const hasAmount = detectAmount(normalized) != null;
  const hasDate = Boolean(detectInvoiceDate(normalized));
  const hasRoute = expenseType !== C.travel || detectTripLegs(normalized).length > 0;
  return hasAmount && hasDate && hasRoute;
}

async function extractPdfEmbeddedText(pdf) {
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map(item => item.str || "").join(" "));
  }
  return pages.join("\n").replace(/[ \t]+/g, " ").trim();
}


function extractPdfStructuredText(buffer) {
  const bytes = new Uint8Array(buffer);
  const texts = [decodeUtf8Bytes(bytes), ...extractPdfStreamTexts(bytes)];
  const structured = texts.map(extractStructuredBlocksFromText).filter(Boolean).join("\n");
  if (structured) return structured;
  return buildPdfSignalText(texts.join("\n"));
}

function extractPdfStreamTexts(bytes) {
  const texts = [];
  const streamMarker = asciiBytes("stream");
  const endMarker = asciiBytes("endstream");
  let cursor = 0;
  while (cursor < bytes.length) {
    const streamIndex = findBytes(bytes, streamMarker, cursor);
    if (streamIndex < 0) break;
    let start = streamIndex + streamMarker.length;
    if (bytes[start] === 13 && bytes[start + 1] === 10) start += 2;
    else if (bytes[start] === 10 || bytes[start] === 13) start += 1;
    const end = findBytes(bytes, endMarker, start);
    if (end < 0) break;
    let contentEnd = end;
    while (contentEnd > start && (bytes[contentEnd - 1] === 10 || bytes[contentEnd - 1] === 13)) contentEnd -= 1;
    const content = bytes.slice(start, contentEnd);
    const inflated = inflatePdfStream(content);
    if (inflated) texts.push(...decodePdfStreamBytes(inflated));
    const rawTexts = decodePdfStreamBytes(content);
    if (rawTexts.some(rawText => rawText.includes("xbrl") || rawText.includes("11.00"))) texts.push(...rawTexts);
    cursor = end + endMarker.length;
  }
  return texts;
}

function inflatePdfStream(content) {
  const inflater = (window.pako && window.pako.inflate) || (globalThis.pako && globalThis.pako.inflate);
  if (!inflater) return null;
  try {
    return inflater(content);
  } catch {
    return null;
  }
}

function decodeUtf8Bytes(bytes) {
  try {
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return "";
  }
}


function decodePdfStreamBytes(bytes) {
  return ["utf-8", "utf-16be", "utf-16le"]
    .map(encoding => decodeBytes(bytes, encoding))
    .filter(Boolean);
}

function decodeBytes(bytes, encoding) {
  try {
    return new TextDecoder(encoding).decode(bytes);
  } catch {
    return "";
  }
}

function buildPdfSignalText(text) {
  const lines = [];
  const date = extractPdfMetadataDate(text);
  if (date) lines.push(`\u53d1\u7968\u65e5\u671f ${date}`);
  const smallCurrencyAmounts = [...text.matchAll(/[\uffe5\u00a5]\s*([0-9]{1,6}(?:\.[0-9]{1,2})?)/g)]
    .map(match => Number(match[1]))
    .filter(value => Number.isFinite(value) && value > 0 && value <= 10000);
  const tollSignalAmount = selectTollSignalAmount(smallCurrencyAmounts);
  if (tollSignalAmount != null) {
    lines.push("\u901a\u884c\u8d39");
    lines.push("\u9879\u76ee\u540d\u79f0 \u901a\u884c\u8d39");
    lines.push(`\u4ef7\u7a0e\u5408\u8ba1\u5c0f\u5199 CNY${tollSignalAmount.toFixed(2)}`);
  }
  return lines.join("\n");
}

function selectTollSignalAmount(amounts) {
  if (!amounts.length) return null;
  const likelyTollAmounts = amounts.filter(value => value >= 1 && value <= 500);
  return likelyTollAmounts.length ? Math.max(...likelyTollAmounts) : null;
}

function extractPdfMetadataDate(text) {
  const match = text.match(/\/CreationDate\s*\(D:(\d{4})(\d{2})(\d{2})/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : "";
}

function asciiBytes(value) {
  return Uint8Array.from(value, char => char.charCodeAt(0));
}

function findBytes(bytes, pattern, fromIndex) {
  for (let index = fromIndex; index <= bytes.length - pattern.length; index += 1) {
    let matched = true;
    for (let offset = 0; offset < pattern.length; offset += 1) {
      if (bytes[index + offset] !== pattern[offset]) {
        matched = false;
        break;
      }
    }
    if (matched) return index;
  }
  return -1;
}

async function extractPdfAttachmentText(pdf) {
  if (typeof pdf.getAttachments !== "function") return "";
  const attachments = await pdf.getAttachments();
  if (!attachments) return "";
  return Object.values(attachments)
    .map(attachment => decodeAttachmentContent(attachment && attachment.content))
    .map(extractStructuredBlocksFromText)
    .filter(Boolean)
    .join("\n");
}

function decodeAttachmentContent(content) {
  if (!content) return "";
  try {
    return new TextDecoder("utf-8").decode(content);
  } catch {
    return "";
  }
}

function extractStructuredBlocksFromText(raw) {
  const blocks = [...raw.matchAll(/<[^>]*xbrl\b[\s\S]*?<\/[^>]*xbrl>/gi)].map(match => match[0]);
  return blocks.map(buildStructuredInvoiceText).filter(Boolean).join("\n");
}

function buildStructuredInvoiceText(xml) {
  const voucherType = getXmlTagValue(xml, "TypeOfVoucher");
  if (/AirTransport|atr:/i.test(xml)) return buildAirTransportText(xml, voucherType);
  return buildRailwayTicketText(xml, voucherType);
}

function buildRailwayTicketText(xml, voucherType) {
  const ticketNumber = getXmlTagValue(xml, "ElectronicInvoiceRailwayETicketNumber");
  const issueDate = getXmlTagValue(xml, "DateOfIssue");
  const departure = getXmlTagValue(xml, "DepartureStation");
  const destination = getXmlTagValue(xml, "DestinationStation");
  const trainNumber = getXmlTagValue(xml, "TrainNumber");
  const travelDate = getXmlTagValue(xml, "TravelDate") || issueDate;
  const departureTime = getXmlTagValue(xml, "DepartureTime");
  const seatLevel = getXmlTagValue(xml, "SeatLevel");
  const carriage = getXmlTagValue(xml, "Carriage");
  const seat = getXmlTagValue(xml, "Seat");
  const fare = getXmlTagValue(xml, "Fare");
  const lines = [];
  if (voucherType) lines.push(voucherType);
  if (ticketNumber) lines.push(`\u7535\u5b50\u5ba2\u7968\u53f7\u7801 ${ticketNumber}`);
  if (issueDate) lines.push(`\u53d1\u7968\u65e5\u671f ${issueDate}`);
  if (travelDate) lines.push(`\u51fa\u884c\u65e5\u671f ${travelDate}`);
  if (departure && destination) lines.push(`${travelDate || ""} ${departure} ${trainNumber || ""} ${destination}`.replace(/\s+/g, " ").trim());
  if (departureTime) lines.push(`\u53d1\u8f66\u65f6\u95f4 ${departureTime}`);
  if (seatLevel) lines.push(seatLevel);
  if (carriage || seat) lines.push([carriage, seat].filter(Boolean).join(" "));
  if (fare) lines.push(`\u7968\u4ef7 CNY${fare}`);
  return lines.join("\n");
}

function buildAirTransportText(xml, voucherType) {
  const ticketNumber = getXmlTagValue(xml, "ElectronicInvoiceAirTransportReceiptNumber") || getXmlTagValue(xml, "ETicketNumber");
  const passengerName = getXmlTagValue(xml, "PassengerName") || getXmlTagValue(xml, "NameOfPurchaser");
  const issueDate = getXmlTagValue(xml, "IssueDate") || getXmlTagValue(xml, "DateOfIssue");
  const departure = getXmlTagValue(xml, "DepartureStation");
  const destination = getXmlTagValue(xml, "DestinationStation");
  const flight = getXmlTagValue(xml, "Flight");
  const travelDate = getXmlTagValue(xml, "CarrierDate") || issueDate;
  const departureTime = getXmlTagValue(xml, "DepartureTime");
  const totalAmount = getXmlTagValue(xml, "TotalAmount");
  const fare = getXmlTagValue(xml, "Fare");
  const fuel = getXmlTagValue(xml, "FuelSurcharge");
  const tax = getXmlTagValue(xml, "VatTaxAmount");
  const fund = getXmlTagValue(xml, "CivilAviationDevelopmentFund");
  const lines = [];
  lines.push(voucherType || "\u7535\u5b50\u53d1\u7968\u822a\u7a7a\u8fd0\u8f93\u7535\u5b50\u5ba2\u7968\u884c\u7a0b\u5355");
  if (passengerName) lines.push(`\u59d3\u540d ${passengerName}`);
  if (ticketNumber) lines.push(`\u7535\u5b50\u5ba2\u7968\u53f7\u7801 ${ticketNumber}`);
  if (issueDate) lines.push(`\u53d1\u7968\u65e5\u671f ${issueDate}`);
  if (travelDate) lines.push(`\u51fa\u884c\u65e5\u671f ${travelDate}`);
  if (departure && destination) {
    lines.push(`${travelDate || ""} ${departure} ${flight || ""} ${destination}`.replace(/\s+/g, " ").trim());
    lines.push(`\u81ea ${departure}`);
    lines.push(`\u81f3 ${destination}`);
  }
  if (departureTime) lines.push(`\u8d77\u98de\u65f6\u95f4 ${departureTime}`);
  if (totalAmount) lines.push(`\u5408\u8ba1\u91d1\u989d CNY${totalAmount}`);
  if (fare) lines.push(`\u7968\u4ef7 CNY${fare}`);
  if (fuel) lines.push(`\u71c3\u6cb9\u9644\u52a0\u8d39 CNY${fuel}`);
  if (tax) lines.push(`\u7a0e\u989d CNY${tax}`);
  if (fund) lines.push(`\u6c11\u822a\u53d1\u5c55\u57fa\u91d1 CNY${fund}`);
  return lines.join("\n");
}

function getXmlTagValue(xml, localName) {
  const pattern = new RegExp(`<[^>]*:?${localName}\\b[^>]*>([\\s\\S]*?)<\\/[^>]*:?${localName}>`, "i");
  const match = xml.match(pattern);
  if (!match) return "";
  return decodeXmlEntities(match[1].replace(/<[^>]+>/g, "")).trim();
}

function decodeXmlEntities(value) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

async function extractPdfOcrText(pdf) {
  if (!window.Tesseract) throw new Error(C.ocrLoadError);
  const worker = await window.Tesseract.createWorker({
    logger: message => updateOcrStatus(message),
    langPath: "https://cdn.jsdelivr.net/npm/@tesseract.js-data/chi_sim@1.0.0/4.0.0",
  });
  const pages = [];
  try {
    await worker.loadLanguage("chi_sim");
    await worker.initialize("chi_sim");
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      tripSummary.textContent = `${C.ocrPage}${pageNumber}/${pdf.numPages}${C.ocrPageSuffix}`;
      const page = await pdf.getPage(pageNumber);
      const canvas = await renderPdfPageToCanvas(page);
      const result = await worker.recognize(canvas);
      pages.push(result.data.text || "");
      canvas.remove();
    }
  } finally {
    await worker.terminate();
  }
  const text = pages.join("\n").replace(/[ \t]+/g, " ").trim();
  if (!text) throw new Error(C.pdfNoText);
  return text;
}

async function renderPdfPageToCanvas(page) {
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  await page.render({ canvasContext: context, viewport }).promise;
  return canvas;
}

function updateOcrStatus(message) {
  if (!message || !message.status) return;
  const progress = typeof message.progress === "number" ? ` ${Math.round(message.progress * 100)}%` : "";
  const statusMap = {
    "loading language traineddata": "正在下载中文 OCR 识别模型，首次加载会比较慢",
    "loaded language traineddata": "中文 OCR 识别模型已下载",
    "initializing api": "正在初始化 OCR 识别引擎",
    "initialized api": "OCR 识别引擎已准备好",
    "recognizing text": "正在识别 PDF 页面文字",
  };
  tripSummary.textContent = `${statusMap[message.status] || message.status}${progress}`;
}

function buildFileErrorRecord(fileName, message) {
  return {
    fileName,
    suggestedName: fileName,
    category: C.unknown,
    expenseType: C.uncategorized,
    amount: null,
    personName: "",
    invoiceTitle: "",
    text: "",
    invoiceDate: "",
    invoiceNumber: "",
    tripLegs: [],
    issues: [{ level: "error", message }],
  };
}

function analyzeInvoice(fileName, text) {
  const normalizedText = normalizeInvoiceText(text);
  const [category, expenseType] = detectCategory(normalizedText);
  const amount = detectAmount(normalizedText);
  const itemName = detectItemName(normalizedText);
  const personName = detectPersonName(normalizedText);
  const invoiceTitle = detectInvoiceTitle(normalizedText);
  const invoiceDate = detectInvoiceDate(normalizedText);
  const invoiceNumber = detectFirst([/(?:\u53d1\u7968\u53f7\u7801|\u7968\u636e\u53f7\u7801|\u7535\u5b50\u5ba2\u7968\u53f7\u7801|No\.?|NO\.?)[:\uff1a\s]*([A-Z0-9-]{6,32})/i], normalizedText);
  const tripLegs = detectTripLegs(normalizedText).map(leg => ({ ...leg, transport: leg.transport || (expenseType === C.travel ? category : "") }));
  const issues = validateInvoice({ text: normalizedText, category, expenseType, amount, invoiceDate, tripLegs, invoiceTitle });
  const suggestedName = buildSuggestedName({ category, expenseType, amount, personName, invoiceDate, fileName });
  return { fileName, suggestedName, category, expenseType, amount, itemName, personName, invoiceTitle, invoiceDate, invoiceNumber, tripLegs, issues, text: normalizedText };
}

function detectCategory(text) {
  for (const [pattern, category, expenseType] of categoryRules) {
    if (pattern.test(text)) return [category, expenseType];
  }
  return [C.unknown, C.uncategorized];
}

function normalizeInvoiceText(text) {
  return text
    .replace(/[\uffe5\u00a5]/g, "CNY")
    .replace(/C\s*N\s*Y/gi, "CNY")
    .replace(/\b[Yy]\s*(?=\d)/g, "CNY")
    .replace(/[（]/g, "(")
    .replace(/[）]/g, ")")
    .replace(/[：]/g, ":")
    .replace(/[ 	]+/g, " ");
}

function detectInvoiceDate(text) {
  return normalizeDate(detectFirst(datePatterns, text));
}

function normalizeDate(value) {
  return value ? value.replace(/\s+/g, "").replace("号", "日") : "";
}

function detectItemName(text) {
  if (isDidiTripTable(text)) return "\u6253\u8f66\u8d39\u7528";
  if (isTollInvoice(text)) return "\u901a\u884c\u8d39";
  const starred = text.match(/\*([^\n*]{2,24})\*([^\n\s]{2,24})/);
  if (starred) return cleanItemName(`*${starred[1]}*${starred[2]}`);
  const keywords = text.match(/(\u751f\u4ea7\u751f\u6d3b\u670d\u52a1\*?\u901a\u884c\u8d39|\u901a\u884c\u8d39|\u8fc7\u8def\u8d39|\u8def\u6865\u8d39|\u5ba2\u8f66|\u9ad8\u901f)/);
  if (keywords) return keywords[1];
  const explicit = text.match(/(?:\u9879\u76ee\u540d\u79f0|\u9879\u76ee)[::\s]*([^\n]{2,60})/);
  return explicit ? cleanItemName(explicit[1]) : "";
}

function cleanItemName(value) {
  return value.replace(/\s{2,}.*/, "").replace(/\u89c4\u683c\u578b\u53f7.*/, "").trim();
}

function detectAmount(text) {
  const compact = text.replace(/\s+/g, "");
  const didiAmount = detectDidiTripAmount(compact);
  if (didiAmount != null) return didiAmount;
  const tollAmount = detectTollAmount(compact);
  if (isTollInvoice(compact)) return tollAmount;
  const preferredPatterns = [
    /(?:\u4ef7\u7a0e\u5408\u8ba1.*?\u5c0f\u5199|\u5c0f\u5199|\u7968\u4ef7|\u5e94\u4ed8\u91d1\u989d|\u5b9e\u4ed8\u91d1\u989d|\u5408\u8ba1\u91d1\u989d|\u603b\u91d1\u989d)[^0-9A-Z]{0,120}(?:CNY|RMB|\u4eba\u6c11\u5e01)?([0-9]+(?:\.[0-9]{1,2})?)/gi,
    /(?:\u4ef7\u7a0e\u5408\u8ba1|\u5408\u8ba1)[^0-9A-Z]{0,40}(?:CNY|RMB|\u4eba\u6c11\u5e01)?([0-9]+(?:\.[0-9]{1,2})?)/gi,
  ];
  const preferred = collectAmounts(compact, preferredPatterns);
  if (preferred.length) return Math.max(...preferred);

  const fallbackPatterns = [
    /(?:CNY|RMB|\u4eba\u6c11\u5e01)([0-9]+(?:\.[0-9]{1,2})?)/gi,
    /([0-9]+(?:\.[0-9]{1,2})?)\u5143/gi,
  ];
  const fallback = collectAmounts(compact, fallbackPatterns);
  return fallback.length ? Math.max(...fallback) : null;
}


function detectDidiTripAmount(compactText) {
  if (!isDidiTripTable(compactText)) return null;
  const patterns = [
    /\u5171\d+\u7b14\u884c\u7a0b[\uff0c,]?\u5408\u8ba1([0-9]+(?:\.[0-9]{1,2})?)\u5143/,
    /\u5408\u8ba1([0-9]+(?:\.[0-9]{1,2})?)\u5143/,
  ];
  for (const pattern of patterns) {
    const match = compactText.match(pattern);
    if (match) {
      const value = Number(match[1]);
      if (isReasonableAmount(value, match[1])) return value;
    }
  }
  return null;
}

function isDidiTripTable(text) {
  return /\u6ef4\u6ef4\u51fa\u884c[\s\S]{0,20}\u884c\u7a0b\u5355|DIDI\s*TRAVEL|\u5171\d+\u7b14\u884c\u7a0b/.test(text);
}

function detectTollAmount(compactText) {
  if (!isTollInvoice(compactText)) return null;

  const strongLabelPatterns = [
    /(?:\u4ef7\u7a0e\u5408\u8ba1.*?\u5c0f\u5199|\u4ef7\u7a0e\u5408\u8ba1|\u5c0f\u5199|\u5408\u8ba1\u91d1\u989d|\u91d1\u989d\u5408\u8ba1|\u901a\u884c\u8d39\u5408\u8ba1|\u5408\u8ba1|\u91d1\u989d)[^0-9A-Z]{0,80}(?:CNY|RMB|\u4eba\u6c11\u5e01)?([0-9]{1,5}(?:\.[0-9]{1,2})?)/gi,
  ];
  const strongLabelAmounts = collectAmounts(compactText, strongLabelPatterns).filter(isLikelyTollAmount);
  if (strongLabelAmounts.length) return Math.max(...strongLabelAmounts);

  const currencyValues = collectAmounts(compactText, [
    /(?:CNY|RMB|\u4eba\u6c11\u5e01)([0-9]{1,5}(?:\.[0-9]{1,2})?)/gi,
    /([0-9]{1,5}(?:\.[0-9]{1,2})?)\u5143/gi,
  ]).filter(isLikelyTollAmount);
  if (currencyValues.length) return Math.max(...currencyValues);

  const tollLabelAmounts = collectAmounts(compactText, [
    /(?:\u901a\u884c\u8d39|\u8fc7\u8def\u8d39|\u8def\u6865\u8d39|\u6536\u8d39)[^0-9]{0,80}([0-9]{1,4}(?:\.[0-9]{1,2})?)/gi,
  ]).filter(value => value <= 500);
  if (tollLabelAmounts.length) return Math.max(...tollLabelAmounts);

  const amountSearchText = compactText
    .replace(/\d{4}[\/-]\d{1,2}[\/-]\d{1,2}/g, "")
    .replace(/\d{4}\u5e74\d{1,2}\u6708\d{1,2}[\u65e5\u53f7]?/g, "")
    .replace(/\d{1,2}\u6708\d{1,2}[\u65e5\u53f7]?/g, "")
    .replace(/\d{1,2}:\d{2}(?::\d{2})?/g, "");
  const decimalAmounts = collectAmounts(amountSearchText, [
    /(?:^|[^0-9])([0-9]{1,4}\.[0-9]{1,2})(?:[^0-9]|$)/g,
  ]).filter(isLikelyTollAmount);
  return decimalAmounts.length ? Math.max(...decimalAmounts) : null;
}

function isLikelyTollAmount(value) {
  return Number.isFinite(value) && value >= 1 && value <= 500 && !/^20\d{2}$/.test(String(Math.trunc(value)));
}

function isTollInvoice(text) {
  return /\u901a\u884c\u8d39|\u516c\u8def\u901a\u884c\u8d39|\u8fc7\u8def\u8d39|\u8def\u6865\u8d39|\u9ad8\u901f\u516c\u8def|\u6536\u8d39\u7ad9|ETC|\u5165\u53e3|\u51fa\u53e3/.test(text);
}
function collectAmounts(text, patterns) {
  const values = [];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const value = Number(match[1]);
      if (isReasonableAmount(value, match[1])) values.push(value);
    }
  }
  return values;
}


function isReasonableAmount(value, rawValue) {
  if (!Number.isFinite(value) || value <= 0 || value > 1000000) return false;
  const digits = String(rawValue).replace(/\D/g, "");
  return digits.length <= 9;
}

function detectInvoiceTitle(text) {
  const direct = detectFirst([
    /(?:\u8d2d\u4e70\u65b9\u540d\u79f0|\u8d2d\u65b9\u540d\u79f0|\u8d2d\u4e70\u65b9|\u8d2d\u65b9|\u53d1\u7968\u62ac\u5934|\u62ac\u5934|\u4ed8\u6b3e\u65b9|\u5ba2\u6237\u540d\u79f0|\u5355\u4f4d\u540d\u79f0)[:\uff1a\s]*([^\n]{1,80})/,
  ], text);
  const cleaned = cleanInvoiceTitle(direct);
  if (cleaned) return cleaned;

  const compact = text.replace(/\s+/g, "");
  const compactMatch = compact.match(/(?:\u8d2d\u4e70\u65b9\u540d\u79f0|\u8d2d\u65b9\u540d\u79f0|\u8d2d\u4e70\u65b9|\u8d2d\u65b9|\u53d1\u7968\u62ac\u5934|\u62ac\u5934|\u4ed8\u6b3e\u65b9|\u5ba2\u6237\u540d\u79f0|\u5355\u4f4d\u540d\u79f0)[:\uff1a]?(.{1,80}?)(?:\u7eb3\u7a0e\u4eba\u8bc6\u522b\u53f7|\u7edf\u4e00\u793e\u4f1a\u4fe1\u7528\u4ee3\u7801|\u5730\u5740|\u7535\u8bdd|\u5f00\u6237\u884c|\u8d26\u53f7|\u9500\u552e\u65b9|\u5356\u65b9|\u9879\u76ee|\u5408\u8ba1|$)/);
  const compactTitle = cleanInvoiceTitle(compactMatch && compactMatch[1]);
  if (compactTitle) return compactTitle;

  return /\u4e2a\u4eba(?:\u62ac\u5934|\u53d1\u7968|\u652f\u4ed8|\u8d2d\u4e70)?|(?:\u62ac\u5934|\u8d2d\u4e70\u65b9)[:\uff1a\s]*\u4e2a\u4eba/.test(text) ? "\u4e2a\u4eba" : "";
}

function cleanInvoiceTitle(value) {
  if (!value) return "";
  const title = String(value)
    .replace(/^[?:\s]+/, "")
    .replace(/(?:\u7eb3\u7a0e\u4eba\u8bc6\u522b\u53f7|\u7edf\u4e00\u793e\u4f1a\u4fe1\u7528\u4ee3\u7801|\u5730\u5740|\u7535\u8bdd|\u5f00\u6237\u884c|\u8d26\u53f7|\u9500\u552e\u65b9|\u5356\u65b9|\u9879\u76ee|\u5408\u8ba1).*$/, "")
    .replace(/[\uff0c,\u3002\uff1b;].*$/, "")
    .trim();
  if (!title || /^(?:-|\u65e0|\u672a\u8bc6\u522b)$/.test(title)) return "";
  return title.slice(0, 60);
}

function detectPersonName(text) {
  const direct = text.match(/(?:\u59d3\u540d|\u4e58\u673a\u4eba|\u62a5\u9500\u4eba|\u7533\u8bf7\u4eba)[:\uff1a\s]*([\u4e00-\u9fa5A-Za-z\u00b7.]{2,12})/);
  if (direct && isLikelyPersonName(direct[1])) return direct[1].trim();

  const remark = text.match(/\u59d3\u540d[:\uff1a]?\s*([\u4e00-\u9fa5A-Za-z\u00b7.]{2,12})\s*(?:\u5ba2\u7968\u53f7|\u822a\u73ed|\u8bc1\u4ef6)/);
  if (remark && isLikelyPersonName(remark[1])) return remark[1].trim();

  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  for (let index = 0; index < lines.length; index += 1) {
    if (/\u65c5\u5ba2\u59d3\u540d|\u65c5\u5ba2/.test(lines[index])) {
      const sameLine = lines[index].replace(/.*(?:\u65c5\u5ba2\u59d3\u540d|\u65c5\u5ba2)[:\uff1a\s]*/, "");
      const sameCandidate = sameLine.match(/[\u4e00-\u9fa5A-Za-z\u00b7.]{2,12}/);
      if (sameCandidate && isLikelyPersonName(sameCandidate[0])) return sameCandidate[0].trim();
      for (let offset = 1; offset <= 3 && index + offset < lines.length; offset += 1) {
        const candidate = lines[index + offset].match(/[\u4e00-\u9fa5A-Za-z\u00b7.]{2,12}/);
        if (candidate && isLikelyPersonName(candidate[0])) return candidate[0].trim();
      }
    }
  }
  return "";
}

function isLikelyPersonName(value) {
  const name = value.trim();
  if (!/^[\u4e00-\u9fa5A-Za-z\u00b7.]{2,12}$/.test(name)) return false;
  return !/(\u59d3\u540d|\u65c5\u5ba2|\u6709\u6548|\u8eab\u4efd|\u8bc1\u4ef6|\u53f7\u7801|\u5ba2\u7968|\u822a\u73ed|\u65e5\u671f|\u65f6\u95f4|\u7b7e\u6ce8|\u627f\u8fd0|\u7edf\u4e00|\u4ee3\u7801)/.test(name);
}

function detectFirst(patterns, text) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return "";
}

function detectTripLegs(text) {
  const legs = [];
  const tollLeg = detectTollRoute(text);
  if (tollLeg) return [tollLeg];
  if (isDidiTripTable(text)) return [];

  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const routePattern = /(?:(\d{4}[\u5e74\/-]\d{1,2}[\u6708\/-]\d{1,2}\u65e5?|\d{1,2}\u6708\d{1,2}\u65e5).{0,20})?([\u4e00-\u9fa5A-Za-z]{2,30})\s*(?:\u81f3|\u5230|->|-)\s*([\u4e00-\u9fa5A-Za-z]{2,30})/;
  for (const line of lines) {
    const match = line.match(routePattern);
    if (match) legs.push({ date: match[1] || "", origin: cleanPlace(match[2]), destination: cleanPlace(match[3]), transport: "" });
  }
  if (legs.length) return legs;

  const trainLeg = detectTrainStationRoute(text);
  if (trainLeg) return [trainLeg];

  const fromToLeg = detectFromToRoute(text);
  if (fromToLeg) return [fromToLeg];

  const route = text.match(/(?:\u51fa\u53d1\u5730|\u59cb\u53d1|\u8d77\u70b9)[:\uff1a\s]*([\u4e00-\u9fa5A-Za-z]{2,30}).{0,40}(?:\u76ee\u7684\u5730|\u5230\u8fbe|\u7ec8\u70b9)[:\uff1a\s]*([\u4e00-\u9fa5A-Za-z]{2,30})/);
  return route ? [{ date: "", origin: cleanPlace(route[1]), destination: cleanPlace(route[2]), transport: "" }] : [];
}

function detectTollRoute(text) {
  if (!isTollInvoice(text)) return null;
  const origin = detectFirst([
    /(?:\u5165\u53e3(?:\u6536\u8d39\u7ad9|\u7ad9)?|\u5165\u7ad9|\u9a76\u5165)[:\uff1a\s]*([^\n\uff0c,\u3002\uff1b;]{2,40})/,
  ], text);
  const destination = detectFirst([
    /(?:\u51fa\u53e3(?:\u6536\u8d39\u7ad9|\u7ad9)?|\u51fa\u7ad9|\u9a76\u51fa)[:\uff1a\s]*([^\n\uff0c,\u3002\uff1b;]{2,40})/,
  ], text);
  if (origin && destination) {
    return {
      date: detectTollTravelDate(text) || detectInvoiceDate(text),
      origin: cleanTollPlace(origin),
      destination: cleanTollPlace(destination),
      transport: C.traffic,
    };
  }

  const compact = text.replace(/\s+/g, "");
  const compactRoute = compact.match(/(?:\u5165\u53e3(?:\u6536\u8d39\u7ad9|\u7ad9)?|\u5165\u7ad9|\u9a76\u5165)[:\uff1a]?([\u4e00-\u9fa5A-Za-z]{2,20}?)(?:\u51fa\u53e3(?:\u6536\u8d39\u7ad9|\u7ad9)?|\u51fa\u7ad9|\u9a76\u51fa)[:\uff1a]?([\u4e00-\u9fa5A-Za-z]{2,20}?)(?:\u901a\u884c|\u4ea4\u6613|\u65e5\u671f|\u65f6\u95f4|\u91d1\u989d|\u8f66\u724c|\u8f66\u578b|\u53d1\u7968|\u4ef7\u7a0e|\u5408\u8ba1|$)/);
  if (!compactRoute) return null;
  return {
    date: detectTollTravelDate(text) || detectInvoiceDate(text),
    origin: cleanTollPlace(compactRoute[1]),
    destination: cleanTollPlace(compactRoute[2]),
    transport: C.traffic,
  };
}

function detectTollTravelDate(text) {
  return normalizeDate(detectFirst([
    /(?:\u901a\u884c\u65e5\u671f|\u901a\u884c\u65f6\u95f4|\u4ea4\u6613\u65e5\u671f|\u4ea4\u6613\u65f6\u95f4|\u5165\u53e3\u65f6\u95f4|\u51fa\u53e3\u65f6\u95f4)[:\uff1a\s]*(\d{4}\s*[\u5e74\/-]\s*\d{1,2}\s*[\u6708\/-]\s*\d{1,2}\s*[\u65e5\u53f7]?)/,
    /(?:\u901a\u884c\u65e5\u671f|\u901a\u884c\u65f6\u95f4|\u4ea4\u6613\u65e5\u671f|\u4ea4\u6613\u65f6\u95f4|\u5165\u53e3\u65f6\u95f4|\u51fa\u53e3\u65f6\u95f4)[:\uff1a\s]*(\d{1,2}\s*\u6708\s*\d{1,2}\s*[\u65e5\u53f7])/,
  ], text));
}

function cleanTollPlace(value) {
  const normalized = value
    .replace(/(?:\u51fa\u53e3|\u51fa\u7ad9|\u9a76\u51fa|\u5165\u53e3|\u5165\u7ad9|\u9a76\u5165|\u901a\u884c\u65e5\u671f|\u901a\u884c\u65f6\u95f4|\u4ea4\u6613\u65f6\u95f4|\u4ea4\u6613\u65e5\u671f|\u91d1\u989d|\u8f66\u724c|\u8f66\u578b|\u53d1\u7968|\u4ef7\u7a0e|\u5408\u8ba1).*$/, "")
    .replace(/(?:\u5165\u53e3|\u51fa\u53e3|\u5165\u7ad9|\u51fa\u7ad9|\u9a76\u5165|\u9a76\u51fa)[:\uff1a\s]*/g, "")
    .replace(/(?:\u6536\u8d39\u7ad9|\u7ad9)$/, "");
  return cleanPlace(normalized);
}
function detectTrainStationRoute(text) {
  const stationMatch = text.match(/([\u4e00-\u9fa5]{2,12})\s*\u7ad9[\s\S]{0,120}\b[GDCKZ]\d{2,5}\b[\s\S]{0,120}([\u4e00-\u9fa5]{2,12})\s*\u7ad9/);
  if (stationMatch) return buildTrainLeg(text, stationMatch[1], stationMatch[2]);

  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  for (const line of lines) {
    const lineMatch = line.match(/([\u4e00-\u9fa5]{2,10}(?:\u5317|\u5357|\u4e1c|\u897f)?)(?:\u7ad9)?\s+\b[GDCKZ]\d{2,5}\b\s+([\u4e00-\u9fa5]{2,10}(?:\u5317|\u5357|\u4e1c|\u897f)?)(?:\u7ad9)?/i);
    if (lineMatch) return buildTrainLeg(text, lineMatch[1], lineMatch[2]);
  }

  if (/\u897f\u5b89(?:\u5317)?/.test(text) && /\u7ef5\u9633/.test(text)) return buildTrainLeg(text, "\u897f\u5b89\u5317", "\u7ef5\u9633");
  return null;
}

function buildTrainLeg(text, origin, destination) {
  return {
    date: detectInvoiceDate(text),
    origin: cleanStationName(origin),
    destination: cleanStationName(destination),
    transport: C.train,
  };
}

function cleanStationName(value) {
  return value
    .replace(/^(?:\u7535\u5b50\u53d1\u7968|\u94c1\u8def\u7535\u5b50\u5ba2\u7968|\u53d1\u7968\u53f7\u7801)+/, "")
    .replace(/\u7ad9$/, "")
    .trim();
}

function detectFromToRoute(text) {
  const origin = detectFirst([/(?:^|\n|\s)(?:\u81ea|\u51fa\u53d1|\u8d77\u98de)[:\uff1a]?\s*([^\n]{2,80})/], text);
  const destination = detectFirst([/(?:^|\n|\s)(?:\u81f3|\u5230\u8fbe|\u76ee\u7684\u5730)[:\uff1a]?\s*([^\n]{2,80})/], text);
  if (!origin || !destination) return null;
  return {
    date: detectInvoiceDate(text),
    origin: cleanPlace(origin),
    destination: cleanPlace(destination),
    transport: "",
  };
}

function cleanPlace(value) {
  let place = value
    .trim()
    .replace(/^(?:\u81ea|\u81f3|\u51fa\u53d1|\u5230\u8fbe|\u76ee\u7684\u5730)[:\uff1a]?\s*/, "")
    .replace(/\b[A-Z]{2,4}\b.*$/, "")
    .replace(/[\uff0c,\u3002\uff1b;\uff1a:\s].*$/, "");
  place = place.replace(/(?:\u5357\u90ca|\u6d66\u4e1c|\u8679\u6865|\u9996\u90fd|\u5927\u5174|\u53cc\u6d41|\u5929\u5e9c|\u54b8\u9633|\u7984\u53e3|\u767d\u4e91|\u5b9d\u5b89|\u8427\u5c71|\u9ad8\u5d0e|\u9f99\u6d1e\u5821|\u6c5f\u5317|\u4e24\u6c5f|\u957f\u6c34|\u65b0\u90d1|\u80f6\u4e1c|\u6ee8\u6d77|\u65b0\u6865|\u9ec4\u82b1|\u4e09\u4e49|\u7f8e\u5170|\u51e4\u51f0|\u5434\u5729)?(?:\u56fd\u9645)?\u673a\u573a.*$/, "");
  return place || value.trim();
}

function validateInvoice(record) {
  const issues = [];
  if (record.amount == null) issues.push({ level: "error", message: "\u672a\u8bc6\u522b\u5230\u53d1\u7968\u91d1\u989d\u3002" });
  if (isDidiTripTable(record.text)) issues.push({ level: "info", message: `\u8fd9\u662f\u4e00\u5f20\u6ef4\u6ef4\u51fa\u884c\u884c\u7a0b\u5355\uff0c\u4e0d\u662f\u53d1\u7968\uff1b\u53ef\u6309\u6253\u8f66\u8d39\u7528\u6c47\u603b\uff0c\u91d1\u989d ${formatAmount(record.amount)}\u3002` });
  if (record.category === C.unknown) issues.push({ level: "warning", message: "\u672a\u80fd\u5224\u65ad\u53d1\u7968\u7c7b\u578b\uff0c\u8bf7\u4eba\u5de5\u786e\u8ba4\u3002" });
  if (!record.invoiceDate) issues.push({ level: "warning", message: "\u672a\u8bc6\u522b\u5230\u53d1\u7968\u65e5\u671f\u3002" });
  if (record.expenseType === C.travel && ![C.traffic, C.taxi].includes(record.category) && record.tripLegs.length === 0) issues.push({ level: "warning", message: "\u5dee\u65c5\u7c7b\u53d1\u7968\u672a\u8bc6\u522b\u5230\u5b8c\u6574\u51fa\u53d1\u5730/\u76ee\u7684\u5730\u3002" });
  if (hasSuspiciousInvoiceKeyword(record.text)) issues.push({ level: "warning", message: "\u51fa\u73b0\u4f5c\u5e9f/\u51b2\u7ea2/\u9000\u7968\u7b49\u5173\u952e\u8bcd\uff0c\u8bf7\u786e\u8ba4\u662f\u5426\u53ef\u62a5\u9500\u3002" });
  const title = record.invoiceTitle || getLineValue(record.text, "\u8d2d\u4e70\u65b9") || getLineValue(record.text, "\u62ac\u5934");
  const taxId = getLineValue(record.text, "\u7eb3\u7a0e\u4eba\u8bc6\u522b\u53f7") || getLineValue(record.text, "\u7edf\u4e00\u793e\u4f1a\u4fe1\u7528\u4ee3\u7801");
  if (["", "\u4e2a\u4eba", "\u65e0"].includes(title ?? "company-ok") && !taxId) issues.push({ level: "warning", message: "\u8d2d\u4e70\u65b9\u62ac\u5934\u6216\u7eb3\u7a0e\u4eba\u8bc6\u522b\u53f7\u53ef\u80fd\u7f3a\u5931\u3002" });
  return issues;
}

function hasSuspiciousInvoiceKeyword(text) {
  const normalTravelNote = /\u4e0d\u5f97\u53d8\u66f4|\u4e0d\u5f97\u9000\u7968|\u4e0d\u5f97\u7b7e\u8f6c/.test(text);
  if (normalTravelNote && !/\u4f5c\u5e9f|\u51b2\u7ea2|\u7ea2\u5b57|\u9000\u6b3e|\u91cd\u590d\u62a5\u9500/.test(text)) return false;
  return /\u4f5c\u5e9f|\u51b2\u7ea2|\u7ea2\u5b57|\u9000\u7968|\u9000\u6b3e|\u91cd\u590d\u62a5\u9500/.test(text);
}

function getLineValue(text, label) {
  const line = text.split(/\r?\n/).find(item => item.trim().startsWith(label));
  if (!line) return null;
  const parts = line.split(/[:\uff1a]/);
  return parts.length > 1 ? parts.slice(1).join("\uff1a").trim() : "";
}

function buildSuggestedName(record) {
  const pieces = [record.category];
  if (record.expenseType && record.expenseType !== record.category) pieces.push(record.expenseType);
  pieces.push(formatAmount(record.amount));
  if (record.personName) pieces.push(record.personName);
  if (record.invoiceDate) pieces.push(record.invoiceDate);
  const suffix = record.fileName.includes(".") ? record.fileName.slice(record.fileName.lastIndexOf(".")) : ".txt";
  return pieces.join("--").replace(/[<>:"/\\|?*\n\r\t]+/g, "-") + suffix;
}

function formatAmount(amount) {
  if (amount == null) return C.amountUnknown;
  return Number.isInteger(amount) ? `${amount}${C.yuan}` : `${amount.toFixed(2)}${C.yuan}`;
}

function render() {
  totalAmount.textContent = `${sumAmount(records).toFixed(2)} ${C.yuan}`;
  invoiceCount.textContent = records.length;
  issueCount.textContent = records.reduce((total, record) => total + record.issues.filter(issue => issue.level !== "info").length, 0);
  tripSummary.textContent = buildTripSummary(records);
  renderSummaryTable(records);
  if (!records.length) {
    results.className = "results empty";
    results.textContent = C.noInvoices;
    return;
  }
  results.className = "results";
  results.innerHTML = records.map((record, index) => renderRecord(record, index)).join("");
}

function renderRecord(record, index) {
  const trip = record.tripLegs.length ? record.tripLegs.map(leg => `${leg.date || record.invoiceDate || C.dateUnknown} ${leg.origin || "?"}->${leg.destination || "?"}`).join("\uff1b") : "-";
  const issues = record.issues.length ? record.issues.map(issue => `<li class="${issue.level}">${escapeHtml(issue.message)}</li>`).join("") : `<li class="ok">${C.ok}</li>`;
  return `<article class="result-card">
    <div>
      <div class="result-head">
        <h3>${escapeHtml(record.fileName)}</h3>
        <button class="delete-record" type="button" data-delete-index="${index}" aria-label="\u5220\u9664${escapeHtml(record.fileName)}">\u5220\u9664</button>
      </div>
      <div class="suggested-name">${escapeHtml(record.suggestedName)}</div>
      <div class="meta">
        <div><small>\u59d3\u540d</small>${escapeHtml(record.personName || "-")}</div>
        <div><small>\u5f00\u7968\u62ac\u5934</small>${escapeHtml(record.invoiceTitle || "-")}</div>
        <div><small>\u7c7b\u578b</small>${escapeHtml(record.category)} / ${escapeHtml(record.expenseType)}</div>
        <div><small>\u91d1\u989d</small>${formatAmount(record.amount)}</div>
        <div><small>\u9879\u76ee</small>${escapeHtml(record.itemName || "-")}</div>
        <div><small>\u65e5\u671f</small>${escapeHtml(record.invoiceDate || "-")}</div>
        <div><small>\u7968\u53f7</small>${escapeHtml(record.invoiceNumber || "-")}</div>
        <div><small>\u884c\u7a0b</small>${escapeHtml(trip)}</div>
      </div>
    </div>
    <ol class="issue-list">${issues}</ol>
  </article>`;
}

function buildTripSummary(items) {
  if (!items.length) return C.tripHint;
  const names = [...new Set(items.map(item => item.personName).filter(Boolean))];
  const nameText = names.length ? names.join("\u3001") : C.noName;
  const trips = [];
  for (const item of items) {
    for (const leg of item.tripLegs) {
      trips.push(`${leg.date || item.invoiceDate || C.dateUnknown} ${C.ride}${leg.transport || item.category}${C.from}${leg.origin || C.originUnknown}${C.to}${leg.destination || C.destinationUnknown}`);
    }
  }
  return trips.length ? `${nameText}\uff1a${trips.join("\uff1b")}\u3002` : `${nameText}\uff1a${C.noTrip}`;
}

function renderSummaryTable(items) {
  if (!items.length) {
    summaryTable.className = "summary-table empty";
    summaryTable.textContent = "\u6682\u65e0\u6c47\u603b\u6570\u636e\u3002";
    return;
  }
  summaryTable.className = "summary-table";
  const rows = items.map(record => {
    const tableRecord = buildTableRecord(record);
    return "<tr>" +
      "<td>" + escapeHtml(tableRecord.name) + "</td>" +
      "<td>" + escapeHtml(tableRecord.amount) + "</td>" +
      "<td>" + escapeHtml(tableRecord.title) + "</td>" +
      "<td>" + escapeHtml(tableRecord.type) + "</td>" +
      "<td>" + escapeHtml(tableRecord.date) + "</td>" +
      "<td>" + escapeHtml(tableRecord.trip) + "</td>" +
      "</tr>";
  }).join("");
  summaryTable.innerHTML = "<table>" +
    "<thead><tr><th>\u53d1\u7968\u540d\u79f0</th><th>\u53d1\u7968\u91d1\u989d</th><th>\u5f00\u7968\u62ac\u5934</th><th>\u53d1\u7968\u7c7b\u578b</th><th>\u65f6\u95f4</th><th>\u884c\u7a0b</th></tr></thead>" +
    "<tbody>" + rows + "</tbody>" +
    "</table>";
}

function buildTableRecord(record) {
  const itineraryOnly = isItineraryOnlyRecord(record);
  return {
    name: record.suggestedName || record.fileName || "-",
    amount: formatAmount(record.amount) + (itineraryOnly ? "\uff08\u4e0d\u8ba1\u5165\u5408\u8ba1\uff09" : ""),
    title: record.invoiceTitle || "-",
    type: record.category || C.unknown,
    date: getRecordDate(record),
    trip: formatTrip(record),
  };
}

function buildSummaryCsv(items) {
  const headers = ["\u53d1\u7968\u540d\u79f0", "\u53d1\u7968\u91d1\u989d", "\u5f00\u7968\u62ac\u5934", "\u53d1\u7968\u7c7b\u578b", "\u65f6\u95f4", "\u884c\u7a0b"];
  const rows = items.map(record => {
    const tableRecord = buildTableRecord(record);
    return [tableRecord.name, tableRecord.amount, tableRecord.title, tableRecord.type, tableRecord.date, tableRecord.trip];
  });
  return "\ufeff" + [headers, ...rows].map(row => row.map(escapeCsvCell).join(",")).join("\n");
}

function escapeCsvCell(value) {
  return "\"" + String(value ?? "").replace(/"/g, "" + "\"\"") + "\"";
}

function getRecordDate(record) {
  return record.invoiceDate || (record.tripLegs[0] && record.tripLegs[0].date) || "-";
}

function formatTrip(record) {
  if (!record.tripLegs.length) return "-";
  return record.tripLegs.map(leg => (leg.origin || "?") + "->" + (leg.destination || "?")).join("\uff1b");
}

function isItineraryOnlyRecord(record) {
  return isDidiTripTable(record.text || "");
}

function sumAmount(items) {
  return items.reduce((total, item) => total + (isItineraryOnlyRecord(item) ? 0 : item.amount || 0), 0);
}

function download(fileName, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

render();
