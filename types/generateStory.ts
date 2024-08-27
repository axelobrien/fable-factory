import { Timestamp } from 'firebase/firestore/lite'
import ReadingLevel from './readingLevel'

export type StoryInput = {
  prompt: string
  language: string
  readingLevel: ReadingLevel
  attachToUser: boolean
  delayImage: boolean
}

const defaultStoryInput: StoryInput = {
  language: 'es',
  prompt: '',
  readingLevel: 'A2',
  attachToUser: true,
  delayImage: false,
}

export { defaultStoryInput }


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
  createdAt: Timestamp
  visibility: 'public' | 'private'
  userId: string | null,
}
