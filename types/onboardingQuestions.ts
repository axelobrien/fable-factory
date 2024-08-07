import { ReactElement } from "react"

export type Key = 'target_frequency' | 'name' | 'notifications' | 'story'

type OnboardingQuestion = {
  question: string
  key: Key
  input: ReactElement
}

export default OnboardingQuestion