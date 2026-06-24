"use client"

import { useState } from "react"
import { ThumbsUp } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

type Question = {
  id: string
  content: string
  authorName: string | null
  upvotes: number
  createdAt: string
}

export function QuestionList({ questions: initialQuestions, sessionId }: { questions: Question[], sessionId: string }) {
  const [questions, setQuestions] = useState(initialQuestions)

  const handleUpvote = async (questionId: string) => {
    try {
      const res = await fetch(`/api/questions/${questionId}/upvote`, { method: "PUT" })
      if (res.ok) {
        setQuestions(prev => prev.map(q => 
          q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q
        ))
      }
    } catch (error) {
      console.error("Erreur upvote:", error)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Questions ({questions.length})</h3>
      {questions.length === 0 && (
        <p className="text-gray-500 text-sm">Aucune question pour le moment. Soyez le premier à poser une question !</p>
      )}
      {questions
        .sort((a, b) => b.upvotes - a.upvotes)
        .map((q) => (
          <div key={q.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-gray-800">{q.content}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span>Par {q.authorName || "Anonyme"}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(q.createdAt), { addSuffix: true, locale: fr })}</span>
                </div>
              </div>
              <button
                onClick={() => handleUpvote(q.id)}
                className="flex items-center gap-1 px-2 py-1 rounded bg-white border text-sm hover:bg-gray-100 transition"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{q.upvotes}</span>
              </button>
            </div>
          </div>
        ))}
    </div>
  )
}