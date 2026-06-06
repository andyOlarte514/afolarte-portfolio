import { ImageResponse } from "next/og";

import { heroContent } from "@/lib/heroContent";

export const alt = `${heroContent.name} — ${heroContent.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image(): ImageResponse {
  const siteUrl = process.env["NEXT_PUBLIC_SITE_URL"] ?? "andyolarte.dev";

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "#09090b",
      }}
    >
      {/* Left indigo accent bar */}
      <div style={{ width: 8, backgroundColor: "#6366f1", flexShrink: 0 }} />
      {/* Content column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 64,
          paddingRight: 64,
          flex: 1,
        }}
      >
        <p
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {heroContent.name}
        </p>
        <p
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: "#a1a1aa",
            margin: 0,
            marginTop: 16,
            lineHeight: 1.3,
          }}
        >
          {heroContent.title}
        </p>
        <p
          style={{
            fontSize: 20,
            fontWeight: 400,
            color: "#6366f1",
            margin: 0,
            marginTop: 12,
            lineHeight: 1.5,
          }}
        >
          {siteUrl}
        </p>
      </div>
    </div>,
    size
  );
}
