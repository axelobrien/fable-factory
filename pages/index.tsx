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

        <h2 className={styles.subtitle}>
          Generate & read fables in the language
          you’re learning - for free
        </h2>
        
        <a
          href='/create-fable'
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
      <section className={styles.library}>
        <img
          className={styles.libraryImage}
           src='/images/library.png'
        />
        <div className={styles.libraryTextContainer}>
          <h2 className={styles.subtitle}>
            Check out our
          </h2>

          <h1 className={styles.logo}>
            Limitless Library
          </h1>

          <h2 className={styles.subtitle}>
            Filled with fables made by people just like you
          </h2>

          <a
          href='/library'
          draggable='false'
          className={styles.button}
          >
            Browse
          </a>
        </div>
        <div className={styles.libraryBlobContainer}>
          <img
            className={styles.libraryBlob}
            src='/images/library-blob.svg'
            alt='Top Blob'
          />
        </div>
      </section>
    </main>
  </>)
}

export default Index