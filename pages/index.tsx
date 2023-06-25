import React, { useEffect, useRef } from 'react'
import styles from '../styles/index.module.scss'
import Head from 'next/head'

import Image from 'next/image'
import libraryImage from '../public/images/library.png' // This is the only image that doesn't break with next/image

function Index() {
  const scrollAnimationRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!scrollAnimationRef.current) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.show)
        }
        // else {
        //   entry.target.classList.remove(styles.show)
        // }
      })
    })

    const hiddenElements = document.querySelectorAll('.hidden')
    hiddenElements.forEach((el) => observer.observe(el))
  }, [scrollAnimationRef])

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
          Create Fable
        </a>

        <img
          className={styles.topBlob}
          src='/images/top-blob.svg'
          alt=''
        />

      </section>
      <div className={styles.bookstackContainer}>
        <h2 className={styles.multilingualHeader}>
          We use
          <span
            className={`hidden ${styles.gradientHighlight}`}
            ref={scrollAnimationRef}
          >
            magic
          </span>
          to generate stories in 10 languages
        </h2>

        <img
          className={styles.castleImage}
          src='images/castle.png'
          alt=''
        />
      </div>
      <section className={styles.library}>
        <Image
          className={styles.libraryImage}
          src={libraryImage}
          alt=''
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
            alt=''
          />
        </div>
      </section>
    </main>
  </>)
}

export default Index