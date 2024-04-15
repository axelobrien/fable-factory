import { httpsCallable } from 'firebase/functions'
import React, { useEffect, useState } from 'react'
import { functions } from '../shared/firebaseConfig'
import styles from '../styles/create-fable.module.scss'
import shared from '../styles/shared.module.scss'
import { StoryEditInput, StoryInput, StoryOutput } from '../types/generateStory'
import Head from 'next/head'
import FableViewer from '../components/FableViewer'
import uniqueItemFromList from '../shared/uniqueItemFromList'
import languageList from '../shared/languageList'

enum StoryLoadingState {
  Idle,
  Loading,
  Loaded,
  Error,
}

const loadingScreenTextList = [
  'Generating your fable...',
  'Polishing your story...',
  'Warming up the printing press...',
  'Getting the ink and paper ready...',
  'Did you know? You can click any page to translate it into your native language!',
]

function CreateStory() {
  const [storyInput, setStoryInput] = useState<StoryInput>({ language: 'es', prompt: '', readingLevel: 'A2' })
  const [story, setStory] = useState<StoryOutput>()
  const [storyLoadingState, setStoryLoadingState] = useState<StoryLoadingState>(StoryLoadingState.Idle)
  const [storyLoadingText, setStoryLoadingText] = useState<string>(uniqueItemFromList(loadingScreenTextList))
  const [editMode, setEditMode] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    if (storyLoadingState !== StoryLoadingState.Idle && storyLoadingState !== StoryLoadingState.Error)
      return
    
    if (!(storyInput && storyInput.prompt.length > 10 && storyInput.prompt.length < 300)) 
      return

    let response: StoryOutput

    if (editMode && story) {
      const editStory = httpsCallable<StoryEditInput, StoryOutput>(functions, 'editStory')
      setStoryLoadingState(StoryLoadingState.Loading)
      response = (await editStory({...storyInput, currentStory: story})).data // editStory's return type is an object with only 1 key, data
    } else {
      const generateStory = httpsCallable<StoryInput, StoryOutput>(functions, 'generateStory')
      setStoryLoadingState(StoryLoadingState.Loading)
      response = (await generateStory(storyInput)).data // generateStory's return type is an object with only 1 key, data
    }

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

  useEffect(() => {
    if (storyLoadingState === StoryLoadingState.Loading) {
      const timer = setTimeout(() => {
        setStoryLoadingText(uniqueItemFromList(loadingScreenTextList,storyLoadingText))
      }, 3500)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [storyLoadingText, storyLoadingState])

  return (<>
    <Head>
      <title>{story?.title ?? 'New Fable'}</title>
    </Head>

    <div className={shared.backgroundCircles} />
    <div className={`${styles.background} ${styles.backgroundContainer}`}></div>

    <section className={`${styles.background}`}>
      <div className={styles.background}>
        <img
          src='https://cdn.pixabay.com/animation/2023/05/06/14/26/14-26-54-417_512.gif'
          className={styles.cogsRight}
        />
      </div>

      <div className={styles.background}>
        <img
          src='https://cdn.pixabay.com/animation/2023/05/06/14/26/14-26-54-417_512.gif'
          className={styles.cogsLeft}
        />
      </div>
    </section>

    <main className={styles.container}>
        <h1 className={styles.logo}>
          Fable Factory
        </h1>

      {storyLoadingState !== StoryLoadingState.Loading ? <>
        <h2 className={styles.subtitle}>
          {editMode === false ? 'Enter your fable idea' : 'Type what changes you want to your story in the box below'}
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
            <div>
              <h3 className={styles.dropdownLabel}>
                Create Fable
              </h3>
              <button
                className={styles.button}
                type='submit'
              >
                {/* {editMode === false ? 'Tell the tale' : 'Tell the tale'} */}
                Tell the tale
                {/* {storyLoadingState !== StoryLoadingState.Loading ? 'Tell the tale' : 'Loading...'} */}
              </button>
            </div>
            
            {(storyLoadingState === StoryLoadingState.Idle && story) && <>
              <div>
                <h3 className={styles.dropdownLabel}>
                  Editing mode
                </h3>
                <button onClick={() => setEditMode((editMode) => !editMode)} className={styles.button} type='button'>
                  {editMode === false ? 'Enter Edit Mode' : 'Exit Edit Mode'}
                </button>
              </div>
            </>}
            <div>
              <h3 className={styles.dropdownLabel}>
                Language
              </h3>
            
              <select
                className={styles.dropdown}

                onChange={e => handleChange(e, 'language' as keyof StoryInput)}
              >
                <option value='es'>Español</option>
                <option value='en'>English</option>
                <option value='eo'>Esperanto</option>
                <option value='fr'>Français</option>
                <option value='de'>Deutsch</option>
                <option value='it'>Italiano</option>
                <option value='ru'>Русский</option>
                <option value='ko'>한국어</option>
                <option value='ja'>日本語</option>
                <option value='hi'>हिंदी</option>
                {
                  languageList?.map((v) => <>
                    <option value={v[1]}>{v[0]}</option>
                  </>)
                }
              </select>
            </div>

            <div>
              <h3 className={styles.dropdownLabel}>
                Reading Level
              </h3>
              <select
                className={styles.dropdown}
                defaultValue='A2'
                onChange={e => handleChange(e, 'readingLevel' as keyof StoryInput)}
              >
                <option value='A1'>Beginner</option>
                {/* <option value='A2'>Beginner (A2)</option> */}
                {/* <option value='B1'>Pre-intermediate (B1)</option> */}
                <option value='B2'>Intermediate</option>
                <option value='C2'>Advanced</option>
                {/* <option value='C2'>Highly Advanced (C2)</option> */}
              </select>
            </div>
          </span>
        </form>
      </>
        : <></>}

      {storyLoadingState === StoryLoadingState.Loading && (<>
        <div className={styles.loading}>
          <h1 className={styles.loadingText}>
            {storyLoadingText}
          </h1>

          <video
            className={styles.loadingVideo}
            src='/videos/loading dark.mp4'
            autoPlay
            loop
            muted
            playsInline
            controls={false}                      
          />
        </div>
      </>)}

      {story?.story && (<>
        <h2 className={styles.subtitle}>
          {story?.title}
        </h2>

        <img
          className={styles.image}
          src={story?.coverImage}
        />

        <FableViewer
          story={story}
          rawText={story?.story ??
            'Había un pato con unos zapatos muy chéveres que todos los animales de la granja querían tener. Los zapatos eran verde limón y hacían que sus pies parecieran una tormenta. Pero un día un halcón malvado los robó todos los zapatos y los escondió en su nido en las montañas. El pato estaba muy triste sin sus zapatos y se preguntaba cómo podría recuperarlos. Pero pronto se dio cuenta de que podía lograrlo con la ayuda de sus amigos. Fue a ver al caballo, a la vaca y a la oveja y les pidió ayuda. Juntos, el caballo, la vaca y la oveja planearon cómo podrían rescatar los zapatos. Idearon un plan astuto para engañar al halcón y hacer que devolviera los zapatos al pato. Finalmente, llegó el día del gran rescate. El pato, el caballo, la vaca y la oveja fueron a la montaña donde estaba el halcón y, después de un gran lucha, lograron recuperar los zapatos del pato. Todos estaban felices y se sintieron como verdaderos héroes. El pato aprendió que el valor de la amistad y el amor pudo hacer cualquier cosa posible. A partir de ese momento, compartió sus zapatos con los demás animales sin ningún problema.'}
        />
      </>)}
    </main>
  </>)
}

export default CreateStory