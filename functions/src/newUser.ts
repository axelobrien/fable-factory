import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { Timestamp } from 'firebase/firestore'

if (!admin.apps.length)
  admin.initializeApp()

const newUser = functions.auth.user().onCreate(async (user) => {
  const db = admin.firestore()

  const userDoc = db.collection('users').doc(user.uid)

  await userDoc.set({
    createdAt: Timestamp.now().seconds,
    uid: user.uid,
    accountIsSetup: false,
  })
})

export default newUser