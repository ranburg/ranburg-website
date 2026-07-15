"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import FileDropzone, { FileList } from "@/components/tools/shared/FileDropzone";
import { BeforeAfterBar } from "@/components/tools/viz";
import { downloadBlob } from "@/lib/imageProcessing";

async function loadPdfLib() {
  return import("pdf-lib");
}

export function PdfMergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const merge = async () => {
    if (files.length < 2) {
      setStatus("Upload at least 2 PDF files.");
      return;
    }
    setLoading(true);
    try {
      const { PDFDocument } = await loadPdfLib();
      const out = await PDFDocument.create();
      for (const file of files) {
        const doc = await PDFDocument.load(await file.arrayBuffer());
        const pages = await out.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const bytes = await out.save();
      downloadBlob(new Blob([Uint8Array.from(bytes)], { type: "application/pdf" }), "merged.pdf");
      setStatus("Merged successfully.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Merge failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PdfToolShell files={files} setFiles={setFiles} onRun={merge} loading={loading} status={status} label="Merge PDFs" multiple />
  );
}

export function PdfSplitTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const split = async () => {
    if (!files[0]) return;
    setLoading(true);
    try {
      const { PDFDocument } = await loadPdfLib();
      const src = await PDFDocument.load(await files[0].arrayBuffer());
      const count = src.getPageCount();
      for (let i = 0; i < count; i++) {
        const out = await PDFDocument.create();
        const [page] = await out.copyPages(src, [i]);
        out.addPage(page);
        const bytes = await out.save();
        downloadBlob(new Blob([Uint8Array.from(bytes)], { type: "application/pdf" }), `page-${i + 1}.pdf`);
      }
      setStatus(`Split into ${count} files.`);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Split failed.");
    } finally {
      setLoading(false);
    }
  };

  return <PdfToolShell files={files} setFiles={setFiles} onRun={split} loading={loading} status={status} label="Split PDF" />;
}

export function PdfCompressorTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [sizes, setSizes] = useState<{ before: number; after: number } | null>(null);

  const compress = async () => {
    if (!files[0]) return;
    setLoading(true);
    setSizes(null);
    try {
      const { PDFDocument } = await loadPdfLib();
      const before = files[0].size;
      const doc = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      const bytes = await doc.save({ useObjectStreams: true, addDefaultPage: false });
      const after = bytes.length;
      setSizes({ before, after });
      downloadBlob(new Blob([Uint8Array.from(bytes)], { type: "application/pdf" }), "optimized.pdf");
      const saved = before > 0 ? (((before - after) / before) * 100).toFixed(0) : "0";
      setStatus(
        Number(saved) > 1
          ? `Repacked PDF — about ${saved}% smaller. Heavy image PDFs may need image compression separately.`
          : `Repacked PDF (structure optimized). File size may stay similar when content is already compressed — try Image Compressor for photo-heavy PDFs.`
      );
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Compression failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PdfToolShell files={files} setFiles={setFiles} onRun={compress} loading={loading} status={status} label="Optimize PDF" />
      {sizes && <BeforeAfterBar before={sizes.before} after={sizes.after} beforeLabel="Original" afterLabel="Optimized" />}
      <p className="text-xs text-theme-subtle">
        This tool rewrites PDF object streams in your browser. It does not re-encode embedded photos — size savings vary.
      </p>
    </div>
  );
}

export function PdfPageExtractorTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [range, setRange] = useState("1");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const extract = async () => {
    if (!files[0]) return;
    setLoading(true);
    try {
      const { PDFDocument } = await loadPdfLib();
      const src = await PDFDocument.load(await files[0].arrayBuffer());
      const indices = parsePageRange(range, src.getPageCount());
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, indices);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      downloadBlob(new Blob([Uint8Array.from(bytes)], { type: "application/pdf" }), "extracted.pdf");
      setStatus("Pages extracted.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Extract failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PdfToolShell files={files} setFiles={setFiles} onRun={extract} loading={loading} status={status} label="Extract pages" hideButton />
      <input value={range} onChange={(e) => setRange(e.target.value)} placeholder="e.g. 1-3, 5" className="input-field" />
      <button type="button" onClick={extract} disabled={loading} className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Extract</button>
    </div>
  );
}

export function PdfPageRemoverTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [remove, setRemove] = useState("1");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!files[0]) return;
    setLoading(true);
    try {
      const { PDFDocument } = await loadPdfLib();
      const src = await PDFDocument.load(await files[0].arrayBuffer());
      const total = src.getPageCount();
      const removeSet = new Set(parsePageRange(remove, total));
      const keep = [...Array(total).keys()].filter((i) => !removeSet.has(i));
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, keep);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      downloadBlob(new Blob([Uint8Array.from(bytes)], { type: "application/pdf" }), "edited.pdf");
      setStatus("Pages removed.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PdfToolShell files={files} setFiles={setFiles} onRun={run} loading={loading} status={status} label="Remove pages" hideButton />
      <input value={remove} onChange={(e) => setRemove(e.target.value)} placeholder="Pages to remove: 2, 4-6" className="input-field" />
      <button type="button" onClick={run} disabled={loading} className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white">Remove & Download</button>
    </div>
  );
}

