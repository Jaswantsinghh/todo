// Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";
import { ENVIRONMENT } from "@/constants";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: ENVIRONMENT.FIREBASE_API_KEY,
  authDomain: ENVIRONMENT.FIREBASE_AUTH_DOMAIN,
  projectId: ENVIRONMENT.FIREBASE_PROJECT_ID,
  storageBucket: ENVIRONMENT.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENVIRONMENT.FIREBASE_MEASUREMENT_ID,
  appId: ENVIRONMENT.FIREBASE_APP_ID,
  measurementId: ENVIRONMENT.FIREBASE_MEASUREMENT_ID,
  databaseURL: ENVIRONMENT.FIREBASE_DB_URI
};
