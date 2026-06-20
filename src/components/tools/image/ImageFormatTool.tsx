"use client";

import { useRef, useState } from "react";
import { Download } from "lucide-react";
import FileDropzone from "@/components/tools/shared/FileDropzone";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import {
  type ImageFormatConfig,
  loadImageFromFile,
  drawToCanvas,
  canvasToBlob,
  downloadBlob,
  formatBytes,
} from "@/lib/imageProcessing";

interface ImageFormatToolProps {
  config: ImageFormatConfig;
}

export default function ImageFormatTool({ config }: ImageFormatToolProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [outputSize, setOutputSize] = useState(0);
  const [quality, setQuality] = useState(Math.round((config.quality ?? 0.92) * 100));
  const [loading, setLoading] = useState(false);
  const blobRef = useRef<Blob | null>(null);
  const fileNameRef = useRef("converted");

  const convert = async (file: File) => {
    setLoading(true);
    setOriginalSize(file.size);
    fileNameRef.current = file.name.replace(/\.[^.]+$/, "");
    try {
      const img = await loadImageFromFile(file);
      const canvas = drawToCanvas(img, img.width, img.height);
      const q = config.outputMime === "image/png" ? undefined : quality / 100;
      const blob = await canvasToBlob(canvas, config.outputMime, q);
      blobRef.current = blob;
      setOutputSize(blob.size);
      setPreview(URL.createObjectURL(blob));
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!blobRef.current) return;
    downloadBlob(blobRef.current, `${fileNameRef.current}.${config.outputExt}`);
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        accept={config.accept}
        onFiles={(files) => files[0] && convert(files[0])}
        hint={`Upload ${config.label} — processed locally in your browser`}
      />

      {config.outputMime !== "image/png" && (
        <AdvancedOptions>
          <CalculatorSlider label="Quality" value={quality} min={10} max={100} step={5} unit="%" onChange={setQuality} />
        </AdvancedOptions>
      )}

      {loading && <p className="text-sm text-theme-muted">Converting…</p>}

      {preview && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card p-6">
            <p className="mb-3 text-sm font-medium text-theme-body">Preview</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Converted" className="max-h-72 rounded-lg object-contain" />
            {originalSize > 0 && (
              <p className="mt-3 text-xs text-theme-subtle">
                {formatBytes(originalSize)} → {formatBytes(outputSize)}
              </p>
            )}
          </div>
          <div className="glass-card flex flex-col items-center justify-center p-6">
            <button
              type="button"
              onClick={download}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90"
            >
              <Download className="h-4 w-4" />
              Download {config.outputExt.toUpperCase()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
