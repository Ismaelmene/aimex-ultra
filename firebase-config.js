// Substitua pelos dados do SEU projeto Firebase (Configurações do projeto > Seus apps > SDK setup)
const firebaseConfig = {
  apiKey: "AIzaSyCJ_gtgDDXgJnZbVicQSveyyBWtE4xClKM",
  authDomain: "aimexultra.firebaseapp.com",
  projectId: "aimexultra",
  storageBucket: "aimexultra.firebasestorage.app",
  messagingSenderId: "1012765024635",
  appId: "1:1012765024635:web:a21b2ebf611352496b5dde"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
