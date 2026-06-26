import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rooms = await prisma.room.findMany({
    where: { isDeleted: false },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(rooms);
}

export async function POST(request: Request) {
  const { name } = await request.json();
  const room = await prisma.room.create({ data: { name } });
  return NextResponse.json(room);
}