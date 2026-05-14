const firebaseConfig = {
    apiKey: "AIzaSyBL4Nka91iGIAWSTfvAmsqDHCj2KMhWZ70",
    authDomain: "sentinela-ops-profissional.firebaseapp.com",
    projectId: "sentinela-ops-profissional",
    storageBucket: "sentinela-ops-profissional.firebasestorage.app",
    messagingSenderId: "458111218365",
    appId: "1:458111218365:web:0f3b41ab7c2ceb7feebdd4"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const fs = firebase.firestore();
