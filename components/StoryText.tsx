import React from 'react'
import styles from '../styles/story-text.module.scss'

type Props = {
  rawText: string,
}

function StoryText({ rawText }: Props) {
  const sentences = rawText.split(/(?<=[.?!])\s+|(?<=\r)/g) //detects end of sentence

  return (<>
    <div className={styles.sentenceContainer} key={'container'}>
      {sentences.map((sentence, index) => {
        return <>
            <p
              key={index}
              className={styles.sentence}
            >
              {sentence}
            </p>
        </>
      })}
    </div>
  </>)
}

export default StoryText