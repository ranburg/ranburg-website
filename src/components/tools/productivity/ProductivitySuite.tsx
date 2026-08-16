"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Plus, Square, Trash2 } from "lucide-react";
import FileDropzone from "@/components/tools/shared/FileDropzone";
import { downloadBlob } from "@/lib/imageProcessing";

export function ScreenRecorderTool() {
  const [recording, setRecording] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  const start = async () => {
    setError("");
    setUrl(null);
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: true,
      });
      streamRef.current = stream;
      chunksRef.current = [];
      const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";
      const rec = new MediaRecorder(stream, { mimeType: mime });
      rec.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
      };
      stream.getVideoTracks()[0]?.addEventListener("ended", () => rec.stop());
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Screen capture was blocked or cancelled.");
    }
  };

  const stop = () => {
    recorderRef.current?.stop();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-theme-muted">
        Choose a tab, window, or screen. The recording stays on this device — nothing is uploaded.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={start}
          disabled={recording}
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          Start recording
        </button>
        <button
          type="button"
          onClick={stop}
          disabled={!recording}
          className="inline-flex items-center gap-2 rounded-xl border border-theme-subtle px-5 py-2.5 text-sm font-semibold text-theme-heading disabled:opacity-50"
        >
          <Square className="h-3.5 w-3.5" />
          Stop
        </button>
      </div>
      {recording && <p className="text-sm font-medium text-accent">Recording…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {url && (
        <div className="space-y-3">
          <video src={url} controls className="w-full rounded-xl border border-theme-subtle" />
          <a
            href={url}
            download="ranburg-recording.webm"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Download className="h-4 w-4" /> Download WebM
          </a>
        </div>
      )}
    </div>
  );
}

interface Experience {
  id: string;
  role: string;
  company: string;
  dates: string;
  bullets: string;
}

