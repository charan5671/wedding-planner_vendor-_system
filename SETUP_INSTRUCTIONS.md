# Environment Setup Instructions

## Firebase Configuration Required

The website now uses Firebase for authentication and database. Follow these steps:

### 1. Create a `.env` file

Create (or update) the `.env` file in the `client` directory with the following content:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 2. Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or select existing)
3. Registers a web app (`</>`)
4. Copy the `firebaseConfig` values into your `.env` file

### 3. Enable Authentication

1. Go to **Authentication** -> **Sign-in method**
2. Enable **Email/Password**

### 4. Create Cloud Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **Test mode** (for development)
4. Create the following collections:
    - `users`
    - `vendors`
    - `services`
    - `bookings`

### 5. Restart the Development Server

```bash
npm run dev
```

## Current Status

⚠️ **Action Required**: Add Firebase credentials to `.env` file
