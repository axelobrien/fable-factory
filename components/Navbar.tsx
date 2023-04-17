import React from 'react'
import styles from '../styles/navbar.module.scss'

function Navbar() {
  return (<>
    <nav className={styles.navbar}>
      <div>
        <a className={styles.logo} href='/'>
          Fable Factory
        </a>
      </div>

      <div className={styles.rightSide}>
        <a className={styles.navText} href='/bookshelf'>
          Bookshelf
        </a>
        <a className={styles.navText} href='/create-story'>
          New Fable
        </a>
      </div>
    </nav>
    <div className={styles.padding} />
  </>)
}

export default Navbar