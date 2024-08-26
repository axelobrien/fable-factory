import React, { useState } from 'react'
import { getAuth, sendSignInLinkToEmail } from 'firebase/auth'
import shared from '../styles/shared.module.scss'
import styles from '../styles/auth.module.scss'
import Head from 'next/head'
import { auth } from '../shared/firebaseConfig'
import DefaultHeadTag from '../components/DefaultHeadTag'
import { isProduction } from '../shared/clientSharedVariables'
import EmailAuthState from '../types/emailAuthState'

function Login() {
  const [email, setEmail] = useState("")
  const [emailAuthState, setEmailAuthState] = useState<EmailAuthState>(EmailAuthState.Idle)
    
  async function login(e: React.FormEvent<HTMLFormElement>) {

    try {
      const actionCodeSettings = {
        url: isProduction ? 'https://fablefactory.co/account' : 'http://localhost:3000/account',
        handleCodeInApp: true // For some reason this has to be here
      }

      setEmailAuthState(EmailAuthState.Pending)

      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      window.localStorage.setItem('emailForSignIn', email)

      setEmailAuthState(EmailAuthState.Success)
      setTimeout(() => setEmailAuthState(EmailAuthState.Idle), 30 * 1000)
    } catch (error: any) {
      console.error(error.code)
      console.error(error.message)
      setEmailAuthState(EmailAuthState.Error)
    }
  }

  return (<>
    <Head>
      <title>Login to Fable Factory</title>
      <link rel='canonical' href='https://fablefactory.co/login' />
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

      {emailAuthState === EmailAuthState.Pending ? <>
        <p className={styles.statusText}>Sending login link to your email ({email})...</p>
      </> : emailAuthState === EmailAuthState.Success ? <>
        <p className={styles.statusText}>Check your email ({email}) for a link to login!</p>
      </> : (emailAuthState === EmailAuthState.Error && <>
        <p className={styles.statusText}>Unfortunately, there was an error sending you a login email. Please try again later</p>
      </>)}

      <div className={styles.features}>

      </div>
    </div>
    <div className={shared.backgroundCircles}/>
  </>)
}

export default Login