import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyBsNxr3ziIeVgJVLoOVwv0o-DSHWZv38VA",
    authDomain: "stupid-messaging.firebaseapp.com",
    databaseURL: "https://stupid-messaging-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "stupid-messaging",
    storageBucket: "stupid-messaging.appspot.com",
    messagingSenderId: "598015745391",
    appId: "1:598015745391:web:8cc22a1b70b8cf9229dc9a"
};
const app = initializeApp(firebaseConfig);
export default app;