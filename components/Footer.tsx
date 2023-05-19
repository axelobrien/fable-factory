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
      <div className={styles.leftSide}>  
        <div className={styles.leftSideText}>
          <h3 className={styles.subtitle}>
            Check out our newsletter
          </h3>
          <p>
            We'll never email you more than once a week. We'll send you news about updates to Fable Factory and the best stories made with it!
          </p>
        </div>   
        <iframe
          src="https://cdn.forms-content.sg-form.com/dfc036d6-f607-11ed-808b-6a7eec637350"
          className={styles.newsletterSignup}
        />
      </div>

      <div className={styles.rightSide}>
        <div className={styles.links}>
          <h3 className={styles.subtitle}>
            Useful Links
          </h3>
          <a href='/'>Home</a>
          <a href='/create-fable'>New Fable</a>
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
        
        {/* <h1 className={styles.logo}>
          Fable Factory
        </h1> */}

      </div>
    </footer>
    <div ref={paddingRef} />
  </>)
}

export default Footer