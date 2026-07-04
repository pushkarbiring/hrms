//<!-- Done by Ayan Garai -->

document.addEventListener("DOMContentLoaded", () => {
    initializeThemeConfiguration();
    initializeSecurityFormProcessor();
});

/**
 * Tracks the dashboard theme sliding switch toggle framework
 */
function initializeThemeConfiguration() {
    const darkSwitch = document.getElementById("themeToggle");
    if (!darkSwitch) return;

    // Evaluate local configuration caches on page load
    const cachedTheme = localStorage.getItem("workspace-dark-theme-active");
    if (cachedTheme === "true") {
        darkSwitch.checked = true;
        document.body.classList.add("dark-mode-override-layer");
    }

    darkSwitch.addEventListener("change", (e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            document.body.classList.add("dark-mode-override-layer");
            localStorage.setItem("workspace-dark-theme-active", "true");
            console.log("Global workspace container theme property systematically altered: DARK");
        } else {
            document.body.classList.remove("dark-mode-override-layer");
            localStorage.setItem("workspace-dark-theme-active", "false");
            console.log("Global workspace container theme property systematically altered: LIGHT");
        }
    });
}

/**
 * Performs functional form data validations on access entry strings
 */
function initializeSecurityFormProcessor() {
    const submitBtn = document.querySelector(".btn-primary");
    if (!submitBtn) return;

    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
        const currentKey = document.getElementById("currentPassword").value;
        const newKey = document.getElementById("newPassword").value;

        // Validation constraint gates evaluation
        if (!currentKey || !newKey) {
            alert("Error: All text field modules are fully mandatory.");
            return;
        }

        if (newKey.length < 8) {
            alert("Security Error: The provided password string fails complexity metrics (Minimum length: 8 characters).");
            return;
        }

        submitBtn.innerText = "Saving Values...";
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerText = "Update Security Values";
            submitBtn.disabled = false;
            
            // Wipe forms out clean on positive operational feedback returns
            document.getElementById("currentPassword").value = "";
            document.getElementById("newPassword").value = "";
            
            alert("System Success: Core authentication credentials changed inside global user indexing blocks.");
        }, 1000);
    });
}