import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styles from '../../../styles/book.module.scss'
import { StoryOutput } from '../../../types/generateStory'
import StoryBook from '../../../components/StoryBook'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../shared/firebaseConfig'

function Book() {
  const router = useRouter()
  const { id } = router.query
  const [story, setStory] = useState<StoryOutput | null>(null)

  useEffect(() => {
    (async () => {
      if (!id || typeof id !== 'string'){
        console.log(id)
        return
      }
      const story = await getDoc(doc(db, 'stories', id))
      if (!story.exists()) 
        return
      
      setStory(story.data() as StoryOutput ?? null)
    }
  )()}, [id])

  return (<>
    <h2 className={styles.subtitle}>
        {story?.title}
      </h2>

      <img
        className={styles.image}
        src={story?.coverImage}
      />

      {story?.story && (
        <StoryBook
          story={story}
          rawText={story?.story ??
            'Había un pato con unos zapatos muy chéveres que todos los animales de la granja querían tener. Los zapatos eran verde limón y hacían que sus pies parecieran una tormenta. Pero un día un halcón malvado los robó todos los zapatos y los escondió en su nido en las montañas. El pato estaba muy triste sin sus zapatos y se preguntaba cómo podría recuperarlos. Pero pronto se dio cuenta de que podía lograrlo con la ayuda de sus amigos. Fue a ver al caballo, a la vaca y a la oveja y les pidió ayuda. Juntos, el caballo, la vaca y la oveja planearon cómo podrían rescatar los zapatos. Idearon un plan astuto para engañar al halcón y hacer que devolviera los zapatos al pato. Finalmente, llegó el día del gran rescate. El pato, el caballo, la vaca y la oveja fueron a la montaña donde estaba el halcón y, después de un gran lucha, lograron recuperar los zapatos del pato. Todos estaban felices y se sintieron como verdaderos héroes. El pato aprendió que el valor de la amistad y el amor pudo hacer cualquier cosa posible. A partir de ese momento, compartió sus zapatos con los demás animales sin ningún problema.'}
        />
      )}
  </>)
}

export default Book