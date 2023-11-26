import React, { useState } from 'react'
import styles from '../styles/navbar.module.scss'
import ModalBackground from './ModalBackground'
import Link from 'next/link'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (<>
    <nav className={styles.navbar}>
      <Link className={styles.logo} href='/'>
        Fable Factory
      </Link>

      <div className={styles.rightSide}>
        <Link className={styles.navText} href='/library'>
          Library
        </Link>
        <Link className={styles.navText} href='/create-fable'>
          New Fable
        </Link>

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
              <h1 className={styles.modalTitle}>
                Main Menu
              </h1>

              <Link
                className={styles.modalLink}
                href='/'
              >
                Home
              </Link>

              <Link
                className={styles.modalLink}
                href='/create-fable'
              >
                New Fable
              </Link>
              
              <Link
                className={styles.modalLink}
                href='/library'
              >
                Library
              </Link>
            </div>
          </ModalBackground>
        </>}
      </div>
    </nav>
    {/* <div className={styles.padding} /> */}
  </>)
}

export default Navbar