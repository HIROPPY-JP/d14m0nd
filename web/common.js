// Firebaseのプログラムを読み込む
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-analytics.js";

// 設定情報
const firebaseConfig = {
    apiKey: "AIzaSyB4uKr8JjvWkwagqtGo6Nr5QKiGNzhBKrY",
    authDomain: "d14m0nd.firebaseapp.com",
    projectId: "d14m0nd",
    storageBucket: "d14m0nd.firebasestorage.app",
    messagingSenderId: "928444263353",
    appId: "1:928444263353:web:a1f9f4fdcaec83d916a468",
    measurementId: "G-80G94CEE0Z"
  };

// Firenaseの初期化
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
