import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCg2EZFe5wewBc7CRWurmDWEQq0f35_y0k",
  authDomain: "roopet-354e3.firebaseapp.com",
  projectId: "roopet-354e3",
  storageBucket: "roopet-354e3.firebasestorage.app",
  messagingSenderId: "322240264569",
  appId: "1:322240264569:web:030cb418ec2d7c490f57a8",
  measurementId: "G-SSSVSMEEEQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional - can be removed if not needed)
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.log('Analytics not available:', error);
}

// Initialize Firestore
export const db = getFirestore(app);

export default app; 