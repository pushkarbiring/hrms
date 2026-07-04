//<!-- Done by Ayan Garai -->

document.addEventListener("DOMContentLoaded", () => {
    // Auto-formatting values right out of the data metrics profile fields text nodes
    const employeeTokenElement = document.querySelector(".detail-cell:nth-child(2) p");
    
    if (employeeTokenElement) {
        employeeTokenElement.addEventListener("click", () => {
            const rawToken = employeeTokenElement.innerText;
            
            // Clipboard interface interaction utility API layer
            navigator.clipboard.writeText(rawToken)
                .then(() => {
                    alert(`Copied ID signature string: "${rawToken}" directly to local device clipboard registry.`);
                })
                .catch(err => {
                    console.error("Clipboard operational interface execution failure:", err);
                });
        });
        
        employeeTokenElement.style.cursor = "copy";
        employeeTokenElement.title = "Click grid selection layout to replicate ID values";
    }
});