import Image from 'next/image'
import React from 'react'
import styles from '../styles/index.module.scss'

function Index() {
  return (<>
    <main>
      <section className={styles.firstSection}>
        <div className={styles.container}>
          <h1 className={styles.logo}>
            Fable Factory
          </h1>

          <h3>
            Generate & read fables in the language
            you’re learning - for free
          </h3>
        </div>

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