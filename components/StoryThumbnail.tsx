import React from 'react'
import styles from '../styles/storyThumbnail.module.scss'

interface Props {
  title: string
  image: string
  id: string
  author?: string
  href: string
}

function StoryThumbnail({ title, image, id, author, href }: Props) {
  return (<>
    <a
      href={href}
      className={styles.container}
    >
      <img
        src={image}
        alt='Thumbnail'
        className={styles.image}
      />
      <h5 className={styles.title}>
        {title} {author && 'by ' + author}
      </h5>
    </a>
  </>)
}

export default StoryThumbnail