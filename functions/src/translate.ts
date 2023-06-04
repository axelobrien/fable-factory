import * as functions from 'firebase-functions'
import { Translate } from '@google-cloud/translate/build/src/v2'
import TranslateRequest, { TranslateResponse } from '../types/translate'
require('dotenv').config()

const translateInstance = new Translate({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE_NAME
})

const translate = functions.https.onCall(async (data: TranslateRequest, context): Promise<TranslateResponse> => {
  console.log('translate called')
  try {
    const [translation] = await translateInstance.translate(
      [data.text], 
      {
        from: data.from, 
        to: data.to,
        format: 'text'
      }
    )

    if (!translation) {
      throw new Error('No response from Google Translate API')
    }

    return {
      status: 'ok',
      text: translation[0]
    }
  } catch (error) { 
    functions.logger.error('error', error)
    return {
      status: 'error',
      error: error
    }
  }
})

export default translate