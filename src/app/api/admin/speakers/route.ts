import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const speakers = await prisma.speaker.findMany();
  return NextResponse.json(speakers);
}