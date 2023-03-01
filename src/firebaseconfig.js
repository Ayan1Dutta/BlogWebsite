import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
const firebaseConfig = {
    apiKey: "AIzaSyA3NnQIx9j-I6w9VTR9VunHfD5F8hIoKoA",
    authDomain: "videoblog-eaf53.firebaseapp.com",
    databaseURL: "https://videoblog-eaf53-default-rtdb.firebaseio.com",
    projectId: "videoblog-eaf53",
    storageBucket: "videoblog-eaf53.appspot.com",
    messagingSenderId: "867811269476",
    appId: "1:867811269476:web:73faa8182b63e799ab7871",
    measurementId: "G-SN2MFVH3YN"
};
export const app=initializeApp(firebaseConfig);
export const firebaseAuth=getAuth(app);
export const db=getFirestore(app);


