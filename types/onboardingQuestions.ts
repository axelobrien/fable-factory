import { ReactElement } from "react"

export type Key = 'targetFrequency' | 'name' | 'notifications' | 'story'

type OnboardingQuestion = {
  question: string
  key: Key
  input: ReactElement
}

export default OnboardingQuestion