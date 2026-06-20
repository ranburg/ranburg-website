import { NextResponse } from "next/server";

/** Lightweight analytics beacon — logs events for future server-side aggregation */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, slug, query } = body as { type?: string; slug?: string; query?: string };

    if (type === "tool_view" && slug) {
      // Future: persist to Vercel KV / database
      return NextResponse.json({ ok: true });
    }
    if (type === "search" && query) {
      return NextResponse.json({ ok: true });
    }
    if (type === "page_exit" && slug) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false }, { status: 400 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
