import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAYVItpBszucFNNovT2RWtKhGSfnqGyXOA",
  authDomain: "tic-tac-toe-c987d.firebaseapp.com",
  projectId: "tic-tac-toe-c987d",
  storageBucket: "tic-tac-toe-c987d.appspot.com",
  messagingSenderId: "574602904902",
  appId: "1:574602904902:web:369da32c9370ea68ca1147"
};

export const app = initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
