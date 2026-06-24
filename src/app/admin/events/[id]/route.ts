import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/admin/events/[id] - Supprimer un événement
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  
  try {
    await prisma.event.delete({ 
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Événement non trouvé" }, { status: 404 });
  }
}

// PUT /api/admin/events/[id] - Modifier un événement
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  
  try {
    const event = await prisma.event.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        dateStart: body.dateStart ? new Date(body.dateStart) : undefined,
        dateEnd: body.dateEnd ? new Date(body.dateEnd) : undefined,
      },
    });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: "Événement non trouvé" }, { status: 404 });
  }
}