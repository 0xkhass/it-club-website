// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Mock Firebase functions for development
const mockCollection = () => ({
  onSnapshot: () => () => {},
  getDocs: () => Promise.resolve({
    docs: [],
    forEach: () => {},
    size: 0,
    empty: true
  }),
  doc: () => mockDoc(),
  add: () => Promise.resolve({ id: 'mock-id' }),
  where: () => mockCollection()
});

const mockDoc = () => ({
  get: () => Promise.resolve({
    exists: () => false,
    data: () => ({}),
    id: 'mock-id'
  }),
  set: () => Promise.resolve(),
  update: () => Promise.resolve(),
  delete: () => Promise.resolve(),
  onSnapshot: () => () => {}
});

// Export mock functions
export const collection = (db, path) => {
  if (!db) return mockCollection();
  try {
    return require('firebase/firestore').collection(db, path);
  } catch {
    return mockCollection();
  }
};

export const doc = (db, path, id) => {
  if (!db) return mockDoc();
  try {
    return require('firebase/firestore').doc(db, path, id);
  } catch {
    return mockDoc();
  }
};

export const getDocs = (query) => {
  try {
    return require('firebase/firestore').getDocs(query);
  } catch {
    return Promise.resolve({
      docs: [],
      forEach: () => {},
      size: 0,
      empty: true
    });
  }
};

export const addDoc = (collection, data) => {
  try {
    return require('firebase/firestore').addDoc(collection, data);
  } catch {
    return Promise.resolve({ id: 'mock-id' });
  }
};

export const onSnapshot = (query, callback) => {
  try {
    return require('firebase/firestore').onSnapshot(query, callback);
  } catch {
    return () => {};
  }
};

export const query = (...args) => {
  try {
    return require('firebase/firestore').query(...args);
  } catch {
    return mockCollection();
  }
};

export const where = (...args) => {
  try {
    return require('firebase/firestore').where(...args);
  } catch {
    return {};
  }
};

export const getDoc = (docRef) => {
  try {
    return require('firebase/firestore').getDoc(docRef);
  } catch {
    return Promise.resolve({
      exists: () => false,
      data: () => ({}),
      id: 'mock-id'
    });
  }
};

export const updateDoc = (docRef, data) => {
  try {
    return require('firebase/firestore').updateDoc(docRef, data);
  } catch {
    return Promise.resolve();
  }
};

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-CZ6QLSE6Y4"
};

// Initialize Firebase
let app, firestore, auth, analytics, appCheck;

try {
  if (process.env.REACT_APP_FIREBASE_API_KEY) {
    app = initializeApp(firebaseConfig);
    firestore = getFirestore(app);
    auth = getAuth(app);
    // eslint-disable-next-line no-unused-vars
    analytics = getAnalytics(app);
    //Initialize app check
    // eslint-disable-next-line no-unused-vars
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(process.env.REACT_APP_RECAPTCH_SECERT_KEY),

      // Optional argument. If true, the SDK automatically refreshs App Check
      // tokens as needed.
      isTokenAutoRefreshEnabled: true
    });
  } else {
    throw new Error('Firebase config not available');
  }
} catch (error) {
  console.warn('Firebase initialization failed, using mock:', error.message);
  // Create mock objects for development
  firestore = {
    collection: () => ({
      onSnapshot: () => () => {},
      getDocs: () => Promise.resolve({
        docs: [],
        forEach: () => {},
        size: 0
      }),
      doc: () => ({
        get: () => Promise.resolve({
          exists: () => false,
          data: () => ({})
        }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve()
      }),
      add: () => Promise.resolve({ id: 'mock-id' })
    }),
    doc: () => ({
      get: () => Promise.resolve({
        exists: () => false,
        data: () => ({})
      }),
      set: () => Promise.resolve(),
      update: () => Promise.resolve()
    })
  };
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
    signInWithEmailAndPassword: () => Promise.resolve(),
    createUserWithEmailAndPassword: () => Promise.resolve(),
    signOut: () => Promise.resolve()
  };
}

export { firestore, auth };