// Done by Pushkar Biring
// js/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

// Import your configuration keys from config.js
import { firebaseConfig } from "./config.js";

// 1. Initialize the Firebase App
const app = initializeApp(firebaseConfig);

// 2. Initialize Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Optional: Log to ensure it connected (you can remove this before final deployment)
console.log("Firebase App initialized successfully.");

// 3. Export the services so auth.js, dashboard.js, and your teammates' files can use them
export { auth, db, storage };