export function ResumeBuilderTool() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("Priya Sharma");
  const [title, setTitle] = useState("Product Analyst");
  const [email, setEmail] = useState("priya@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [location, setLocation] = useState("Jaipur, India");
  const [summary, setSummary] = useState(
    "Analyst who turns messy data into decisions. Comfortable with SQL, dashboards, and stakeholder workshops."
  );
  const [skills, setSkills] = useState("SQL, Excel, Looker, stakeholder communication");
  const [education, setEducation] = useState("B.Com, University of Rajasthan — 2018");
  const [experience, setExperience] = useState<Experience[]>([
    {
      id: "1",
      role: "Product Analyst",
      company: "Example Co",
      dates: "2022 — Present",
      bullets: "Built weekly KPI pack for leadership\nCut reporting time by 40% with automated SQL",
    },
  ]);

  const addExp = () =>
    setExperience((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "", company: "", dates: "", bullets: "" },
    ]);

  const printResume = () => {
    const el = previewRef.current;
    if (!el) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      `<html><head><title>${name} — Resume</title><style>
        body{font-family:Georgia,serif;color:#111;padding:40px;max-width:720px;margin:0 auto}
        h1{margin:0;font-size:28px} .meta{color:#555;font-size:13px;margin:6px 0 16px}
        h2{font-size:14px;letter-spacing:.08em;text-transform:uppercase;border-bottom:1px solid #ddd;padding-bottom:4px}
        h3{margin:0} .job{margin:12px 0} ul{margin:6px 0 0 18px}
      </style></head><body>${el.innerHTML}</body></html>`
    );
    win.document.close();
    win.focus();
    win.print();
  };

  const downloadPdf = async () => {
    const el = previewRef.current;
    if (!el) return;
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff" });
    const pdf = new jsPDF("p", "mm", "a4");
    const w = 210;
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, w, h);
    pdf.save(`${name.replace(/\s+/g, "-").toLowerCase()}-resume.pdf`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-3">
        <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Full name" />
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Headline" />
        <div className="grid gap-3 sm:grid-cols-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="Email" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" placeholder="Phone" />
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="input-field" placeholder="Location" />
        </div>
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="input-field" placeholder="Summary" />
        <input value={skills} onChange={(e) => setSkills(e.target.value)} className="input-field" placeholder="Skills (comma separated)" />
        <input value={education} onChange={(e) => setEducation(e.target.value)} className="input-field" placeholder="Education" />
        {experience.map((job, i) => (
          <div key={job.id} className="glass-card space-y-2 p-4">
            <div className="flex justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-theme-subtle">Role {i + 1}</p>
              <button type="button" onClick={() => setExperience((p) => p.filter((x) => x.id !== job.id))} aria-label="Remove role">
                <Trash2 className="h-4 w-4 text-theme-subtle" />
              </button>
            </div>
            <input
              value={job.role}
              onChange={(e) =>
                setExperience((p) => p.map((x) => (x.id === job.id ? { ...x, role: e.target.value } : x)))
              }
              className="input-field"
              placeholder="Role"
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                value={job.company}
                onChange={(e) =>
                  setExperience((p) => p.map((x) => (x.id === job.id ? { ...x, company: e.target.value } : x)))
                }
                className="input-field"
                placeholder="Company"
              />
              <input
                value={job.dates}
                onChange={(e) =>
                  setExperience((p) => p.map((x) => (x.id === job.id ? { ...x, dates: e.target.value } : x)))
                }
                className="input-field"
                placeholder="Dates"
              />
            </div>
            <textarea
              value={job.bullets}
              onChange={(e) =>
                setExperience((p) => p.map((x) => (x.id === job.id ? { ...x, bullets: e.target.value } : x)))
              }
              rows={3}
              className="input-field"
              placeholder="One achievement per line"
            />
          </div>
        ))}
        <button type="button" onClick={addExp} className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
          <Plus className="h-4 w-4" /> Add role
        </button>
        <div className="flex flex-wrap gap-2 pt-2">
          <button type="button" onClick={printResume} className="rounded-xl border border-theme-subtle px-4 py-2 text-sm font-semibold">
            Print
          </button>
          <button type="button" onClick={downloadPdf} className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
            <Download className="h-4 w-4" /> Download PDF
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-theme-subtle bg-white p-8 text-slate-900 shadow-sm">
        <div ref={previewRef} className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{name}</h2>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="mt-1 text-xs text-slate-500">
              {email} · {phone} · {location}
            </p>
          </div>
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Summary</h3>
            <p className="mt-1 text-sm leading-relaxed">{summary}</p>
          </section>
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Experience</h3>
            {experience.map((job) => (
              <div key={job.id} className="mt-3">
                <p className="text-sm font-semibold">
                  {job.role} — {job.company}
                </p>
                <p className="text-xs text-slate-500">{job.dates}</p>
                <ul className="mt-1 list-disc pl-5 text-sm">
                  {job.bullets
                    .split("\n")
                    .filter(Boolean)
                    .map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                </ul>
              </div>
            ))}
          </section>
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Skills</h3>
            <p className="mt-1 text-sm">{skills}</p>
          </section>
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Education</h3>
            <p className="mt-1 text-sm">{education}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export function PdfSignerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("Authorized Signatory");
  const [allPages, setAllPages] = useState(false);
  const [status, setStatus] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  const clearPad = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
  };

  useEffect(() => {
    clearPad();
  }, []);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height };
  };

  const sign = async () => {
    if (!file) {
      setStatus("Upload a PDF first.");
      return;
    }
    setStatus("Signing…");
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const canvas = canvasRef.current;
      let pngBytes: ArrayBuffer | null = null;
        if (canvas) {
          pngBytes = await new Promise<ArrayBuffer | null>((res) => {
            canvas.toBlob((b) => {
              if (!b) {
                res(null);
                return;
              }
              void b.arrayBuffer().then(res);
            }, "image/png");
          });
        }
      const pages = allPages ? pdf.getPages() : [pdf.getPages()[pdf.getPageCount() - 1]];
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      for (const page of pages) {
        const { width } = page.getSize();
        if (pngBytes) {
          const img = await pdf.embedPng(pngBytes);
          page.drawImage(img, { x: width - 180, y: 36, width: 140, height: 48 });
        }
        page.drawText(name, { x: width - 180, y: 28, size: 8, font, color: rgb(0.2, 0.2, 0.2) });
      }
      const bytes = await pdf.save();
      downloadBlob(new Blob([Uint8Array.from(bytes)], { type: "application/pdf" }), "signed.pdf");
      setStatus("Signed PDF downloaded.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Could not sign PDF.");
    }
  };

  return (
    <div className="space-y-4">
      <FileDropzone accept="application/pdf,.pdf" onFiles={(f) => setFile(f[0] ?? null)} hint="PDF stays in your browser" />
      {file && <p className="text-sm text-theme-muted">{file.name}</p>}
      <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Typed name under signature" />
      <div>
        <p className="mb-2 text-sm font-medium text-theme-body">Draw signature (optional)</p>
        <canvas
          ref={canvasRef}
          width={560}
          height={160}
          className="w-full cursor-crosshair rounded-xl border border-theme-subtle bg-white"
          onPointerDown={(e) => {
            drawing.current = true;
            const ctx = canvasRef.current?.getContext("2d");
            if (!ctx) return;
            const p = pos(e);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.strokeStyle = "#111";
            ctx.lineWidth = 2.4;
            ctx.lineCap = "round";
          }}
          onPointerMove={(e) => {
            if (!drawing.current) return;
            const ctx = canvasRef.current?.getContext("2d");
            if (!ctx) return;
            const p = pos(e);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }}
          onPointerUp={() => {
            drawing.current = false;
          }}
        />
        <button type="button" onClick={clearPad} className="mt-2 text-xs font-semibold text-accent">
          Clear pad
        </button>
      </div>
      <label className="flex items-center gap-2 text-sm text-theme-muted">
        <input type="checkbox" checked={allPages} onChange={(e) => setAllPages(e.target.checked)} />
        Stamp every page (otherwise last page only)
      </label>
      <button type="button" onClick={sign} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white">
        Sign & download
      </button>
      {status && <p className="text-sm text-theme-muted">{status}</p>}
    </div>
  );
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function ColorBackgroundRemoverTool() {
  const [preview, setPreview] = useState<string | null>(null);
  const [hex, setHex] = useState("#00ff00");
  const [tolerance, setTolerance] = useState(48);
  const [status, setStatus] = useState("");
  const srcRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const apply = () => {
    const img = srcRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const key = hexToRgb(hex);
    const t2 = tolerance * tolerance;
    for (let i = 0; i < data.data.length; i += 4) {
      const dr = data.data[i] - key.r;
      const dg = data.data[i + 1] - key.g;
      const db = data.data[i + 2] - key.b;
      if (dr * dr + dg * dg + db * db <= t2) data.data[i + 3] = 0;
    }
    ctx.putImageData(data, 0, 0);
    setStatus("Background keyed. Download PNG when ready.");
  };

  useEffect(() => {
    if (preview) apply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview, hex, tolerance]);

  const onFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      srcRef.current = img;
      setPreview(url);
    };
    img.src = url;
  };

  const sample = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const p = ctx.getImageData(x, y, 1, 1).data;
    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    setHex(`#${toHex(p[0])}${toHex(p[1])}${toHex(p[2])}`);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => blob && downloadBlob(blob, "no-background.png"), "image/png");
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-theme-muted">
        Chroma-key a solid background (green screen, studio wall). Click the canvas to sample a color.
      </p>
      <FileDropzone accept="image/*" onFiles={(f) => f[0] && onFile(f[0])} hint="PNG, JPG, WebP" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-theme-muted">
          Key color
          <div className="mt-1 flex gap-2">
            <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="h-10 w-14 cursor-pointer rounded-lg" />
            <input value={hex} onChange={(e) => setHex(e.target.value)} className="input-field font-mono" />
          </div>
        </label>
        <label className="text-sm text-theme-muted">
          Tolerance ({tolerance})
          <input
            type="range"
            min={8}
            max={140}
            value={tolerance}
            onChange={(e) => setTolerance(Number(e.target.value))}
            className="mt-3 w-full"
          />
        </label>
      </div>
      {preview && (
        <canvas
          ref={canvasRef}
          onClick={sample}
          className="max-h-[28rem] w-full cursor-crosshair rounded-xl border border-theme-subtle bg-[linear-gradient(45deg,#ddd_25%,transparent_25%),linear-gradient(-45deg,#ddd_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ddd_75%),linear-gradient(-45deg,transparent_75%,#ddd_75%)] bg-[length:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0]"
        />
      )}
      <button type="button" onClick={download} disabled={!preview} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
        Download PNG
      </button>
      {status && <p className="text-sm text-theme-muted">{status}</p>}
    </div>
  );
}
