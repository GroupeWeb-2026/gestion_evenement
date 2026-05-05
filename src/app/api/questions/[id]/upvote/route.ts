import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PUT /api/questions/[id]/upvote
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const question = await prisma.question.update({
      where: { id: params.id },
      data: {
        upvotes: { increment: 1 }
      }
    })
    return NextResponse.json(question)
  } catch (error) {
    console.error("Erreur PUT /api/questions/[id]/upvote:", error)
    return NextResponse.json({ error: "Erreur lors de l'upvote" }, { status: 500 })
  }
}