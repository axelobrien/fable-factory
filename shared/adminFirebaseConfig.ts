import admin from 'firebase-admin'

const key = require('../misc/serviceKey.json')

if (key) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(key),
    })
  }
}

const adminDb = admin.firestore()

export { adminDb }