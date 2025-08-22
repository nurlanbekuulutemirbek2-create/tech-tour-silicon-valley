import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore'
import { getAnalytics, Analytics } from 'firebase/analytics'

// Check if environment variables are set
const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Check if any required environment variables are missing
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value && key !== 'measurementId') // measurementId is optional
  .map(([key]) => key)

if (missingVars.length > 0) {
  console.warn('⚠️ Missing Firebase environment variables:', missingVars)
  console.warn('Please create a .env.local file with your Firebase configuration.')
  console.warn('See env.example for the required variables.')
}

// Your Firebase configuration
const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey || 'AIzaSyBsEYZX_bChp09DimURsak2dsmPR1_6opM',
  authDomain: requiredEnvVars.authDomain || 'verifyme-1c6b2.firebaseapp.com',
  projectId: requiredEnvVars.projectId || 'verifyme-1c6b2',
  storageBucket: requiredEnvVars.storageBucket || 'verifyme-1c6b2.firebasestorage.app',
  messagingSenderId: requiredEnvVars.messagingSenderId || '674821868466',
  appId: requiredEnvVars.appId || '1:674821868466:web:33757c0d84db1bdf3732ab',
  measurementId: requiredEnvVars.measurementId || 'G-7RQ1TQF9XS',
}

// Initialize Firebase only if we have valid configuration
let app
let auth: Auth | null = null
let db: Firestore | null = null
let analytics: Analytics | null = null

try {
  app = initializeApp(firebaseConfig)
  
  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app)
  
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app)
  
  // Initialize Analytics (only in browser environment)
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app)
    } catch (error) {
      console.log('Analytics not available:', error)
    }
  }
  
  // Only connect to emulators if explicitly enabled via environment variable
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099')
      connectFirestoreEmulator(db, 'localhost', 8080)
      console.log('Connected to Firebase emulators')
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
    analytics = null
  }
}

export { auth, db, analytics }
export default app
