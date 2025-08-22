import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore'

// Check if environment variables are set
const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Check if any required environment variables are missing
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0) {
  console.warn('⚠️ Missing Firebase environment variables:', missingVars)
  console.warn('Please create a .env.local file with your Firebase configuration.')
  console.warn('See env.example for the required variables.')
}

// Your Firebase configuration
const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey || 'demo-api-key',
  authDomain: requiredEnvVars.authDomain || 'demo-project.firebaseapp.com',
  projectId: requiredEnvVars.projectId || 'demo-project',
  storageBucket: requiredEnvVars.storageBucket || 'demo-project.appspot.com',
  messagingSenderId: requiredEnvVars.messagingSenderId || '123456789',
  appId: requiredEnvVars.appId || 'demo-app-id',
}

// Initialize Firebase only if we have valid configuration
let app
let auth: Auth | null = null
let db: Firestore | null = null

try {
  app = initializeApp(firebaseConfig)
  
  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app)
  
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app)
  
  // Connect to emulators in development
  if (process.env.NODE_ENV === 'development') {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099')
      connectFirestoreEmulator(db, 'localhost', 8080)
    } catch (error) {
      console.log('Emulators already connected or not available')
    }
  }
} catch (error) {
  console.error('Failed to initialize Firebase:', error)
  
  // Create mock objects for development
  if (process.env.NODE_ENV === 'development') {
    console.warn('Using mock Firebase objects for development')
    auth = null
    db = null
  }
}

export { auth, db }
export default app
