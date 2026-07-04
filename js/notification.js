//<!-- Done by Ayan Garai -->

/**
 * Dispatches an instant workspace notification toast window container
 * @param {string} type - 'info' | 'warning' | 'announcement'
 * @param {string} title - The main heading phrase
 * @param {string} text - The context detail block
 */
function spawnToastAlert(type, title, text) {
    // 1. Locate or dynamically generate a floating layout layout layer on screen
    let stack = document.querySelector(".toast-floating-wrapper");
    if (!stack) {
        stack = document.createElement("div");
        stack.className = "toast-floating-wrapper";
        stack.style.position = "fixed";
        stack.style.bottom = "24px";
        stack.style.right = "24px";
        stack.style.display = "flex";
        stack.style.flexDirection = "column";
        stack.style.gap = "12px";
        stack.style.zIndex = "9999";
        document.body.appendChild(stack);
    }

    // 2. Build out the standalone inner notification capsule container
    const toast = document.createElement("div");
    toast.className = `alert-block alert-${type}`;
    toast.style.width = "350px";
    toast.style.animation = "slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards";
    toast.style.boxShadow = "var(--shadow-md)";
    
    // Inject standard design structure matching your notifications markup styles
    toast.innerHTML = `
        <div class="alert-content-wrapper" style="padding-right: 12px;">
            <h4>${title}</h4>
            <p>${text}</p>
            <span class="alert-timestamp">Just now</span>
        </div>
        <button class="close-toast-btn" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:16px; font-weight:bold; position:absolute; top:12px; right:12px;">&times;</button>
    `;

    // 3. Attach functional dismiss trigger bindings
    const closeBtn = toast.querySelector(".close-toast-btn");
    closeBtn.addEventListener("click", () => dismissToast(toast));

    // 4. Append to system array framework view stack
    stack.appendChild(toast);

    // 5. Hard self-destruction expiration hook after 6 seconds of uptime visibility
    setTimeout(() => {
        if (toast.parentElement) dismissToast(toast);
    }, 6000);
}

function dismissToast(toastTarget) {
    toastTarget.style.opacity = "0";
    toastTarget.style.transform = "translateX(50px)";
    toastTarget.style.transition = "all 0.3s ease";
    
    setTimeout(() => {
        if (toastTarget.parentElement) {
            toastTarget.remove();
        }
    }, 300);
}

// Global custom keyframe slide initialization helper injection
const styleSheet = document.createElement("style");
styleSheet.innerText = `@keyframes slideIn { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }`;
document.head.appendChild(styleSheet);