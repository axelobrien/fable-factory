import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styles from '../../../styles/fable.module.scss'
import { StoryOutput } from '../../../types/generateStory'
import { doc, getDoc } from 'firebase/firestore'
import Head from 'next/head'
import FableViewer from '../../../components/FableViewer'
import { GetServerSidePropsContext } from 'next'
import { adminDb } from '../../../shared/adminFirebaseConfig'

function Book({ rawStory }: { rawStory: string | undefined }) {
  const story = rawStory ? JSON.parse(rawStory) as StoryOutput | undefined : undefined

  return (<>
    <Head>
      <title>{story?.title ?? 'New Fable'}</title>
      <link rel='icon' type='image/x-icon' href='/images/favicon.png' />
      
      <meta property='og:title' content={story?.title ?? 'Fable Factory'} key='og:title' />
      <meta property='og:site_name' content='Fable Factory'key='og:site_name'  />
      <meta property='og:description' content={`Read this fable for free with Fable Factory!`} key='og:description' /> 
      <meta property='og:type' content='article' key='og:type' />
      
      <meta property='image' content={story?.coverImage ?? '/images/og-image.png'} key='image' />
      <meta property='og:image' content={story?.coverImage ?? '/images/og-image.png'} key='og:image' />
      <meta property='og:image:height' content='1080' key='og:image:height' />
      <meta property='og:image:width' content='1080' key='og:image:width' />

      <meta name='twitter:title' content={story?.title ?? 'Fable Factory'} key='twitter:title' />
      <meta name='twitter:description' content={`Read this fable for free with Fable Factory!`} key='twitter:description' />
      <meta name='twitter:image' content={story?.coverImage ?? '/images/og-image.png'} key='twitter:image' />
    </Head> 

    <main className={styles.container}>

      <img
        className={styles.blob}
        src='/images/top-blob.svg'
        alt=''
      />

      <h2 className={styles.title}>
        {story?.title ?? 'Story not found'}
      </h2>

      <img
        className={styles.image}
        src={story?.coverImage}
      />

      {story?.story && (
        <FableViewer
          story={story}
          rawText={story?.story ??
            'Había un pato con unos zapatos muy chéveres que todos los animales de la granja querían tener. Los zapatos eran verde limón y hacían que sus pies parecieran una tormenta. Pero un día un halcón malvado los robó todos los zapatos y los escondió en su nido en las montañas. El pato estaba muy triste sin sus zapatos y se preguntaba cómo podría recuperarlos. Pero pronto se dio cuenta de que podía lograrlo con la ayuda de sus amigos. Fue a ver al caballo, a la vaca y a la oveja y les pidió ayuda. Juntos, el caballo, la vaca y la oveja planearon cómo podrían rescatar los zapatos. Idearon un plan astuto para engañar al halcón y hacer que devolviera los zapatos al pato. Finalmente, llegó el día del gran rescate. El pato, el caballo, la vaca y la oveja fueron a la montaña donde estaba el halcón y, después de un gran lucha, lograron recuperar los zapatos del pato. Todos estaban felices y se sintieron como verdaderos héroes. El pato aprendió que el valor de la amistad y el amor pudo hacer cualquier cosa posible. A partir de ese momento, compartió sus zapatos con los demás animales sin ningún problema.'}
        />
      )}
    </main>
  </>)
}

export default Book

export async function getServerSideProps({ params }: GetServerSidePropsContext)  {
  const id = typeof params?.id === 'string' ? params.id : null 

  if (!id) {
    return {
      props: {
        story: JSON.stringify({})
      }
    }
  }

  const docRef = await adminDb.doc(`fables/visibility/public/${id}`).get()
  const story = docRef.exists ? { id: docRef.id, ...docRef.data() } as StoryOutput : null

  return {
    props: {
      rawStory: story ? JSON.stringify(story) : null
    }
  }
  
}