export interface Question {
  id: string
  content: string
  authorName: string | null
  upvotes: number
  sessionId: string
  createdAt: Date
}

export interface CreateQuestionInput {
  content: string
  authorName?: string
  sessionId: string
}