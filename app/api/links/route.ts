import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();

  const link = await prisma.link.create({
    data: {
      url: body.url,
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
