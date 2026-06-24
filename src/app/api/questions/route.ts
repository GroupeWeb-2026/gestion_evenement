import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createQuestionSchema = z.object({
  content: z.string().min(1).max(500),
  authorName: z.string().optional(),
  sessionId: z.string(),
})

// POST /api/questions - Poser une question (public)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = createQuestionSchema.parse(body)

    // Vérifier que la session existe et est en cours (live)
    const session = await prisma.session.findUnique({
      where: { id: validated.sessionId },
      select: { startTime: true, endTime: true }
    })

    if (!session) {
      return NextResponse.json({ error: "Session non trouvée" }, { status: 404 })
    }

    const now = new Date()
    const isLive = now >= session.startTime && now <= session.endTime

    if (!isLive) {
      return NextResponse.json({ error: "Les questions ne sont autorisées que pendant la session (live)" }, { status: 403 })
    }

    const question = await prisma.question.create({
      data: {
        content: validated.content,
        authorName: validated.authorName || null,
        sessionId: validated.sessionId,
      }
    })

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Erreur POST /api/questions:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}