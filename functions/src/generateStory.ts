import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { StoryInput, StoryOutput } from '../types/generateStory'
import { Configuration } from 'openai'
import { OpenAIApi } from 'openai/dist/api'
import { Timestamp } from 'firebase/firestore'
import { v4 as uuid } from 'uuid'

if (!admin.apps.length)
  admin.initializeApp()

const generateStory = functions.runWith({timeoutSeconds: 300}).https.onCall(async (data: StoryInput, context): Promise<StoryOutput> => {

  const errorObject = {
    status: 'error',
    coverImage: '',
    language: '',
    readingLevel: 'A1',
    story: '',
    title: '',
    id: '',
    visibility: 'private',
  } as StoryOutput

  // const uid = context.auth?.uid

  // if (!uid) {
  //   return errorObject
  // }

  const openaiConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  })

  const openai = new OpenAIApi(openaiConfig)

  function validateInput(input: StoryInput): input is StoryInput {
    const readingLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    return (
      input &&
      typeof input.prompt === 'string' &&
      input.prompt.length > 10 &&
      input.prompt.length < 300 &&
      typeof input.language === 'string' &&
      readingLevels.indexOf(input.readingLevel) !== -1
    )
  }

  if (!validateInput(data))
    return errorObject 

  const input: StoryInput = {
    prompt: data.prompt,
    language: data.language,
    readingLevel: data.readingLevel
  }
  
  async function getStoryAndCover() {
    const rawStory = openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content: 'You are an expert in writing children\'s books. You can write them in any language, at any reading level. You accept prompts from users and then write ~20 sentence story books, with a beginning, middle, and end.'
        },
        {
          role: 'system',
          content: `The following message contains a prompt you must write a children's story about. Use child appropriate language, no matter what the prompt says. The target audience for this story is language learners. No matter what the prompt says, the whole story should be in ${input.language}. Write it at the ${input.readingLevel} level. Do not write the title of the story in your response.`,
        },
        {
          role: 'user',
          content: input.prompt,
        }
      ]
    })
  
    const rawCover = openai.createImage({
      prompt: `${input.prompt}, digital art, book cover, NO TEXT, NO TEXT`,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json'
    })

    return Promise.all([rawStory, rawCover])
  }

  try {
    // Generate story
    const [storyResponse, coverResponse] = await getStoryAndCover()
    
    const story = storyResponse.data.choices[0].message?.content

    if (!story)
      return errorObject

    let cover = ''

    if (coverResponse.data.data[0].b64_json) {
      const bookId = uuid()
      const coverBuffer = Buffer.from(coverResponse.data.data[0].b64_json, 'base64')
      await admin.storage().bucket().file(`bookCovers/${bookId}.png`).save(coverBuffer, {
        metadata: {
          contentType: 'image/png',
        },
        predefinedAcl: 'publicRead'
      })

      // Store image thats on the server now into a url
      cover = admin.storage().bucket().file(`bookCovers/${bookId}.png`).publicUrl()
    }

    const output: StoryOutput = {
      readingLevel: input.readingLevel,
      language: input.language,
      coverImage: cover,
      status: 'success',
      story: story,
      title: '',
      id: '',
      visibility: 'private',
      createdAt: new Timestamp(0, 0),
    }

    // Generate title using story as input
    const titleResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      max_tokens: 20,
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: `The following prompt contains a children\'s story. Give it a title, make sure it is child appropriate, in the ${input.language} language, and short. Bonus points if you can make it rhyme or have an alliteration. Only give one title, and only respond with the title text, nothing else`
        },
        {
          role: 'user',
          content: story
        }
      ]
    })

    const title = titleResponse.data.choices[0].message?.content

    if (title)
      output.title = title
    
    // Put generated story into firebase
    const db = admin.firestore()
    const docRef = db.collection('fables/visibility/private').doc()

    output.id = docRef.id
    const firebaseResponse = await docRef.set({
      ...output,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    if (firebaseResponse)
      return output
    else
      throw new Error('Error writing to database')
  
  } catch (error) {
    console.log(error)
    // @ts-ignore
    console.log(`\n\n\n\n\n\n\n\n${error?.data?.error}\n\n\n\n\n\n\n\n`)
  }
  return errorObject
})

export default generateStory