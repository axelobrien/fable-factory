import React, { useEffect, useRef, useState } from 'react'
import styles from '../styles/fableViewer.module.scss'
import ShareModal from './ShareModal'
import { StoryOutput } from '../types/generateStory'

type Props = {
  rawText: string,
  story?: StoryOutput,
}

enum ReadingState {
  FrontCover,
  Beginning,
  Reading,
  End
}

function FableViewer({ rawText, story }: Props) {
  const sentences = rawText.split(/[.?!。！？]\s+(?=[^\p{P}\p{S}\p{Z}\p{C}])/gu).filter((s) => s !== ' ') //detects end of sentence
  const [readingState, setReadingState] = useState<ReadingState>(ReadingState.FrontCover)
  const [currentLeftPage, setCurrentLeftPage] = useState(0)
  const [height, setHeight] = useState<string | undefined>(undefined)
  const [openShareModal, setOpenShareModal] = useState(false)
  const leftPageRef = useRef<HTMLDivElement>(null)
  const rightPageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (rawText.length > 0 && readingState === ReadingState.FrontCover) {
      setReadingState(ReadingState.Beginning)
    }
  }, [sentences])

  
  useEffect(() => {
    if (!leftPageRef.current) return
    const leftDiv = leftPageRef.current
    const leftFontSize = getFontSizeToFitText(leftDiv, sentences[currentLeftPage])
    leftDiv.style.fontSize = leftFontSize + "px"
    
    if (!rightPageRef.current) return
    const rightDiv = rightPageRef.current
    const rightFontSize = getFontSizeToFitText(rightDiv, sentences[currentLeftPage + 1])
    rightDiv.style.fontSize = rightFontSize + "px"
  }, [currentLeftPage, readingState])

  // Starts at 24 font size then decreases until it fits
  function getFontSizeToFitText(div: HTMLDivElement, text: string) {
    const maxHeight = div.clientHeight - 45 // Actual padding on top & bottom is 20 but the extra 5 is for safety
    const maxWidth = div.clientWidth
    const fontWeight = '700' // Bold
    let fontSize = 24 // initial font size

    const tempDiv = document.createElement('div')
    tempDiv.style.position = 'absolute'
    tempDiv.style.visibility = 'hidden'
    tempDiv.style.padding = window.getComputedStyle(div).getPropertyValue('padding')

    document.body.appendChild(tempDiv)
  
    while (fontSize > 0) {
      tempDiv.style.fontSize = fontSize + 'px'
      tempDiv.style.width = maxWidth + 'px'
      tempDiv.style.fontWeight = fontWeight
      tempDiv.innerHTML = text
  
      const tempHeight = tempDiv.clientHeight
      if (tempHeight < maxHeight) {
        break
      }
  
      fontSize--
    }
    document.body.removeChild(tempDiv)
    return fontSize
  }

  return (<>
    <div
      className={styles.container}
      // style={{ height }}
    >
      <div
        className={styles.bookContainer}
        onLoad={(e) => setHeight(`${e.currentTarget.offsetHeight}px`)}
      >

        <div
          className={`${styles.page} ${styles.left}`}
          ref={leftPageRef}
        >
          {sentences[currentLeftPage]}
        </div>

        <div
          className={`${styles.page} ${styles.right}`}
          ref={rightPageRef}
        >
          {sentences[currentLeftPage + 1]}
        </div>

      </div>

      <div className={styles.buttonContainer}>
        <button
          className={styles.button}
          onClick={() => setOpenShareModal(true)}
        >
          Share
        </button>
        <button
          className={styles.button}
          onClick={() => setCurrentLeftPage((c) => c !== 0 ? c - 2 : c)}
        >
          Backward
        </button>
        <button
          className={styles.button}
          onClick={() => setCurrentLeftPage((c) => {
            if (c < sentences.length - 2)
              return c + 2 // +2 because we want to skip the page thats on the right
            
            // TODO: close book when we reach the end
            
            return c
          })}
        >
          Forward
        </button>
      </div>

      {openShareModal && (<>
        <ShareModal
          story={story}
          showModal={setOpenShareModal}
        />
      </>)}

    </div>
  </>)
}

export default FableViewer