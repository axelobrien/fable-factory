import React from 'react'
import styles from '../styles/navbar.module.scss'

function  Navbar() {
  return (<>
    <nav className={styles.navbar}>
      <a className={styles.logo} href='/'>
        Fable Factory
      </a>
    </nav>
    <div className={styles.padding} />
  </>)
}

export default Navbar