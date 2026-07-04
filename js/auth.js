// Done by Pushkar Biring
// js/auth.js

import { auth, db } from './firebase.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { 
    doc, 
    setDoc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Helper function to handle button loading states
const setButtonLoading = (btnId, isLoading) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    
    const textSpan = btn.querySelector('#btn-text');
    const loaderSpan = btn.querySelector('#btn-loader');
    
    if (isLoading) {
        btn.disabled = true;
        textSpan.style.display = 'none';
        loaderSpan.style.display = 'inline-block';
    } else {
        btn.disabled = false;
        textSpan.style.display = 'inline-block';
        loaderSpan.style.display = 'none';
    }
};

// Helper function to extract current page name
const getCurrentPage = () => {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    return page || 'index.html'; // default to index if root
};

console.log("Auth.js is loading!");
const currentPage = getCurrentPage();
console.log("Current page identified as:", currentPage);

// ==========================================
// 1. SESSION MANAGEMENT (Runs on all pages)
// ==========================================
onAuthStateChanged(auth, async (user) => {
    const isAuthPage = ['index.html', 'register.html', 'forgot-password.html'].includes(currentPage);
    console.log("Auth state changed. User:", user ? user.email : "none");
    
    if (user) {
        // User is signed in.
        if (isAuthPage) {
            // Prevent logged-in users from seeing auth pages
            window.location.href = 'dashboard.html';
        }
    } else {
        // User is signed out.
        if (!isAuthPage) {
            // Protect secure routes like the dashboard
            window.location.href = 'index.html';
        }
    }
});

// ==========================================
// 2. SIGN IN LOGIC (index.html)
// ==========================================
if (currentPage === 'index.html' || currentPage === '') {
    const loginForm = document.getElementById('login-form');
    console.log("Login form found:", !!loginForm);
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Login form submitted");
            setButtonLoading('login-btn', true);
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            try {
                await signInWithEmailAndPassword(auth, email, password);
                // onAuthStateChanged will handle the redirect
            } catch (error) {
                console.error("Login Error:", error);
                alert(`Login failed: ${error.message}`);
                setButtonLoading('login-btn', false);
            }
        });
    }
}

// ==========================================
// 3. REGISTRATION LOGIC (register.html)
// ==========================================
if (currentPage === 'register.html') {
    const registerForm = document.getElementById('register-form');
    console.log("Register form found:", !!registerForm);
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Register form submitted");
            setButtonLoading('register-btn', true);
            
            const fullName = document.getElementById('fullName').value.trim();
            const empId = document.getElementById('empId').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            
            try {
                // 1. Create the user in Firebase Auth
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log("User created in Auth:", user.uid);
                
                // 2. Store additional user data (role, name) in Firestore
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    fullName: fullName,
                    empId: empId,
                    email: email,
                    role: role,
                    createdAt: new Date().toISOString()
                });
                console.log("User saved in Firestore");
                
                // onAuthStateChanged will handle the redirect to dashboard
            } catch (error) {
                console.error("Registration Error:", error);
                alert(`Registration failed: ${error.message}`);
                setButtonLoading('register-btn', false);
            }
        });
    }
}

// ==========================================
// 4. PASSWORD RESET LOGIC (forgot-password.html)
// ==========================================
if (currentPage === 'forgot-password.html') {
    const forgotForm = document.getElementById('forgot-password-form');
    
    if (forgotForm) {
        forgotForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            setButtonLoading('reset-btn', true);
            
            const email = document.getElementById('email').value.trim();
            
            try {
                await sendPasswordResetEmail(auth, email);
                alert("Password reset link sent! Check your inbox.");
                window.location.href = 'index.html';
            } catch (error) {
                console.error("Reset Error:", error);
                alert(`Failed to send reset link: ${error.message}`);
                setButtonLoading('reset-btn', false);
            }
        });
    }
}

// ==========================================
// 5. LOGOUT LOGIC (dashboard.html / any secure page)
// ==========================================
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            // onAuthStateChanged will handle the redirect to index.html
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Failed to log out.");
        }
    });
}

// Export helper for other files (like dashboard.js) to quickly get current user data
export const getCurrentUserData = async (uid) => {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.error("No such user document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};