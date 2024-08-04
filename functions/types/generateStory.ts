import { Timestamp } from 'firebase/firestore'
import ReadingLevel from './readingLevel'

export type StoryInput = {
  prompt: string
  language: string
  readingLevel: ReadingLevel
  removeImage?: boolean
}

export type StoryEditInput = {
  prompt: string
  language: string
  readingLevel: ReadingLevel
  currentStory: StoryOutput
}

export type StoryOutput = {
  story: string
  readingLevel: ReadingLevel
  language: string
  coverImage: string
  title: string
  status: 'success' | 'error'
  id: string
  visibility: 'public' | 'private'
  createdAt: Timestamp
}
