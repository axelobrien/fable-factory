import React, { useEffect, useRef } from 'react'
import styles from '../styles/footer.module.scss'

function Footer() {
  const footerRef = useRef<HTMLDivElement>(null)
  const paddingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const setPadding = () => {
      if (footerRef.current && paddingRef.current) {
        const footerHeight = footerRef.current.clientHeight
        paddingRef.current.style.paddingBottom = `${footerHeight}px`
      }
    }
    setPadding()

    window.addEventListener('resize', setPadding)
    return () => {
      window.removeEventListener('resize', setPadding)
    }
  }, [])
  return (<>
    <footer className={styles.background} ref={footerRef}>
      <h1 className={styles.logo}>
        Fable Factory
      </h1>
      
      <div className={styles.rightSide}>
        <div className={styles.links}>
          <h3>
            Useful Links
          </h3>
          <a href='/'>Home</a>
          <a href='/create-story'>New Fable</a>
          <a href='/library'>Library</a>
        </div>

        <div className={styles.aboutUs}>
          <h3>
            About Us
          </h3>
          <p>
            Fable Factory is an attempt to aid language learners with the challenge of finding reading material in their target language by writing content at their reading level.
          </p>
        </div>
      </div>
    </footer>
    <div ref={paddingRef} />
  </>)
}

export default Footer