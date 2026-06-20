"use client";

import { useCallback, useState } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
  hint?: string;
  className?: string;
}

export default function FileDropzone({
  accept,
  multiple = false,
  onFiles,
  label = "Drop files here or click to upload",
  hint,
  className,
}: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list?.length) return;
      onFiles(Array.from(list));
    },
    [onFiles]
  );

  return (
    <div
      className={cn(
        "glass-card relative rounded-xl border-2 border-dashed p-8 text-center transition-colors",
        dragging ? "border-accent bg-accent/5" : "border-theme-subtle",
        className
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <Upload className="mx-auto h-8 w-8 text-theme-subtle" />
      <p className="mt-3 text-sm font-medium text-theme-heading">{label}</p>
      {hint && <p className="mt-1 text-xs text-theme-subtle">{hint}</p>}
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label="Upload file"
      />
    </div>
  );
}

export function FileList({
  files,
  onRemove,
}: {
  files: File[];
  onRemove: (index: number) => void;
}) {
  if (!files.length) return null;
  return (
    <ul className="space-y-2">
      {files.map((f, i) => (
        <li key={`${f.name}-${i}`} className="flex items-center justify-between rounded-lg bg-theme-surface px-3 py-2 text-sm">
          <span className="truncate text-theme-muted">{f.name}</span>
          <button type="button" onClick={() => onRemove(i)} className="text-theme-subtle hover:text-red-400" aria-label="Remove file">
            <X className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}
