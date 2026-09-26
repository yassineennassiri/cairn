import { NextResponse, after } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// How long the background fetch waits for a website before giving up.
// Must stay well below the polling ceiling in app/page.tsx (30 s),
// otherwise a late title lands after the page has stopped asking.
const TITLE_FETCH_TIMEOUT_MS = 20_000;

// Runs after the response has been sent: fetch the page, then record the outcome.
async function fetchAndStoreTitle(linkId: number, url: string) {
  let title: string | null = null;

  try {
    const pageResponse = await fetch(url, {
      signal: AbortSignal.timeout(TITLE_FETCH_TIMEOUT_MS),
    });

    if (pageResponse.ok) {
      const html = await pageResponse.text();
      const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      title = match ? match[1].trim() : null;
    }
  } catch {
    // unreachable, refused, or timed out: title stays null
  }

  await prisma.link.updateMany({
    where: { id: linkId },
    data: {
      title: title,
      titleStatus: title ? "DONE" : "FAILED",
    },
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const body = await request.json();
  let parsed: URL;
  try {
    parsed = new URL(body.url);
  } catch {
    return NextResponse.json(
      { error: "That does not look like a valid URL." },
      { status: 400 }
    );
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return NextResponse.json(
      { error: "Only http and https links can be saved." },
      { status: 400 }
    );
  }

  const url = parsed.href;

  // Save now, with no title. titleStatus starts as PENDING by default.
  const link = await prisma.link.create({
    data: {
      url: url,
      userId: session.user.id,
    },
  });

  // Hand the slow work to after(): it runs once the 201 below has been sent.
  after(() => fetchAndStoreTitle(link.id, url));

  return NextResponse.json(link, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const links = await prisma.link.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(links);
}
