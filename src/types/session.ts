export interface Session {
  id: string
  title: string
  description: string | null
  startTime: Date
  endTime: Date
  capacity: number | null
  eventId: string
  roomId: string
  speakers?: Speaker[]
  questions?: Question[]
}

export interface CreateSessionInput {
  title: string
  description?: string
  startTime: Date
  endTime: Date
  capacity?: number
  eventId: string
  roomId: string
  speakerIds: string[]
}