import React from 'react'
import styles from '../styles/shareModal.module.scss'
import { StoryOutput } from '../types/generateStory'
import { functions } from '../shared/firebaseConfig'
import { httpsCallable } from 'firebase/functions'

interface Props {
  story?: StoryOutput
  showModal: React.Dispatch<React.SetStateAction<boolean>>
}

function ShareModal({ story, showModal }: Props) {
  async function publishStory() {
    if (!story)
      return
    
    const publish = httpsCallable<{ id: string }, { message: string }>(functions, 'publishStory')
    const message = await publish({ id: story.id })

    if (!(message.data.message === 'success')) {
      console.warn('Failed to publish story or story is public')
    }
  }

  return (<>
    <div className={styles.container} onClick={() => showModal(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h4 className={styles.subtitle}>
          Share your story with the world!
        </h4>

        <div className={styles.shareContainer}>
          <button
            onClick={(e) => {
              navigator.clipboard.writeText(`https://fablefactory.co/library/fable/${story?.id}`)
              const target = e.currentTarget
              const beforeText = 'Copy Link'
              target.innerText = 'Copied!'
              setTimeout(() => {
                target.innerText = beforeText
              }, 1000)
              publishStory()
          }}
            className={styles.copyButton}
          >
            Copy Link
          </button>
          
          <a
            href={`https://twitter.com/intent/tweet?text=I made a fable in ${story?.language}! Read it at https://fablefactory.co/library/fable/${story?.id}`}
            onClick={() => {
              publishStory()
            }}
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              src='data:image/png;base64,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'
              width={40}
              height={40}
            />
          </a>
                
          <a
            href={`https://facebook.com/sharer/sharer.php?u=I made a fable in ${story?.language}! Read it at https://fablefactory.co/library/fable/${story?.id}`}
            target='_blank'
            rel='noopener noreferrer'
            onClick={() => {
              publishStory()
            }}
          >
            <img
              src='https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Facebook_f_logo_%282021%29.svg/150px-Facebook_f_logo_%282021%29.svg.png'
              width={40}
              height={40}
            />
          </a>
        </div>

        <p className={styles.modalText}>
          Clicking on any of these options will make your story public.
        </p>
      </div>
    </div>
  </>)
}

export default ShareModal