import admin, { ServiceAccount } from 'firebase-admin'
import key from './serviceKey.json'

// NO TOCES

if (key) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(key as ServiceAccount),
    })
  } catch {
  }
}
  // if (!admin.apps.length) {
  //   app = admin.initializeApp({
  //     credential: admin.credential.cert(key as ServiceAccount),
  //   })
  //   console.log('app initialized')
  // } else {
  //   console.log('not initialized 1')
  // }
// } else {
//   console.log('not initialized 2')
// }

const adminDb = admin.firestore()
const adminAuth = admin.auth()

export { adminDb, adminAuth }