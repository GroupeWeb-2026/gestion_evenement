"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { toast } from "sonner"

export function QuestionForm({ sessionId, onQuestionPosted }: { sessionId: string, onQuestionPosted: () => void }) {
  const [content, setContent] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      toast.error("Veuillez écrire une question")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          authorName: authorName.trim() || undefined,
          sessionId
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Erreur")
      }

      toast.success("Question posée avec succès !")
      setContent("")
      setAuthorName("")
      onQuestionPosted()
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'envoi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Posez votre question..."
        rows={3}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        disabled={loading}
      />
      <div className="flex gap-3">
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Votre nom (optionnel)"
          className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          {loading ? "Envoi..." : "Envoyer"}
        </button>
      </div>
    </form>
  )
}