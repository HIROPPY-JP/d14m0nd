// Firebaseのプログラムを読み込む
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-analytics.js";

// 設定情報
const firebaseConfig = {
  apiKey: "AIzaSyBlAodi_xUgnJf2peykEMsgni8HhIGBwi0",
  authDomain: "d114m0nd.firebaseapp.com",
  projectId: "d114m0nd",
  storageBucket: "d114m0nd.firebasestorage.app",
  messagingSenderId: "275461877904",
  appId: "1:275461877904:web:0466e477d3ee854cdde815",
  measurementId: "G-29NWM6QGNJ"
};

// Firenaseの初期化
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
