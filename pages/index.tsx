import Image from 'next/image'
import React from 'react'
import styles from '../styles/index.module.scss'

function Index() {
  return (<>
    <main>
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
          src="/images/top-blob.svg"
          alt="Top Blob"
        />
      </section>
    </main>
  </>)
}

export default Index