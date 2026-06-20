export interface ImageFormatConfig {
  outputMime: "image/png" | "image/jpeg" | "image/webp";
  outputExt: string;
  accept: string;
  quality?: number;
  label: string;
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function drawToCanvas(
  img: HTMLImageElement,
  width: number,
  height: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export failed"))),
      mime,
      quality
    );
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const IMAGE_FORMAT_CONFIGS: Record<string, ImageFormatConfig> = {
  "jpg-to-png": { outputMime: "image/png", outputExt: "png", accept: "image/jpeg,.jpg,.jpeg", label: "JPG" },
  "png-to-jpg": { outputMime: "image/jpeg", outputExt: "jpg", accept: "image/png,.png", quality: 0.92, label: "PNG" },
  "webp-to-png": { outputMime: "image/png", outputExt: "png", accept: "image/webp,.webp", label: "WebP" },
  "png-to-webp": { outputMime: "image/webp", outputExt: "webp", accept: "image/png,.png", quality: 0.85, label: "PNG" },
};
