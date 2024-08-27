import React, { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'

import { httpsCallable } from 'firebase/functions'
import { User, getAdditionalUserInfo, getIdToken, isSignInWithEmailLink, onAuthStateChanged, signInWithEmailLink, signOut } from 'firebase/auth'
import { doc, DocumentSnapshot, getDoc, updateDoc } from 'firebase/firestore'

import Cookies from 'js-cookie'

import { auth, db, functions } from '../shared/firebaseConfig'

import { StoryInput, StoryOutput } from '../types/generateStory'
import OnboardingQuestion, { Key } from '../types/onboardingQuestions'
import { StoryLoadingState } from './create-fable'

import DefaultHeadTag from '../components/DefaultHeadTag'
import FableViewer from '../components/FableViewer'

import shared from '../styles/shared.module.scss'
import styles from '../styles/account.module.scss'

function Account() {
  const [userData, setUserData] = useState<User | null>(null)
  const [isNewUser, setIsNewUser] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<any>({})
  // const [currentKey, setCurrentKey] = useState<Key>('name')
  const [storyLoadingState, setStoryLoadingState] = useState<StoryLoadingState>(StoryLoadingState.Idle)
  const [story, setStory] = useState<StoryOutput | undefined>(undefined)

  function updateAnswers(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>, key: string) {
    e.preventDefault()
    const { value } = e.target
    setAnswers({ ...answers, [key]: value })
  }

  const questionBank: OnboardingQuestion[] = [
    {
      question: 'What is your name?',
      key: 'name',
      input:
        <input
          placeholder='Enter your name'
          type='text'
          required
          className={styles.input}
          onChange={(e) => {
            updateAnswers(e, 'name')
          }}
        />
    },
    {
      question: 'How often would you like to learn?',
      key: 'targetFrequency',
      input:
        <select
          defaultValue={'daily'}
          className={styles.dropdown}
          onChange={(e) => {
            updateAnswers(e, 'targetFrequency')
          }}
        >
          <option value='daily'>
            Once per day
          </option>
          <option value='weekly'>
            Once per week
          </option>
        </select>
    },
    {
      question: 'Can we send you notifications to help you with your goals?',
      key: 'notifications',
      input: <>
        <button
          onClick={() => {
            if (!("Notification" in window)) 
              return

            Notification.requestPermission().then((result) => {
              console.log(result)
            })
          }}
          className={styles.button}
        >
          Yes
        </button>

        <button
          type='submit'
          className={styles.button}
        >
          No
        </button>
      </>
    },
    {
      question: 'Here\'s your first story, made just for you!',
      key: 'story',
      input: <>
        {story ?
          <FableViewer
            story={story}
            rawText={story?.story ??
              'Había un pato con unos zapatos muy chéveres que todos los animales de la granja querían tener. Los zapatos eran verde limón y hacían que sus pies parecieran una tormenta. Pero un día un halcón malvado los robó todos los zapatos y los escondió en su nido en las montañas. El pato estaba muy triste sin sus zapatos y se preguntaba cómo podría recuperarlos. Pero pronto se dio cuenta de que podía lograrlo con la ayuda de sus amigos. Fue a ver al caballo, a la vaca y a la oveja y les pidió ayuda. Juntos, el caballo, la vaca y la oveja planearon cómo podrían rescatar los zapatos. Idearon un plan astuto para engañar al halcón y hacer que devolviera los zapatos al pato. Finalmente, llegó el día del gran rescate. El pato, el caballo, la vaca y la oveja fueron a la montaña donde estaba el halcón y, después de un gran lucha, lograron recuperar los zapatos del pato. Todos estaban felices y se sintieron como verdaderos héroes. El pato aprendió que el valor de la amistad y el amor pudo hacer cualquier cosa posible. A partir de ese momento, compartió sus zapatos con los demás animales sin ningún problema.'}
          /> :
          <p className={styles.subheading}>Loading...</p>
        }
      </>
    },
  ]

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem('emailForSignIn')
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation')
      }
      // The client SDK will parse the code from the link for you.
      signInWithEmailLink(auth, email ?? '', window.location.href)
        .then(async (result) => {
          
          const token = await result.user.getIdToken(true)

          Cookies.set('token', token, {secure: true, sameSite: 'strict'})
          // Clear email from storage.
          // window.localStorage.removeItem('emailForSignIn')
          // // You can access the new user by importing getAdditionalUserInfo
          // // and calling it with result:
          // // getAdditionalUserInfo(result)
          // // You can access the user's profile via:
          // // getAdditionalUserInfo(result)?.profile
          // // You can check if the user is new or existing:

          // // [WARNING]
          // // Make sure this doesn't have a not operator when committing!

          // const userDoc = await getDoc(doc(db, `users/${result.user.uid}`)) as DocumentSnapshot<{ accountIsSetup: boolean }>
          
          // const userData = (userDoc.data as any as { accountIsSetup: boolean })

          // console.log(userData)
          // console.log(result.user.uid)


          // // if (getAdditionalUserInfo(result)?.isNewUser) {
          // if (userData.accountIsSetup === false) {
          //   setIsNewUser(true)
          // }
        })
        .catch((error) => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
          console.log(error)
        })
    }
  }, [])


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async () => {
      setUserData(auth.currentUser)

      if (!auth.currentUser || !auth.currentUser.uid) 
        return

      try {
        const userDoc = await getDoc(doc(db, `users/${auth.currentUser.uid}`)) as DocumentSnapshot<{ accountIsSetup: boolean }>
          
        const userData = userDoc?.data()

        if (!userData) {
          setIsNewUser(true)
          return
        }
        // if (getAdditionalUserInfo(result)?.isNewUser) {
        if (userData.accountIsSetup === false) {
          setIsNewUser(true)
        }
      } catch (error) {
        console.log(error)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => { (async () => {
    let response: StoryOutput

    if (questionIndex > 0 && story === undefined && storyLoadingState === StoryLoadingState.Idle && answers.name) {
      const generateStory = httpsCallable<StoryInput, StoryOutput>(functions, 'generateStory')
      setStoryLoadingState(StoryLoadingState.Loading)

      response = (await generateStory({
        language: 'en',
        prompt:  `Make a story where ${answers?.name} is a hero in a medieval tale. Make them fight a dragon and win. Make sure the hero is named ${answers?.name}`,
        readingLevel: 'C2',
        delayImage: true,
        attachToUser: true
      })).data // generateStory's return type is an object with only 1 key, data
      setStory(response)
    }

  })()}, [questionIndex, answers.name])

  return (<>
    <Head>
      <title>Account - Fable Factory</title>
      <link rel='canonical' href='https://fablefactory.co/auth' />
      <DefaultHeadTag />
    </Head>
    
    {isNewUser ?
      <>
        <div className={styles.main}>
          {(questionIndex < questionBank.length) ? <>
            <h1 className={styles.header}>
              Nice to meet you!
            </h1>

            <h2 className={styles.subheading}>
              {questionBank[questionIndex].question}
            </h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (questionIndex < questionBank.length - 1){
                  setQuestionIndex((v) => v + 1)
                } else {
                  updateDoc(doc(db, `users/${userData?.uid}`), {
                    accountIsSetup: true
                  })
                  setIsNewUser(false)
                }
              }}
            >
              {questionBank[questionIndex].input}
              <button
                type='submit'
                className={styles.button}
              >
                Continue
              </button>
            </form>
          </> : <>
            
          </>}

        </div>
      </> : <>
        <div className={styles.main}>
          <h1 className={styles.header}>
            {userData?.email}
          </h1>
          

          <button
            className={styles.button}
            onClick={() => {
              signOut(auth)
              if (Cookies.get('token') !== undefined) {
                Cookies.remove('token')
              }
            }}
          >
              Logout
          </button>
          </div>

        </>
      }

    <div className={shared.backgroundCircles}/>
  </>)
}

export default Account