export function JpgToPdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const convert = async () => {
    if (!files.length) return;
    setLoading(true);
    try {
      const { PDFDocument } = await loadPdfLib();
      const pdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const isPng = file.type === "image/png";
        const img = isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        const page = pdf.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const out = await pdf.save();
      downloadBlob(new Blob([Uint8Array.from(out)], { type: "application/pdf" }), "images.pdf");
      setStatus("PDF created.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Conversion failed.");
    } finally {
      setLoading(false);
    }
  };

  return <PdfToolShell files={files} setFiles={setFiles} onRun={convert} loading={loading} status={status} label="Create PDF" multiple accept="image/jpeg,image/png,.jpg,.png" />;
}

export function WordToPdfTool() {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("Document");
  const [status, setStatus] = useState("");

  const onTxt = async (file: File) => {
    const content = await file.text();
    setText(content);
    if (!title || title === "Document") setTitle(file.name.replace(/\.[^.]+$/, ""));
  };

  const convert = async () => {
    if (!text.trim()) return;
    try {
      const { PDFDocument, StandardFonts, rgb } = await loadPdfLib();
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      const margin = 50;
      const lineHeight = fontSize * 1.4;
      const pageWidth = 595;
      const pageHeight = 842;
      const maxWidth = pageWidth - margin * 2;
      let page = pdf.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;
      page.drawText(title, { x: margin, y, size: 18, font, color: rgb(0, 0, 0) });
      y -= 36;
      const words = text.split(/\s+/);
      let line = "";
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(test, fontSize) > maxWidth) {
          page.drawText(line, { x: margin, y, size: fontSize, font });
          y -= lineHeight;
          line = word;
          if (y < margin) {
            page = pdf.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
          }
        } else line = test;
      }
      if (line) page.drawText(line, { x: margin, y, size: fontSize, font });
      const out = await pdf.save();
      downloadBlob(new Blob([Uint8Array.from(out)], { type: "application/pdf" }), "document.pdf");
      setStatus("PDF downloaded.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed.");
    }
  };

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-theme-muted">
        Creates a PDF from <strong className="text-theme-heading">plain text</strong> (paste or .txt). Does not parse .docx — paste from Word instead.
      </p>
      <FileDropzone accept=".txt,text/plain" onFiles={(f) => f[0] && onTxt(f[0])} hint="Optional .txt upload" />
      <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Document title" />
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={12} className="input-field" placeholder="Paste text from Word or any document…" />
      <button type="button" onClick={convert} className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white">
        Create PDF
      </button>
      {status && <p className="text-sm text-theme-muted">{status}</p>}
    </div>
  );
}

export function PdfToJpgTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const convert = async () => {
    if (!files[0]) return;
    setLoading(true);
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
      const data = await files[0].arrayBuffer();
      const pdf = await pdfjs.getDocument({ data }).promise;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not supported");
        await page.render({ canvasContext: ctx, viewport }).promise;
        canvas.toBlob((blob) => blob && downloadBlob(blob, `page-${i}.jpg`), "image/jpeg", 0.92);
      }
      setStatus(`Converted ${pdf.numPages} page(s).`);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Conversion failed. Try a smaller PDF.");
    } finally {
      setLoading(false);
    }
  };

  return <PdfToolShell files={files} setFiles={setFiles} onRun={convert} loading={loading} status={status} label="Convert to JPG" />;
}

function parsePageRange(spec: string, total: number): number[] {
  const pages = new Set<number>();
  for (const part of spec.split(",").map((s) => s.trim()).filter(Boolean)) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      for (let i = Math.max(1, a); i <= Math.min(total, b); i++) pages.add(i - 1);
    } else {
      const n = Number(part);
      if (n >= 1 && n <= total) pages.add(n - 1);
    }
  }
  return [...pages].sort((a, b) => a - b);
}

function PdfToolShell({
  files,
  setFiles,
  onRun,
  loading,
  status,
  label,
  multiple = false,
  accept = "application/pdf,.pdf",
  hideButton = false,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onRun: () => void;
  loading: boolean;
  status: string;
  label: string;
  multiple?: boolean;
  accept?: string;
  hideButton?: boolean;
}) {
  return (
    <div className="space-y-6">
      <FileDropzone
        accept={accept}
        multiple={multiple}
        onFiles={(f) => setFiles((prev) => (multiple ? [...prev, ...f] : f))}
        hint="Drag and drop — processed in your browser"
      />
      <FileList files={files} onRemove={(i) => setFiles((prev) => prev.filter((_, j) => j !== i))} />
      {!hideButton && (
        <button type="button" onClick={onRun} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
          <Download className="h-4 w-4" />{loading ? "Processing…" : label}
        </button>
      )}
      {status && <p className="text-sm text-theme-muted">{status}</p>}
    </div>
  );
}
