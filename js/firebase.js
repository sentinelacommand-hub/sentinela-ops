const firebaseConfig = {
    apiKey: "AIzaSyAZrRyQMMAGAObNh2KJ1RLAOfX2WeLsLlk",
    authDomain: "sentinela-rondas.firebaseapp.com",
    projectId: "sentinela-rondas",
    storageBucket: "sentinela-rondas.firebasestorage.app",
    messagingSenderId: "1096269314220",
    appId: "1:1096269314220:web:8b8dfe4f7db12c56fb8709"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const fs = firebase.firestore();