// js/dashboard.js

import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    orderBy, 
    limit 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getCurrentUserData } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const adminDashboard = document.getElementById('admin-dashboard');
    const employeeDashboard = document.getElementById('employee-dashboard');
    const dateDisplay = document.getElementById('date-display');
    
    // Set today's date in the welcome banner
    if (dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = `Here is what's happening on ${new Date().toLocaleDateString('en-US', options)}.`;
    }

    // ==========================================
    // 1. AUTHENTICATION & ROLE ROUTING
    // ==========================================
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const userData = await getCurrentUserData(user.uid);
                
                if (userData) {
                    if (userData.role === 'admin') {
                        // Show Admin View
                        if (adminDashboard) adminDashboard.style.display = 'block';
                        if (employeeDashboard) employeeDashboard.style.display = 'none';
                        loadAdminData();
                    } else {
                        // Show Employee View
                        if (adminDashboard) adminDashboard.style.display = 'none';
                        if (employeeDashboard) employeeDashboard.style.display = 'block';
                        loadEmployeeData(user.uid);
                    }
                }
            } catch (error) {
                console.error("Error routing dashboard:", error);
            }
        }
    });

    // ==========================================
    // 2. ADMIN DASHBOARD LOGIC
    // ==========================================
    async function loadAdminData() {
        try {
            // A. Fetch Total Employees (Created by Person 1/2)
            const usersRef = collection(db, "users");
            const qEmployees = query(usersRef, where("role", "==", "employee"));
            const employeeSnapshot = await getDocs(qEmployees);
            document.getElementById('total-employees').textContent = employeeSnapshot.size || 0;

            // B. Fetch Pending Leaves (Collection to be created by Person 3)
            try {
                const leaveRef = collection(db, "leaveRequests");
                const qPending = query(leaveRef, where("status", "==", "Pending"));
                const leaveSnapshot = await getDocs(qPending);
                document.getElementById('pending-leaves').textContent = leaveSnapshot.size || 0;
                
                // Populate Leave Table
                const leaveTable = document.getElementById('admin-leave-table');
                if (leaveSnapshot.empty) {
                    leaveTable.innerHTML = `<tr><td colspan="4" class="text-muted text-center">No pending requests</td></tr>`;
                } else {
                    leaveTable.innerHTML = ''; // Clear loading state
                    let count = 0;
                    leaveSnapshot.forEach((doc) => {
                        if (count >= 5) return; // Show only top 5
                        const data = doc.data();
                        leaveTable.innerHTML += `
                            <tr>
                                <td><strong>${data.employeeName || 'Unknown'}</strong></td>
                                <td>${data.type || 'Standard'}</td>
                                <td><span class="badge" style="background-color: var(--warning)">Pending</span></td>
                                <td><a href="leave.html" class="btn btn-outline" style="padding: 4px 8px; font-size: 12px;">Review</a></td>
                            </tr>
                        `;
                        count++;
                    });
                }
            } catch (e) {
                console.log("Leave collection not ready yet. (Waiting for Person 3)");
                document.getElementById('pending-leaves').textContent = "0";
            }

            // C. Fetch Present Today (Collection to be created by Person 3)
            try {
                const today = new Date().toISOString().split('T')[0];
                const attendanceRef = collection(db, "attendance");
                const qPresent = query(attendanceRef, where("date", "==", today), where("status", "==", "Present"));
                const presentSnapshot = await getDocs(qPresent);
                document.getElementById('present-today').textContent = presentSnapshot.size || 0;
            } catch (e) {
                console.log("Attendance collection not ready yet. (Waiting for Person 3)");
                document.getElementById('present-today').textContent = "0";
            }

        } catch (error) {
            console.error("Error loading admin data:", error);
        }
    }

    // ==========================================
    // 3. EMPLOYEE DASHBOARD LOGIC
    // ==========================================
    async function loadEmployeeData(uid) {
        try {
            // A. Fetch Today's Attendance Status (Waiting for Person 3)
            try {
                const today = new Date().toISOString().split('T')[0];
                const attendanceRef = collection(db, "attendance");
                const qMyAttendance = query(attendanceRef, where("uid", "==", uid), where("date", "==", today));
                const attSnapshot = await getDocs(qMyAttendance);
                
                const statusEl = document.getElementById('emp-today-status');
                if (!attSnapshot.empty) {
                    const myAtt = attSnapshot.docs[0].data();
                    statusEl.textContent = myAtt.status || "Present";
                    statusEl.style.color = "var(--secondary)";
                } else {
                    statusEl.textContent = "Not Checked In";
                }
            } catch (e) {
                console.log("Employee attendance logic standing by.");
            }

            // B. Fetch Leave Balance (Waiting for Person 3/4)
            try {
                const userDocRef = doc(db, "users", uid);
                // Assume leaveBalance is a field stored on the user document for quick access
                // Alternatively, query a specific balances collection
                document.getElementById('emp-leave-balance').textContent = "12 Days"; // Placeholder until integrated
            } catch (e) {
                console.log("Employee leave balance logic standing by.");
            }

            // C. Populate Recent Activity
            const activityList = document.getElementById('emp-activity-list');
            activityList.innerHTML = `
                <li>
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--secondary); margin-top: 6px;"></div>
                    <div>
                        <strong>System Login</strong>
                        <div class="text-muted" style="font-size: 12px;">Welcome to the new HRMS dashboard.</div>
                    </div>
                </li>
                <li>
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--primary); margin-top: 6px;"></div>
                    <div>
                        <strong>Profile Activated</strong>
                        <div class="text-muted" style="font-size: 12px;">Your employee account has been successfully set up.</div>
                    </div>
                </li>
            `;
            
        } catch (error) {
            console.error("Error loading employee data:", error);
        }
    }
});