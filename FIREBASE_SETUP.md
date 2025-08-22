# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for your Tech Tour project.

## Prerequisites

- A Google account
- Node.js and npm installed
- Firebase CLI (optional, for emulator usage)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "tech-tour-silicon-valley")
4. Choose whether to enable Google Analytics (recommended)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project console, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click "Enable" and save
   - **Google**: Click "Enable", configure OAuth consent screen if needed, and save

## Step 3: Get Firebase Configuration

1. In your Firebase project console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "tech-tour-web")
6. Copy the Firebase configuration object

## Step 4: Configure Environment Variables

1. Create a `.env.local` file in your project root
2. Add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace the values with your actual Firebase configuration.

## Step 5: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/auth`

3. Try creating an account with email/password

4. Try signing in with Google

## Step 6: Optional - Firebase Emulator (Development)

For local development without affecting production data:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init emulators
   ```

4. Start the emulators:
   ```bash
   firebase emulators:start
   ```

The app will automatically connect to emulators when `NODE_ENV=development`.

## Features Included

- ✅ Email/Password authentication
- ✅ Google OAuth authentication
- ✅ User state management
- ✅ Protected routes (ready to implement)
- ✅ User profile management
- ✅ Password reset functionality
- ✅ Remember me functionality
- ✅ Loading states and error handling

## Security Rules

For production, make sure to:

1. Set up proper Firestore security rules
2. Configure authentication providers properly
3. Set up proper CORS settings
4. Use environment variables for sensitive data

## Troubleshooting

### Common Issues:

1. **"Firebase App named '[DEFAULT]' already exists"**
   - This is normal in development with hot reloading
   - The error is handled gracefully

2. **Google Sign-in not working**
   - Make sure Google provider is enabled in Firebase Console
   - Check that your domain is authorized

3. **Environment variables not loading**
   - Restart your development server after adding `.env.local`
   - Make sure variable names start with `NEXT_PUBLIC_`

4. **CORS errors**
   - Add your domain to authorized domains in Firebase Console
   - For local development, `localhost` should be automatically allowed

## Next Steps

After setting up authentication, you can:

1. Add protected routes using the `useAuthContext` hook
2. Implement user profile management
3. Add role-based access control
4. Set up Firestore for user data storage
5. Add email verification
6. Implement password reset functionality

## Support

If you encounter any issues:

1. Check the Firebase Console for error logs
2. Verify your environment variables are correct
3. Check the browser console for JavaScript errors
4. Ensure all dependencies are installed correctly
