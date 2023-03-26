import { httpsCallable } from 'firebase/functions'
import React, { useState } from 'react'
import StoryText from '../components/StoryText'
import { functions } from '../shared/firebaseConfig'
import styles from '../styles/create-story.module.scss'
import { StoryInput, StoryOutput } from '../types/generateStory'

enum StoryLoadingState {
  Idle,
  Loading,
  Loaded,
  Error,
}

function CreateStory() {
  const [storyInput, setStoryInput] = useState<StoryInput>({language: 'es', prompt: '', readingLevel: 'A2'})
  const [story, setStory] = useState<StoryOutput>()
  const [storyLoadingState, setStoryLoadingState] = useState<StoryLoadingState>(StoryLoadingState.Idle)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log('aaa')
    
    if (storyLoadingState !== StoryLoadingState.Idle && storyLoadingState !== StoryLoadingState.Error)
      return
    if (!(storyInput && storyInput.prompt.length > 10 && storyInput.prompt.length < 300)) {
      return
    }
    const generateStory = httpsCallable<StoryInput, StoryOutput>(functions, 'generateStory')
    setStoryLoadingState(StoryLoadingState.Loading)
    const response = (await generateStory(storyInput)).data // generateStory's return type is an object with only 1 key, data
    console.log(response)

    if (response.status === 'success') {
      setStoryLoadingState(StoryLoadingState.Idle)
      setStory(response)
    } else {
      setStoryLoadingState(StoryLoadingState.Error)
    }
  }

  async function handleChange(e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>, key: keyof StoryInput) {
    e.preventDefault()
    const { value } = e.target
    setStoryInput({ ...storyInput, [key]: value })
  }

  return (<>
    <main className={styles.container}>
        <h1 className={styles.logo}>
          Fable Factory
        </h1>

        <h2 className={styles.subtitle}>
          Fables for language learners at all levels
        </h2>

      <form
        className={styles.form}
        onSubmit={e => handleSubmit(e)}
      >
        <textarea
          className={styles.textarea}
          rows={5}
          maxLength={300}
          onChange={e => handleChange(e, 'prompt' as keyof StoryInput)}
        />

        <span className={styles.dropdownContainer}>
          <button
            className={styles.button}
            type='submit'
          >
            Tell the tale
          </button>

          <select
            className={styles.dropdown}
            defaultValue='es'
            onChange={e => handleChange(e, 'language' as keyof StoryInput)}
          >
            <option value='es'>Español</option>
            <option value='eo'>Esperanto</option>
          </select>

          <select
            className={styles.dropdown}
            defaultValue='A2'
            onChange={e => handleChange(e, 'readingLevel' as keyof StoryInput)}
          >
            <option value='A1'>First Words (A1)</option>
            <option value='A2'>Beginner (A2)</option>
            <option value='B1'>Pre-intermediate (B1)</option>
            <option value='B2'>Intermediate (B2)</option>
            <option value='C1'>Advanced (C1)</option>
            <option value='C2'>Highly Advanced (C2)</option>
          </select>
        </span>

      </form>

      <h2 className={styles.subtitle}>
        {story?.title}
      </h2>

      <StoryText
        rawText={story?.story ?? ''}
        key={story?.title}
      />
    </main>
  </>)
}

export default CreateStory