// Done by Pushkar Biring
// js/sidebar.js

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const menuToggleBtn = document.getElementById('menu-toggle');
    
    // ==========================================
    // 1. MOBILE SIDEBAR TOGGLE
    // ==========================================
    
    // Create an overlay element for mobile
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    if (menuToggleBtn && sidebar) {
        // Toggle sidebar open
        menuToggleBtn.addEventListener('click', () => {
            sidebar.classList.add('show');
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });

        // Close sidebar when clicking the overlay
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

    // ==========================================
    // 2. ACTIVE LINK HIGHLIGHTING
    // ==========================================
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split("/").pop() || 'dashboard.html';

    // Remove active class from all items first
    navItems.forEach(item => {
        item.classList.remove('active');
        
        // Check if this link matches the current page
        const itemHref = item.getAttribute('href');
        if (itemHref === currentPage) {
            item.classList.add('active');
        }
    });

    // ==========================================
    // 3. ROLE-BASED VISIBILITY (Fallback)
    // ==========================================
    // Note: auth.js and dashboard.js handle primary role logic, 
    // but this ensures the UI doesn't flash restricted items.
    const userRole = localStorage.getItem('userRole'); // Assuming you save this on login
    
    if (userRole === 'employee') {
        const adminOnlyItems = document.querySelectorAll('.admin-only');
        adminOnlyItems.forEach(item => {
            item.style.display = 'none';
        });
    } else if (userRole === 'admin') {
        const adminOnlyItems = document.querySelectorAll('.admin-only');
        adminOnlyItems.forEach(item => {
            item.style.display = 'flex'; // Restore layout display
        });
    }
});