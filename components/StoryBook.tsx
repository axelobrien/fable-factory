import React, { useEffect, useRef, useState } from 'react'
import styles from '../styles/storybook.module.scss'

type Props = {
  rawText: string,
}

enum ReadingState {
  FrontCover,
  Beginning,
  Reading,
  End
}

function StoryBook({ rawText }: Props) {
  const sentences = rawText.split(/(?<=[.?!])\s+|(?<=\r)/g) //detects end of sentence
  const [readingState, setReadingState] = useState<ReadingState>(ReadingState.FrontCover)
  const [currentLeftPage, setCurrentLeftPage] = useState(0)
  const [height, setHeight] = useState<string | undefined>(undefined)
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
    const rightFontSize = getFontSizeToFitText(leftDiv, sentences[currentLeftPage + 1])
    rightDiv.style.fontSize = rightFontSize + "px"
  }, [currentLeftPage])

  function getFontSizeToFitText(div: HTMLDivElement, text: string) {
    const maxHeight = div.clientHeight
    const maxWidth = div.clientWidth
    const fontWeight = '700' // Bold
    let fontSize = 24 // initial font size

    const tempDiv = document.createElement('div')
    tempDiv.style.position = 'absolute'
    tempDiv.style.visibility = 'hidden'
  
    document.body.appendChild(tempDiv)
  
    while (fontSize > 0) {
      tempDiv.style.fontSize = fontSize + 'px'
      tempDiv.style.width = maxWidth + 'px'
      tempDiv.style.fontWeight = fontWeight
      tempDiv.innerHTML = text
  
      const tempHeight = tempDiv.clientHeight
      if (tempHeight <= maxHeight) {
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
      style={{ height }}
    >
      {readingState === ReadingState.FrontCover ? <>
        <img
          src='/images/front-cover.png'
          className={styles.media}
          />
        </> : (readingState === ReadingState.Beginning) ? <>
          <video
            src='/videos/book-opening.mp4'
            className={styles.media}
            autoPlay
            muted
            controls={false}
            onEnded={() => setReadingState(ReadingState.Reading)}
            // @ts-ignore
            onPlay={({ target }) => setHeight(target.offsetHeight)}
          />
          </> : (readingState === ReadingState.Reading) ? <>
            <img
              src='/images/open-book.png'
              className={styles.media}
              alt='open book'
              onLoad={(e) => { e.preventDefault() }}
            />

            {/* <svg viewBox='0 0 30 40' className={styles.leftText} xmlns="http://www.w3.org/2000/svg">
              <text x='0' y='4' className={styles.pageText}> 
                {sentences[currentLeftPage]}
              </text> 
            </svg> */}


            <div className={styles.leftText} ref={leftPageRef}>
              <p >
                {sentences[currentLeftPage]}
              </p>
            </div>

            <div className={styles.rightText} ref={rightPageRef}>
              <p>
                {sentences[currentLeftPage + 1]}
              </p>
            </div>

            <div className={styles.buttonContainer}>
              <button
                className={styles.button}
                onClick={() => setCurrentLeftPage((c) => c !== 0 ? c - 2 : c)}
              >
                Backward
              </button>
              <button
                className={styles.button}
                onClick={() => setCurrentLeftPage((c) => c <= (sentences.length - 2) ? c + 2 : c)}
              >
                Forward
              </button>
            </div>
          </> : <>
              
          </>}
    </div>
  </>)
}

export default StoryBook