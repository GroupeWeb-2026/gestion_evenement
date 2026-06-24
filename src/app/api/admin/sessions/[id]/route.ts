import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    // Supprimer les associations SessionSpeaker
    await prisma.sessionSpeaker.deleteMany({
      where: { sessionId: id },
    });
    
    // Supprimer les questions liées
    await prisma.question.deleteMany({
      where: { sessionId: id },
    });
    
    // Supprimer la session
    await prisma.session.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}