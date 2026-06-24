import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sessions = await prisma.session.findMany({
    include: { room: true, event: true }
  });
  return NextResponse.json(sessions);
}