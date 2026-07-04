//<!-- Done by Ayan Garai -->

document.addEventListener("DOMContentLoaded", () => {
    initializeChartInteractivity();
    initializeExportTriggers();
});

/**
 * Binds hover events to the simulated reporting graph columns
 */
function initializeChartInteractivity() {
    const charts = document.querySelectorAll(".bar");
    
    charts.forEach(bar => {
        bar.style.cursor = "pointer";
        
        bar.addEventListener("mouseenter", () => {
            bar.style.filter = "brightness(1.1)";
        });
        
        bar.addEventListener("mouseleave", () => {
            bar.style.filter = "brightness(1.0)";
        });
    });
}

/**
 * Attaches operational actions to the export extraction action items
 */
function initializeExportTriggers() {
    const exportButtons = document.querySelectorAll(".btn-primary");
    
    exportButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const reportTitle = btn.parentElement.querySelector("h3").innerText;
            btn.innerText = "Processing...";
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerText = "Generate Export";
                btn.disabled = false;
                alert(`Data extraction payload complete. Your requested raw file structure for "${reportTitle}" has been packaged and exported successfully.`);
            }, 1000);
        });
    });
}