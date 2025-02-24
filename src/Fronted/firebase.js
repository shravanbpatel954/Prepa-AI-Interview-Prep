// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'; // Import signOut
import { getFirestore } from 'firebase/firestore'; // Import Firestore

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",            //firebase configuration
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

// Sign-in with Google
const signInWithGoogle = () => {
  return signInWithPopup(auth, provider) // Ensure this returns a promise
    .then((result) => {
      const user = result.user;
      console.log('User info:', user);
      // Handle user info here
    })
    .catch((error) => {
      console.error('Error during sign in:', error);
    });
};

// Sign-out function
const signOutUser = () => {
  return signOut(auth) // Ensure signOut returns a promise
    .then(() => {
      console.log('User signed out successfully');
    })
    .catch((error) => {
      console.error('Error during sign out:', error);
    });
  };
// Initialize Firestore and get a reference to the service
const db = getFirestore(app); // Add this line to initialize Firestore

export { signInWithGoogle, signOutUser, auth, db }; // Export db along with existing exports
