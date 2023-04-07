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

  useEffect(() => {
    if (rawText.length > 0 && readingState === ReadingState.FrontCover) {
      setReadingState(ReadingState.Beginning)
    }
  }, [sentences])

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

            <p className={styles.leftText}>
              {sentences[currentLeftPage]}
            </p>

            <p className={styles.rightText}>
              {sentences[currentLeftPage + 1]}
            </p>

            <div className={styles.buttonContainer}>
              <button
                className={styles.button}
                onClick={() => setCurrentLeftPage((c) => c !== 0 ? c - 2 : c)}
              >
                Backward
              </button>
              <button
                className={styles.button}
                onClick={() => setCurrentLeftPage((c) => c <= sentences.length - 1 ? c + 2 : c)}
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