import Image from 'next/image'
import React from 'react'
import styles from '../styles/index.module.scss'
import Head from 'next/head'

function Index() {
  return (<>
    <Head>
      <title>Fable Factory</title>
    </Head>
    <main className={styles.main}>
      <section className={styles.firstSection}>
        <h1 className={styles.logo}>
          Fable Factory
        </h1>

        <h3 className={styles.subtitle}>
          Generate & read fables in the language
          you’re learning - for free
        </h3>
        
        <a
          href='/create-story'
          draggable='false'
          className={styles.button}
        >
          Get Started
        </a>

        <img
          className={styles.topBlob}
          src='/images/top-blob.svg'
          alt='Top Blob'
        />

      </section>
      <div className={styles.bookstackContainer}>
        <img
          className={styles.bookStackImage}
          src='/images/many-books.png'
          alt='Books showing some of the languages we support'
        />

        <p className={styles.multilingualHeader}>
          We've got stories in the language you're learning.
        </p>
      </div>
    </main>
  </>)
}

export default Index