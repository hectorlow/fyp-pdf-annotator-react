// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBh9m3uyvbFcpxej3ej6NgJ_yEXg06_I78',
  authDomain: 'fypannotator.firebaseapp.com',
  projectId: 'fypannotator',
  storageBucket: 'fypannotator.appspot.com',
  messagingSenderId: '210118515291',
  appId: '1:210118515291:web:e0039b11e6d7e7a4997d7e',
  measurementId: 'G-ZBHZCD51HN',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;
