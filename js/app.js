// Done by Pushkar Biring
// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. THEME MANAGEMENT (Dark Mode)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    
    // Check local storage for saved theme, otherwise use system preference
    const currentTheme = localStorage.getItem("theme");
    
    if (currentTheme === "dark") {
        document.body.classList.add("dark-theme");
    } else if (currentTheme === "light") {
        document.body.classList.remove("dark-theme");
    } else if (prefersDarkScheme.matches) {
        document.body.classList.add("dark-theme");
    }

    // Toggle logic (if you add a button with id 'theme-toggle' to your navbar later)
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme");
            
            let theme = "light";
            if (document.body.classList.contains("dark-theme")) {
                theme = "dark";
            }
            // Save preference
            localStorage.setItem("theme", theme);
        });
    }

    // ==========================================
    // 2. GLOBAL UTILITIES
    // ==========================================
    
    // A global function to format dates uniformly across the app
    window.formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Close buttons for global alerts/toasts
    const closeButtons = document.querySelectorAll('.alert-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const alertBox = e.target.closest('.alert');
            if (alertBox) {
                alertBox.style.opacity = '0';
                setTimeout(() => alertBox.remove(), 300);
            }
        });
    });
});