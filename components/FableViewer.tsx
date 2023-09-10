import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from '../styles/fableViewer.module.scss'
import ShareModal from './ShareModal'
import { StoryOutput } from '../types/generateStory'
import { httpsCallable } from 'firebase/functions'
import { functions } from '../shared/firebaseConfig'
import TranslateRequest, { TranslateResponse } from '../types/translateStory'

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
  const [translatedSentences, setTranslatedSentences] = useState((new Array(sentences.length)) as string[])
  const [openShareModal, setOpenShareModal] = useState(false)
  const [height, setHeight] = useState<string | undefined>(undefined)
  const [readingState, setReadingState] = useState<ReadingState>(ReadingState.FrontCover)
  const [currentLeftPageIndex, setCurrentLeftPageIndex] = useState(0)

  const [showLeftTranslation, setShowLeftTranslation] = useState(false)
  const [showRightTranslation, setShowRightTranslation] = useState(false)
  const leftPageRef = useRef<HTMLDivElement>(null)
  const rightPageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (rawText.length > 0 && readingState === ReadingState.FrontCover) {
      setReadingState(ReadingState.Beginning)
      setCurrentLeftPageIndex(0)
    }
  }, [sentences])

  // Triggers resetting of font size upon page change
  useEffect(() => {
    if (!leftPageRef.current) return
    const leftDiv = leftPageRef.current
    const leftFontSize = getFontSizeToFitText(leftDiv, sentences[currentLeftPageIndex])
    leftDiv.style.fontSize = leftFontSize + "px"
    
    if (!rightPageRef.current) return
    const rightDiv = rightPageRef.current
    const rightFontSize = getFontSizeToFitText(rightDiv, sentences[currentLeftPageIndex + 1])
    rightDiv.style.fontSize = rightFontSize + "px"
  }, [currentLeftPageIndex, readingState])

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

  // navigator.language is in the format of en-US, but Google Translate uses en
  function navigatorLanguageToGoogleLanguageCode(navigatorLanguage: string): string {
    const languageCode = navigatorLanguage.split('-')

    // Chinese has 3 dialects that are separate on Google Translate
    if (languageCode[0] === 'zh') {
      const variants = ['CN', 'TW', 'HK']
      const variant = languageCode[languageCode.length - 1]
      return variants.includes(variant) ? `zh-${variant.toLocaleLowerCase()}` : 'zh'
    }

    return languageCode[0]
  }

  async function translatePage(text: string): Promise<string> {
    if (!story) return text
    if (story.language === navigatorLanguageToGoogleLanguageCode(navigator.language)) return text

    const translate = httpsCallable<TranslateRequest, TranslateResponse>(functions, 'translate')
    const response = (await translate({
      text,
      from: story.language,
      to: navigatorLanguageToGoogleLanguageCode(window.navigator.language)
    })).data // httpsCallable's return type is an object with only 1 key, data

    console.log(response)
    if (response.status === 'ok') {
      return response.text
    } else {
      console.error(response.error)
      return text
    }
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
          onClick={async () => {
            setShowLeftTranslation((prev) => !prev)
            if (!showLeftTranslation && !translatedSentences[currentLeftPageIndex]) {
              const newTranslatedSentences = [...translatedSentences]
              newTranslatedSentences[currentLeftPageIndex] = await translatePage(sentences[currentLeftPageIndex])
              setTranslatedSentences(newTranslatedSentences)
            }
          }}
        >
          {showLeftTranslation ? translatedSentences[currentLeftPageIndex] ?? 'Loading...' : sentences[currentLeftPageIndex]}
        </div>

        <div
          className={`${styles.page} ${styles.right}`}
          ref={rightPageRef}
          onClick={async () => {
            setShowRightTranslation((prev) => !prev)
            if (!showRightTranslation && !translatedSentences[currentLeftPageIndex + 1]) {
              const newTranslatedSentences = [...translatedSentences]
              newTranslatedSentences[currentLeftPageIndex + 1] = await translatePage(sentences[currentLeftPageIndex + 1])
              setTranslatedSentences(newTranslatedSentences)
            }
          }}
        >
          {showRightTranslation ? translatedSentences[currentLeftPageIndex + 1] ?? 'Loading...' : sentences[currentLeftPageIndex + 1]}
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
          onClick={() => {
            setCurrentLeftPageIndex((c) => c !== 0 ? c - 2 : c)
            setShowLeftTranslation(false)
            setShowRightTranslation(false)
          }}
        >
          Backward
        </button>
        <button
          className={styles.button}
          onClick={() => {
            setShowLeftTranslation(false)
            setShowRightTranslation(false)
            setCurrentLeftPageIndex((c) => {
              if (c < sentences.length - 2)
                return c + 2 // +2 because we want to skip the page thats on the right
              
              // TODO: close book when we reach the end
              
              return c
            })
          }}
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