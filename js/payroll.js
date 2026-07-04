//<!-- Done by Ayan Garai -->

/**
 * Simulates generating and extracting a secure employee payslip document block
 * @param {string} cycleBlock - The month and year of the pay cycle (e.g., '2026-06')
 */
function downloadPDF(cycleBlock) {
    console.log(`Initializing document compilation payload for cycle: ${cycleBlock}`);
    
    // Find the button target that triggered the event to show a loading state
    const activeButton = event.target;
    const standardText = activeButton.innerText;
    
    // UI Feedback: Change button state during assembly
    activeButton.innerText = "Compiling PDF...";
    activeButton.disabled = true;
    activeButton.style.opacity = "0.6";

    // Simulate server rendering delay
    setTimeout(() => {
        activeButton.innerText = standardText;
        activeButton.disabled = false;
        activeButton.style.opacity = "1";
        
        alert(`Success! Payslip document archive [Slip_${cycleBlock}.pdf] has been prepared and downloaded securely to your local machine storage volume.`);
    }, 1200);
}