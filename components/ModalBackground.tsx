import React, { useEffect } from 'react'
import styles from '../styles/modalBackground.module.scss'

interface Props {
  children: React.ReactNode
  toggleModal: React.Dispatch<React.SetStateAction<boolean>>
}

function ModalBackground({ children, toggleModal }: Props) {

  useEffect(() => {
    const htmlElement = document.documentElement
    const blurContainer = document.createElement('div')
    const nextRoot = document.getElementById('__next')
    if (htmlElement && nextRoot) {
      blurContainer.style.backdropFilter = 'blur(5px)'
      blurContainer.style.pointerEvents = 'none'
      blurContainer.style.zIndex = '10'
      blurContainer.style.position = 'absolute' // Set position to create a new stacking context
      blurContainer.style.top = '0'
      blurContainer.style.left = '0'
      blurContainer.style.width = '100vw'
      blurContainer.style.height = '100vh'
      blurContainer.setAttribute('id', 'blur-container')
      nextRoot.appendChild(blurContainer)

      htmlElement.style.overflow = 'hidden'
    }
    
    return () => {
      const htmlElement = document.documentElement
      const nextRoot = document.getElementById('__next')
      const blurContainer = document.getElementById('blur-container')
      if (htmlElement && blurContainer && nextRoot) {
        nextRoot.removeChild(blurContainer)
        htmlElement.style.overflow = 'auto'
      }
    }
  }, [])

  return (<>
    <div
      className={styles.background}
      onClick={() => toggleModal((current) => !current)}
    >
      {children}
    </div>
  </>)
}

export default ModalBackground