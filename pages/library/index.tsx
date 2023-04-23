import { httpsCallable } from 'firebase/functions'
import React, { useEffect, useState } from 'react'
import { db, functions } from '../../shared/firebaseConfig'
import styles from '../../styles/bookshelf.module.scss'
import { StoryInput, StoryOutput } from '../../types/generateStory'
import StoryThumbnail from '../../components/StoryThumbnail'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { CollectionReference, collection, limit, orderBy, query } from 'firebase/firestore'

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
  const [fables, fablesLoading, fablesLoadingError] = useCollectionData<StoryOutput>(query<StoryOutput>(collection(db, 'fables/visibility/public') as CollectionReference<StoryOutput>, orderBy('createdAt', 'desc'), limit(12)))
  // const [fables, setFables] = useState<StoryOutput[]>([])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    if (storyLoadingState !== StoryLoadingState.Idle && storyLoadingState !== StoryLoadingState.Error)
    return
    if (!(storyInput && storyInput.prompt.length > 10 && storyInput.prompt.length < 300)) {
      return
    }

    const generateStory = httpsCallable<StoryInput, StoryOutput>(functions, 'generateStory')
    setStoryLoadingState(StoryLoadingState.Loading)
    console.log('Generating Story...')
    const response = (await generateStory(storyInput)).data // generateStory's return type is an object with only 1 key, data
    console.log(response)

    if (response.status === 'success') {
      setStoryLoadingState(StoryLoadingState.Idle)
      setStory(response)
    } else {
      setStoryLoadingState(StoryLoadingState.Error)
    }
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>, key: keyof StoryInput) {
    e.preventDefault()
    const { value } = e.target
    setStoryInput({ ...storyInput, [key]: value })
  }

  return (<>
    <main className={styles.container}>
        <h1 className={styles.header}>
          Explore the Bookshelf
        </h1>

      {/* <form
        className={styles.form}
        onSubmit={e => handleSubmit(e)}
      >
        <span className={styles.dropdownContainer}>
          <select
            className={styles.dropdown}
            defaultValue='Español'
            onChange={e => handleChange(e, 'language' as keyof StoryInput)}
          >
            <option value='Deutsch'>Deutsch</option>
            <option value='English'>English</option>
            <option value='Español'>Español</option>
            <option value='Esperanto'>Esperanto</option>
            <option value='Français'>Français</option>
            <option value='Italiano'>Italiano</option>
            <option value='Русский'>Русский</option>
            <option value='한국어'>한국어</option>
            <option value='日本語'>日本語</option>
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

        <input
          type='text'
          className={styles.textarea}
          placeholder='A dragon and duck become friends after the dragon initially tries to eat the duck'
          maxLength={100}
          onChange={e => handleChange(e, 'prompt' as keyof StoryInput)}
        />


        <button
          className={styles.button}
          type='submit'
        >
          {storyLoadingState !== StoryLoadingState.Loading ? 'Tell the tale' : 'Loading...'}
        </button>

      </form> */}

      <div className={styles.stories}>
        {fables && fables.map((fable) => <>
          <StoryThumbnail
            key={fable.id}
            title={fable.title}
            image={fable.coverImage}
            id={fable.id}
          />
        </>)}
      </div>

    </main>
  </>)
}

export default CreateStory