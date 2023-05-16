import React, { useState } from 'react'
import styles from '../styles/navbar.module.scss'
import ModalBackground from './ModalBackground'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (<>
    <nav className={styles.navbar}>
      <a className={styles.logo} href='/'>
        Fable Factory
      </a>

      <div className={styles.rightSide}>
        <a className={styles.navText} href='/library'>
          Library
        </a>
        <a className={styles.navText} href='/create-story'>
          New Fable
        </a>

        <button
          className={styles.navButton}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {/* {!menuOpen ? '☰' : 'X'} */}
          ☰
        </button>

        {menuOpen && <>
          <ModalBackground toggleModal={setMenuOpen} >
            <div
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              <a
                className={styles.modalLink}
              >
                Home
              </a>
              <a
                className={styles.modalLink}
              >
                New Fable
              </a>
              <a
                className={styles.modalLink}
              >
                Library
              </a>
            </div>
          </ModalBackground>
        </>}
      </div>
    </nav>
    <div className={styles.padding} />
  </>)
}

export default Navbar