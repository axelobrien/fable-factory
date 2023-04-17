import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

if (!admin.apps.length)
  admin.initializeApp()

interface userInput {
  id: string
}

const publishStory = functions.https.onCall(async (data: userInput, context) => {
  const { id } = data

  const db = admin.firestore()
  const story = await db.collection('stories').doc(id).get()

  if (!story.exists) {
    throw new functions.https.HttpsError('not-found', 'Story not found')
  }

  if (story?.data()?.visibility === 'private') {
    await db.collection('stories').doc(id).update({
      visibility: 'public'
    })
    
    return {
      message: 'success'
    }
  }

  return {
    message: 'error: story is already public or failed to get story'
  }
})

export default publishStory