import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Ranburg — Free EMI, SIP, GST calculators and online tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const mark = await readFile(join(process.cwd(), "public/apple-touch-icon.png"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0B1220",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32 }}>
          <img
            src={`data:image/png;base64,${mark.toString("base64")}`}
            width={88}
            height={88}
            alt=""
            style={{ borderRadius: 20 }}
          />
          <span style={{ fontSize: 48, fontWeight: 800, color: "white" }}>
            Ranburg<span style={{ color: "#2EE6C8" }}>.com</span>
          </span>
        </div>
        <p style={{ fontSize: 42, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.3, maxWidth: 920 }}>
          Free EMI, SIP, GST calculators, PDF tools, and more
        </p>
        <p style={{ fontSize: 24, color: "#94a3b8", marginTop: 20 }}>
          No signup · In-browser · Jaipur, India
        </p>
      </div>
    ),
    { ...size }
  );
}
