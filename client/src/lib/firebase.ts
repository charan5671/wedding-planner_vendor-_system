import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Environment variables
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

export const isFirebaseConfigured = !!apiKey && !!projectId && apiKey !== 'YOUR_API_KEY_HERE';

if (!isFirebaseConfigured) {
    console.warn('Missing Firebase environment variables. Please check your .env file.');
}

const firebaseConfig = {
    apiKey: apiKey || 'placeholder',
    authDomain: authDomain || 'placeholder.firebaseapp.com',
    projectId: projectId || 'placeholder-project',
    storageBucket: storageBucket || 'placeholder.appspot.com',
    messagingSenderId: messagingSenderId || '0000000000',
    appId: appId || '1:0000000000:web:0000000000'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
