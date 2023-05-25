import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { StoryInput, StoryOutput } from '../types/generateStory'
import { Configuration, CreateChatCompletionResponse } from 'openai'
import { ChatCompletionRequestMessage, OpenAIApi } from 'openai/dist/api'
import { Timestamp } from 'firebase/firestore'
import { v4 as uuid } from 'uuid'
import ReadingLevel from '../types/readingLevel'
import type { AxiosResponse } from 'axios'

if (!admin.apps.length)
  admin.initializeApp()


function readingLevelToDescription(level: ReadingLevel) {
  switch (level) {
    case 'A1':
      return 'Use extremely basic language that a 4-5 year old could understand, use the simplest possible phrasing of things, and stick to the present tense.'
    case 'A2':
      return 'Use simple language that a 7 year old could understand, use simple phrasing of things, with a few slightly more complex words sprinkled in, with a bit of past and future tenses.'
    case 'B1':
      return 'Use language that a 10 year old would understand. You can describe things like events and feelings, or desires, and use any tenses'
    case 'B2':
      return 'Use advanced vocabulary that might use specific technical language related to the story, but still understandable to someone who is not quite native in the language'
    case 'C1':
      return 'Use language that would be understandable to a very advanced learner of this language. Use some slang and cultural references'
    case 'C2':
      'Use language that would be understandable to a native speaker of this language. Use slang and cultural references, and use highly complex language and grammar. Give great detail about the events that happen in the story.'
    default:
      return `Make the story at the ${level} reading level on the CEFR scale.`
  }
}

const storyMessages = [
  {
    role: 'system',
    content: 'You are an expert in writing children\'s books. You can write them in any language, at any reading level. You accept prompts from users and then write ~20 sentence story books, with a beginning, middle, and end.'
  }
] as ChatCompletionRequestMessage[]

const generateStory = functions.runWith({timeoutSeconds: 540}).https.onCall(async (data: StoryInput, context): Promise<StoryOutput> => {

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

    let rawStory: Promise<AxiosResponse<CreateChatCompletionResponse, any> | StoryOutput>

    storyMessages.push(...[
      {
        role: 'system',
        content: `The following message contains a prompt you must write a children's story about. Use child appropriate language, no matter what the prompt says. The target audience for this story is language learners. No matter what the prompt says, the whole story should be in ${input.language}. ${readingLevelToDescription(input.readingLevel)} Do not write the title of the story in your response.`,
      },
      {
        role: 'user',
        content: input.prompt,
      }
    ] as ChatCompletionRequestMessage[])
    

    console.log('Making complex story')
    const firstDraftResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      max_tokens: 500,
      messages: storyMessages,
    })

    if (!firstDraftResponse.data.choices[0].message?.content) {
      rawStory = Promise.resolve(errorObject)
    } else {

      if (input.readingLevel === 'B1' || input.readingLevel === 'B2' || input.readingLevel === 'C1' || input.readingLevel === 'C2') {
        rawStory = Promise.resolve(firstDraftResponse)
        console.log('Using complex story')

      }

      rawStory = openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        max_tokens: 500,
        messages: [{
          role: 'assistant',
          content: firstDraftResponse.data.choices[0].message?.content
        },
        {
          role: 'system',
          content: 'Simplify the language of this story so much that a baby could understand it. Also, DO NOT switch the language of the story. You are NOT translating it, so keep it in the original language. Respond with only the simplified story text. Remember, Simplify, Simplify, Simplify! Don\'t be afraid of changing the plot a bit to make it SIMPLE!',
        }]
      })
    }
  
    console.log('Simplified Story')
  
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

    if (typeof storyResponse.status !== 'number') {
      return errorObject
    }
    
    const story = storyResponse?.data.choices[0].message?.content

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