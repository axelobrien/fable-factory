import { httpsCallable } from 'firebase/functions'
import React, { useState } from 'react'
import StoryBook from '../components/StoryBook'
import StoryText from '../components/StoryText'
import { functions } from '../shared/firebaseConfig'
import styles from '../styles/create-story.module.scss'
import { StoryInput, StoryOutput } from '../types/generateStory'
import Head from 'next/head'

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

  async function handleChange(e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>, key: keyof StoryInput) {
    e.preventDefault()
    const { value } = e.target
    setStoryInput({ ...storyInput, [key]: value })
  }

  return (<>
    <Head>
      <title>{story?.title ?? 'New Fable'}</title>
    </Head>
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
          placeholder='A dragon and duck become friends after the dragon initially tries to eat the duck'
          rows={5}
          maxLength={300}
          onChange={e => handleChange(e, 'prompt' as keyof StoryInput)}
        />

        <span className={styles.dropdownContainer}>
          <button
            className={styles.button}
            type='submit'
          >
            {storyLoadingState !== StoryLoadingState.Loading ? 'Tell the tale' : 'Loading...'}
          </button>

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

      </form>

      <h2 className={styles.subtitle}>
        {story?.title}
      </h2>

      {story?.story && (
        <StoryBook
          rawText={story.story}
          // 'Había un pato con unos zapatos muy chéveres que todos los animales de la granja querían tener. Los zapatos eran verde limón y hacían que sus pies parecieran una tormenta. Pero un día un halcón malvado los robó todos los zapatos y los escondió en su nido en las montañas. El pato estaba muy triste sin sus zapatos y se preguntaba cómo podría recuperarlos. Pero pronto se dio cuenta de que podía lograrlo con la ayuda de sus amigos. Fue a ver al caballo, a la vaca y a la oveja y les pidió ayuda. Juntos, el caballo, la vaca y la oveja planearon cómo podrían rescatar los zapatos. Idearon un plan astuto para engañar al halcón y hacer que devolviera los zapatos al pato. Finalmente, llegó el día del gran rescate. El pato, el caballo, la vaca y la oveja fueron a la montaña donde estaba el halcón y, después de un gran lucha, lograron recuperar los zapatos del pato. Todos estaban felices y se sintieron como verdaderos héroes. El pato aprendió que el valor de la amistad y el amor pudo hacer cualquier cosa posible. A partir de ese momento, compartió sus zapatos con los demás animales sin ningún problema.'
        />
      )}
    </main>
  </>)
}

export default CreateStory