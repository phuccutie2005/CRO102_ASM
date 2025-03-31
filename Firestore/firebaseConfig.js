import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, createUserWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDeVmzRuBFnrv_H9REBJs-yrBbebzXGCzM",
    authDomain: "asm-cro102-abb7d.firebaseapp.com",
    projectId: "asm-cro102-abb7d",
    storageBucket: "asm-cro102-abb7d.appspot.com",
    messagingSenderId: "170843770861",
    appId: "1:170843770861:web:205f7cce68beae0c6ba1e4",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword, doc, setDoc };
