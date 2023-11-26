import React, { useEffect, useRef } from 'react'
import styles from '../styles/index.module.scss'
import Head from 'next/head'
import Image from 'next/image'
import libraryImage from '../public/images/library.png' // This is the only image that doesn't break with next/image
import Link from 'next/link'

function Index() {
  const scrollAnimationRef = useRef<HTMLSpanElement>(null)
  const horizontalScrollerRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (horizontalScrollerRef.current) {
      const scrollerContent = Array.from(horizontalScrollerRef.current.childNodes)
      scrollerContent.forEach((v) => {
        const duplicatedItem = v.cloneNode(true)
        horizontalScrollerRef?.current?.appendChild(duplicatedItem)
      })
    }
  }, [horizontalScrollerRef])

  useEffect(() => {
    if (!scrollAnimationRef.current) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.show)
        }
        // Turn on this else statement to make the animation repeat every time the element is scrolled into view
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

      <section className={styles.firstSection}>
        <h1 className={styles.logo}>
          Fable Factory
        </h1>

        <h2 className={styles.subtitle}>
          Generate & read fables in the language
          you’re learning - for free
        </h2>
        
        <Link
          href='/create-fable'
          draggable='false'
          className={styles.button}
        >
          Create Fable
        </Link>

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

          <Link
          href='/library'
          draggable='false'
          className={styles.button}
          >
            Browse
          </Link>
        </div>
        <div className={styles.libraryBlobContainer}>
          <img
            className={styles.libraryBlob}
            src='/images/library-blob.svg'
            alt=''
          />
        </div>
      </section>
      <section className={styles.libraryScrollerContainer}>
        <ul className={styles.libraryScroller} ref={horizontalScrollerRef}>
          <Link className={styles.libraryScrollerInner} href='/library/fable/WNLVcCiKJx5gil8cIX9v'>
            <img
              className={styles.libraryScrollerInnerImage}
              src='https://storage.googleapis.com/fable-factory-3ab69.appspot.com/bookCovers%2F9579cf36-6cd4-46a9-8e5b-5f2eb0466eef.png'
              alt=''
            />
            <p className={styles.libraryScrollerInnerTitle}>
            Max, der mutige Vogel
            </p>
          </Link>
          <Link className={styles.libraryScrollerInner} href='/library/fable/JOdthIXVNEr9vifmhCnk'>
            <img
              className={styles.libraryScrollerInnerImage}
              src='https://storage.googleapis.com/fable-factory-3ab69.appspot.com/bookCovers%2Fe0587a7a-d22e-4380-ac13-46a89756df67.png'
              alt=''
            />
            <p className={styles.libraryScrollerInnerTitle}>
            Kittens&apos; Moon Adventure
            </p>
          </Link>
          <Link className={styles.libraryScrollerInner} href='/library/fable/6QEpnWLBViW62LxVezsY'>
            <img
              className={styles.libraryScrollerInnerImage}
              src='https://storage.googleapis.com/fable-factory-3ab69.appspot.com/bookCovers%2F6fde6a47-b4e0-4f40-9587-3671783cc491.png'
              alt=''
            />
            <p className={styles.libraryScrollerInnerTitle}>
            Sparkling Feathers
            </p>
          </Link>
          <Link className={styles.libraryScrollerInner} href='/library/fable/jeG9w7wtL6pBC9FO4sO4'>
            <img
              className={styles.libraryScrollerInnerImage}
              src='https://storage.googleapis.com/fable-factory-3ab69.appspot.com/bookCovers%2F57b953db-09ef-419d-bc4b-71578838a364.png'
              alt=''
            />
            <p className={styles.libraryScrollerInnerTitle}>
              La Estrella Brillante
            </p>
          </Link>
          <Link className={styles.libraryScrollerInner} href='/library/fable/lXPaylD0l9NIkGPJ12iH'>
            <img
              className={styles.libraryScrollerInnerImage}
              src='https://storage.googleapis.com/fable-factory-3ab69.appspot.com/bookCovers%2F4504bfe1-deaf-47cd-90b4-431d07698f7b.png'
              alt=''
            />
            <p className={styles.libraryScrollerInnerTitle}>
              The Joyful Journey
            </p>
          </Link>
          <Link className={styles.libraryScrollerInner} href='/library/fable/VL8B1qt12Qz6HQ8mcm11'>
            <img
              className={styles.libraryScrollerInnerImage}
              src='https://storage.googleapis.com/fable-factory-3ab69.appspot.com/bookCovers%2Fccc58fee-13e0-4596-bb9b-48d51cf3084d.png'
              alt=''
            />
            <p className={styles.libraryScrollerInnerTitle}>
              The Magical Book of Syd&apos;s Drawings
            </p>
          </Link>
          <Link className={styles.libraryScrollerInner} href='/library/fable/9oIt1wPHzRVOalsoTbgr'>
            <img
              className={styles.libraryScrollerInnerImage}
              src='https://storage.googleapis.com/fable-factory-3ab69.appspot.com/bookCovers%2F2b18c160-3bcd-4344-8d90-b49e53d7d1f8.png'
              alt=''
            />
            <p className={styles.libraryScrollerInnerTitle}>
              La Perdita Bovino
            </p>
          </Link>
          <Link className={styles.libraryScrollerInner} href='/library/fable/xn67hhSUA6V2JZb5K3rS'>
            <img
              className={styles.libraryScrollerInnerImage}
              src='https://storage.googleapis.com/fable-factory-3ab69.appspot.com/bookCovers%2Fd510b153-32b9-46d8-811e-fcada080ab5d.png'
              alt=''
            />
            <p className={styles.libraryScrollerInnerTitle}>
              Поляна цветов
            </p>
          </Link>
        </ul>
      </section>
    </main>
  </>)
}

export default Index