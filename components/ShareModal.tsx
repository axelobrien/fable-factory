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
              navigator.clipboard.writeText(`https://fablefactory.co/bookshelf/book/${story?.id}`)
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
            href={`https://twitter.com/intent/tweet?text=I made a fable in ${story?.language}! Read it at https://fablefactory.co/bookshelf/book/${story?.id}`}
            onClick={() => {
              publishStory()
            }}
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Logo_of_Twitter%2C_Inc..svg/1280px-Logo_of_Twitter%2C_Inc..svg.png'
              width={40}
              height={33}
            />
          </a>
                
          <a
            href={`https://facebook.com/sharer/sharer.php?u=I made a fable in ${story?.language}! Read it at https://fablefactory.co/bookshelf/book/${story?.id}`}
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