// Done by Pushkar Biring
// js/navbar.js

import { auth } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getCurrentUserData } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const navUserName = document.getElementById('nav-user-name');
    const navUserRole = document.getElementById('nav-user-role');
    const navAvatarInitials = document.getElementById('nav-avatar-initials');
    const notificationBtn = document.querySelector('.notification-btn');
    
    // ==========================================
    // 1. DYNAMIC USER PROFILE LOADING
    // ==========================================
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                // Fetch the extra user details (like full name and role) from Firestore
                const userData = await getCurrentUserData(user.uid);
                
                if (userData) {
                    // Update Name
                    if (navUserName) {
                        navUserName.textContent = userData.fullName || "User";
                    }
                    
                    // Update Role (Capitalize first letter)
                    if (navUserRole) {
                        const role = userData.role || "employee";
                        navUserRole.textContent = role.charAt(0).toUpperCase() + role.slice(1);
                        
                        // Save role to local storage for quick UI checks (like sidebar)
                        localStorage.setItem('userRole', role);
                    }
                    
                    // Generate Avatar Initials (e.g., "John Doe" -> "JD")
                    if (navAvatarInitials && userData.fullName) {
                        const nameParts = userData.fullName.split(' ');
                        let initials = nameParts[0].charAt(0).toUpperCase();
                        if (nameParts.length > 1) {
                            initials += nameParts[nameParts.length - 1].charAt(0).toUpperCase();
                        }
                        navAvatarInitials.textContent = initials;
                    }
                }
            } catch (error) {
                console.error("Error loading profile in navbar:", error);
                if (navUserName) navUserName.textContent = "Error Loading";
            }
        }
    });

    // ==========================================
    // 2. NOTIFICATION BUTTON INTERACTION
    // ==========================================
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            // Person 4 will build out the full notification system, 
            // so we just add a simple placeholder interaction for now.
            alert("You have 3 unread notifications. (Notification center coming soon!)");
        });
    }
    
    // ==========================================
    // 3. PROFILE DROPDOWN (Optional Placeholder)
    // ==========================================
    const userProfileArea = document.querySelector('.user-profile');
    if (userProfileArea) {
        userProfileArea.addEventListener('click', () => {
            // This is where you could toggle a small profile dropdown menu
            // For now, it just acts as a clickable area ready for future expansion.
            console.log("Profile clicked");
        });
    }
});