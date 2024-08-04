import React, { useState } from 'react'
import { getAuth, sendSignInLinkToEmail } from 'firebase/auth'
import shared from '../styles/shared.module.scss'
import styles from '../styles/auth.module.scss'
import Head from 'next/head'
import { auth } from '../shared/firebaseConfig'
import DefaultHeadTag from '../components/DefaultHeadTag'

function Auth() {
  const [email, setEmail] = useState("")
    
  async function login(e: React.FormEvent<HTMLFormElement>) {

    try {
      const actionCodeSettings = {
        url: 'http://localhost:3000/account',
        handleCodeInApp: true // For some reason this has to be here
      }

      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      window.localStorage.setItem('emailForSignIn', email)

    } catch (error: any) {
      console.error(error.code)
      console.error(error.message)
    }
  }

  return (<>
    <Head>
      <title>Login to Fable Factory</title>
      <link rel='canonical' href='https://fablefactory.co/auth' />
      <DefaultHeadTag />
    </Head>
    <div className={styles.main}>
      <h1 className={styles.header}>
        Explore 134 languages for free
      </h1>
      <h2 className={styles.subheading}>
        Just enter your email - no password needed
      </h2>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()
          login(e)
        }}
      >
        <input
          placeholder='Enter your email'
          type='email'
          aria-details='This is where you type in your email address'
          required
          className={styles.input}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type='submit'
          className={styles.loginButton}
        >
          Continue
        </button>
      </form>

      <div className={styles.features}>

      </div>
    </div>
    <div className={shared.backgroundCircles}/>
  </>)
}

export default Auth