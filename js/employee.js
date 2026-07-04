// <!-- Done by Jarif Rahaman -->

import { db } from './firebase.js';
import { collection, getDocs, doc, getDoc, updateDoc, query, where, limit } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// DB is imported from firebase.js
// === EMPLOYEES.HTML LOGIC ===
if (window.location.pathname.includes('employees.html')) {
    
    // 1. Fetch & Render Departments for Filter
    async function loadDepartments() {
        const deptFilter = document.getElementById('departmentFilter');
        const querySnapshot = await getDocs(collection(db, "departments"));
        querySnapshot.forEach((doc) => {
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = doc.data().name;
            deptFilter.appendChild(option);
        });
    }

    // 2. Fetch & Render Employees
    async function loadEmployees(searchTerm = "", department = "all") {
        const tableBody = document.getElementById('employeeTableBody');
        tableBody.innerHTML = ""; // Clear existing
        
        // Note: In production, use Firestore pagination (startAfter)
        const q = query(collection(db, "employees"), limit(10));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((docSnap) => {
            const emp = docSnap.data();
            
            // Simple front-end filtering for demo purposes
            if (department !== "all" && emp.departmentId !== department) return;
            if (searchTerm && !emp.name.toLowerCase().includes(searchTerm.toLowerCase())) return;

            const row = `<tr>
                <td><img src="${emp.profilePic || 'default-avatar.png'}" width="40" height="40" style="border-radius:50%;"></td>
                <td>${emp.name}</td>
                <td>${emp.departmentName}</td>
                <td>${emp.role}</td>
                <td><a href="employee-profile.html?id=${docSnap.id}">View Profile</a></td>
            </tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    }

    // Event Listeners
    document.getElementById('searchBtn').addEventListener('click', () => {
        const term = document.getElementById('searchInput').value;
        const dept = document.getElementById('departmentFilter').value;
        loadEmployees(term, dept);
    });

    // Initialization
    loadDepartments();
    loadEmployees();
}


// === EMPLOYEE-PROFILE.HTML LOGIC ===
if (window.location.pathname.includes('employee-profile.html')) {
    
    // Simulate getting the currently logged-in user's role (Admin vs Employee)
    const currentUserRole = "Employee"; // Replace with actual auth check
    
    // Get Employee ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const empId = urlParams.get('id');

    async function loadProfile() {
        if (!empId) return console.error("No employee ID provided.");
        
        const docRef = doc(db, "employees", empId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Populate Fields
            document.getElementById('empName').value = data.name || "";
            document.getElementById('empAddress').value = data.address || "";
            document.getElementById('empPhone').value = data.phone || "";
            document.getElementById('empSkills').value = data.skills || "";
            document.getElementById('empExperience').value = data.experience || "";
            document.getElementById('empEmergency').value = data.emergencyContact || "";
            if (data.profilePic) document.getElementById('profilePicDisplay').src = data.profilePic;

            applyRoleBasedPermissions();
        }
    }

    function applyRoleBasedPermissions() {
        // PDF Rule: Employees can edit limited fields (address, phone, profile picture). Admin can edit all.
        if (currentUserRole === "Employee") {
            document.getElementById('empSkills').disabled = true;
            document.getElementById('empExperience').disabled = true;
            // Name and Dept are disabled by default in HTML
        } else if (currentUserRole === "Admin") {
            // Admin can edit everything
            document.querySelectorAll('input, select').forEach(el => el.disabled = false);
        }
    }

    // Handle form submission
    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const updatedData = {
            address: document.getElementById('empAddress').value,
            phone: document.getElementById('empPhone').value,
            emergencyContact: document.getElementById('empEmergency').value,
        };

        // If admin, they can save restricted fields too
        if (currentUserRole === "Admin") {
            updatedData.name = document.getElementById('empName').value;
            updatedData.skills = document.getElementById('empSkills').value;
            updatedData.experience = document.getElementById('empExperience').value;
        }

        try {
            const docRef = doc(db, "employees", empId);
            await updateDoc(docRef, updatedData);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    });

    loadProfile();
}