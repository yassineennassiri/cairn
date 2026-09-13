import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  let parsed: URL
  try {
    parsed = new URL(body.url)
  } catch {
    return NextResponse.json(
      { error: 'That does not look like a valid URL.' },
      { status: 400 }
    )
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return NextResponse.json(
      { error: 'Only http and https links can be saved.' },
      { status: 400 }
    )
  }

  // after the protocol check, before prisma.link.create
  let title: string | null = null

  try {
    const pageResponse = await fetch(parsed.href, {
      signal: AbortSignal.timeout(5000),
    })

    if (pageResponse.ok) {
      const html = await pageResponse.text()
      const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
      title = match ? match[1].trim() : null
    }
  } catch {
    // unreachable, refused, or timed out: title stays null
  }

  const link = await prisma.link.create({
    data: {
      url: parsed.href,
      title: title,
    },
  });

  return NextResponse.json(link, { status: 201 });
}

export async function GET() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc"},
    take: 100,
  });

  return NextResponse.json(links);
}
