import React, { useState } from 'react'
import styles from '../styles/navbar.module.scss'
import ModalBackground from './ModalBackground'
import Link from 'next/link'
import { auth } from '../shared/firebaseConfig'

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

        {!auth?.currentUser ? <>
          <Link className={styles.navText} href={'/my-bookshelf'}>
            My Bookshelf
          </Link>

          <Link className={styles.navText} href={'/account'}>
            Account
          </Link>
        </> :
          <Link className={styles.navText} href='/login'>
            Login
          </Link>
        }


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

              {auth?.currentUser ? <>
                <Link className={styles.modalLink} href={'/my-bookshelf'}>
                  My Bookshelf
                </Link>

                <Link className={styles.modalLink} href={'/account'}>
                  Account
                </Link>
              </> :
                <Link className={styles.modalLink} href='/login'>
                  Login
                </Link>
              }
            </div>
          </ModalBackground>
        </>}
      </div>
    </nav>
    <div className={styles.padding} />
  </>)
}

export default Navbar