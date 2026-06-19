import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ranburg LLP — Salesforce Consulting & Development";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "linear-gradient(135deg, #3b82f6, #10b981)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              color: "white",
              fontWeight: 800,
            }}
          >
            R
          </div>
          <span style={{ fontSize: 48, fontWeight: 800, color: "white" }}>
            Ranburg<span style={{ color: "#3b82f6" }}>.com</span>
          </span>
        </div>
        <p style={{ fontSize: 42, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.3, maxWidth: 900 }}>
          Salesforce Consulting & Development
        </p>
        <p style={{ fontSize: 24, color: "#94a3b8", marginTop: 20 }}>
          OmniStudio · Revenue Cloud · Industries · LWC · Jaipur, India
        </p>
      </div>
    ),
    { ...size }
  );
}
