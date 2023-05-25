import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

let firebaseConfig = {
  apiKey: "AIzaSyDwqQcBJONnDYJlnkg--PGb6ehTbCasNcE",
  authDomain: "fable-factory-3ab69.firebaseapp.com",
  projectId: "fable-factory-3ab69",
  storageBucket: "fable-factory-3ab69.appspot.com",
  messagingSenderId: "817715939458",
  appId: "1:817715939458:web:45e7b26b6d74fd62720c9b",
  measurementId: "G-Z0CWRZB0K6"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const functions = getFunctions(app, "us-central1")

// Turn off for production

function connectEmulators(host: string) {
  connectAuthEmulator(auth, `http://${host}:9099`, {disableWarnings: true})
  connectFirestoreEmulator(db, host, 8080)
  connectFunctionsEmulator(functions, host, 5001)
}

function turnOnEmulators() {
  if (typeof window === 'undefined') {
    return
  }
  switch (window.location.hostname) {
    case 'localhost':
      connectEmulators('localhost')
      break
    case '127.0.0.1':
      connectEmulators('127.0.0.1')
      break
    case '192.168.0.5':
      connectEmulators('192.168.0.5')
      break
    default:
      break
  }
}

// turnOnEmulators()

export { firebaseConfig, app, auth, db, functions }