import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { increment } = await request.json();
    
    // Vérifier que increment est valide (1 ou -1)
    if (increment !== 1 && increment !== -1) {
      return NextResponse.json({ error: "Valeur invalide" }, { status: 400 });
    }
    
    const event = await prisma.event.update({
      where: { id },
      data: {
        likes: { increment: increment }
      }
    });
    
    return NextResponse.json({ likes: event.likes });
  } catch (error) {
    console.error("Erreur like:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}