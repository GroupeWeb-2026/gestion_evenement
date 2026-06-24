export interface Speaker {
  id: string
  fullName: string
  photo: string | null
  bio: string | null
  externalLinks: string | null
  sessions?: Session[]
}

export interface CreateSpeakerInput {
  fullName: string
  photo?: string
  bio?: string
  externalLinks?: string
}