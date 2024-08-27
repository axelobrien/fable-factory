import { httpsCallable } from 'firebase/functions'
import React, { useEffect, useState } from 'react'
import { db, functions } from '../shared/firebaseConfig'
import styles from '../styles/library.module.scss'
import { StoryInput, StoryOutput } from '../types/generateStory'
import StoryThumbnail from '../components/StoryThumbnail'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { CollectionReference, collection, limit, orderBy, query } from 'firebase/firestore'
import Head from 'next/head'
import { adminAuth, adminDb } from '../shared/adminFirebaseConfig'
import shared from '../styles/shared.module.scss'
import { GetServerSidePropsContext } from 'next'
import { getCookie } from 'cookies-next'


enum StoryLoadingState {
  Idle,
  Loading,
  Loaded,
  Error,
}

function MyBookshelf({ rawStories }: { rawStories: string }) {

  const fables = rawStories ? JSON.parse(rawStories) as StoryOutput[] : []

  return (<>
    <Head>
      <title>Library - Fable Factory</title>
    </Head>

    <main className={styles.container}>

      <img
        className={styles.blob}
        src='/images/top-blob.svg'
        alt=''
      />

      <h1 className={styles.header}>
        Explore your personal bookshelf
      </h1>

      {!fables && <>
        <h1 className={styles.header}>
          Error loading fables
        </h1>
      </>}
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
    <div className={shared.backgroundCircles} />
  </>)
}

export default MyBookshelf

export async function getServerSideProps(context: GetServerSidePropsContext)  {
  const token = getCookie('__session', {req: context.req, res: context.res})
  console.warn(token)
  console.warn(context.req)

  if (!token) {
    return {
      props: {
        rawStories: null,
        error: true
      }
    }
  }
  
  const decodedToken = await adminAuth.verifyIdToken(token)
  
  const { uid } = decodedToken

  const collectionData = await adminDb.collection('fables/visibility/private').where("userId", "==", uid).orderBy('createdAt', 'desc').limit(30).get()
  
  const stories = collectionData.docs.map(doc => doc.data())

  // console.log(stories)
  return {
    props: {
      rawStories: stories ? JSON.stringify(stories) : null,
      error: false
    }  
  }
  
}
