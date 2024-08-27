import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { Configuration } from 'openai'
import { OpenAIApi } from 'openai/dist/api'
import { v4 as uuid } from 'uuid'

if (!admin.apps.length)
  admin.initializeApp()

export type generateDelayedImageParams = {
  prompt: string
  id: string
}

const generateDelayedImage = functions.runWith({ timeoutSeconds: 540 }).https.onCall(async (data: generateDelayedImageParams, context): Promise<boolean> => {
  
  const input = {
    prompt: typeof data.prompt === 'string' ? data.prompt : undefined,
    id: typeof data.id === 'string' ? data.id : undefined
  }
  
  if (input.prompt === undefined || input.id === undefined) {
    console.log('Prompt or id for generateDelayedImage is not a string')
    return false
  }

  const openaiConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  })

  const openai = new OpenAIApi(openaiConfig)

  const rawCover = await openai.createImage({
    prompt: `${input.prompt}, digital art, book cover, NO TEXT, NO TEXT`,
    n: 1,
    size: '1024x1024',
    response_format: 'b64_json'
  })


  let cover = ''

  if (rawCover?.data && rawCover?.data?.data[0].b64_json) {
    const bookId = uuid()
    const coverBuffer = Buffer.from(rawCover.data.data[0].b64_json, 'base64')
    await admin.storage().bucket().file(`bookCovers/${bookId}.png`).save(coverBuffer, {
      metadata: {
        contentType: 'image/png',
      },
      predefinedAcl: 'publicRead'
    })

    // Store image thats on the server now into a url
    cover = admin.storage().bucket().file(`bookCovers/${bookId}.png`).publicUrl()
  }

  if (cover === '')
    return false

  const db = admin.firestore()
  const docRef = db.doc(`fables/visibility/private/${input.id}`)

  await docRef.update({
    coverImage: cover
  })

  return true
})

export default generateDelayedImage