import { canvasToBlob } from "@/lib/imageProcessing";

export type PdfCompressPreset = "high" | "balanced" | "small";

export const PDF_COMPRESS_PRESETS: Record<
  PdfCompressPreset,
  { dpi: number; quality: number; label: string; hint: string }
> = {
  high: {
    dpi: 144,
    quality: 0.72,
    label: "High quality",
    hint: "Sharper text, larger file",
  },
  balanced: {
    dpi: 110,
    quality: 0.52,
    label: "Balanced",
    hint: "Best for email and WhatsApp",
  },
  small: {
    dpi: 72,
    quality: 0.38,
    label: "Smallest",
    hint: "Maximum shrink, softer photos",
  },
};

const MAX_EDGE_PX = 2200;

let pdfjsLoader: Promise<typeof import("pdfjs-dist")> | null = null;

export async function loadPdfJs() {
  if (!pdfjsLoader) {
    pdfjsLoader = import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
      return pdfjs;
    });
  }
  return pdfjsLoader;
}

/**
 * Rebuild each page as a compressed JPEG. This is what actually shrinks
 * scanned / photo PDFs — rewriting object streams does not.
 */
export async function compressPdfWithJpegPages(
  data: ArrayBuffer,
  preset: PdfCompressPreset,
  onProgress?: (page: number, total: number) => void
): Promise<Uint8Array> {
  const { dpi, quality } = PDF_COMPRESS_PRESETS[preset];
  const pdfjs = await loadPdfJs();
  const { PDFDocument } = await import("pdf-lib");

  const source = new Uint8Array(data.slice(0));
  const src = await pdfjs.getDocument({ data: source }).promise;
  const out = await PDFDocument.create();
  const total = src.numPages;

  for (let i = 1; i <= total; i++) {
    onProgress?.(i, total);
    const page = await src.getPage(i);
    const base = page.getViewport({ scale: 1 });
    let scale = dpi / 72;
    const maxEdge = Math.max(base.width, base.height) * scale;
    if (maxEdge > MAX_EDGE_PX) scale = MAX_EDGE_PX / Math.max(base.width, base.height);

    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(viewport.width));
    canvas.height = Math.max(1, Math.round(viewport.height));
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Canvas is not supported in this browser.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;

    const blob = await canvasToBlob(canvas, "image/jpeg", quality);
    const jpg = new Uint8Array(await blob.arrayBuffer());
    const image = await out.embedJpg(jpg);
    const pageWidth = base.width;
    const pageHeight = base.height;
    const newPage = out.addPage([pageWidth, pageHeight]);
    newPage.drawImage(image, { x: 0, y: 0, width: pageWidth, height: pageHeight });

    canvas.width = 0;
    canvas.height = 0;
    page.cleanup();
  }

  await src.destroy();
  return out.save({ useObjectStreams: true, addDefaultPage: false });
}
