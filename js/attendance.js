/* js/attendance.js */

document.addEventListener("DOMContentLoaded", () => {
    initializePunchClock();
});

/**
 * Attaches functional logic to the Virtual Shift Terminal button wrapper
 */
function initializePunchClock() {
    const punchBtn = document.querySelector(".punch-panel .btn-primary");
    if (!punchBtn) return;

    let isClockedIn = false;
    let startTime = null;

    punchBtn.addEventListener("click", () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateString = now.toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' });

        if (!isClockedIn) {
            // User clocks in
            isClockedIn = true;
            startTime = now;
            punchBtn.innerText = "Clock Out Shift Entry";
            punchBtn.style.backgroundColor = "var(--danger)"; // Turn button red on hover state shifts
            
            alert(`Shift started! Clocked in successfully at ${timeString}.`);
        } else {
            // User clocks out
            isClockedIn = false;
            punchBtn.innerText = "Clock In Shift Entry";
            punchBtn.style.backgroundColor = "var(--primary)"; // Reset to indigo token
            
            // Calculate total tracked hours for this specific shift session
            const durationMs = now - startTime;
            const hours = Math.floor(durationMs / (1000 * 60 * 60));
            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
            const durationString = `${hours}h ${minutes}m`;

            // Dynamically inject the new entry row into the tracking table layout grid
            appendAttendanceRow(dateString, startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), timeString, durationString);
            
            alert(`Shift ended! Clocked out at ${timeString}. Total duration logged: ${durationString}.`);
        }
    });
}

/**
 * Inserts a verified session log row into the frontend table layout structure
 */
function appendAttendanceRow(date, checkIn, checkOut, total) {
    const tableBody = document.querySelector(".table-frame tbody");
    if (!tableBody) return;

    const newRow = document.createElement("tr");
    newRow.style.animation = "fadeIn 0.4s ease forwards";
    
    newRow.innerHTML = `
        <td>${date}</td>
        <td>${checkIn}</td>
        <td>${checkOut}</td>
        <td>${total}</td>
        <td><span class="status-badge status-success">Verified</span></td>
    `;

    // Always insert new entries at the very top of the ledger queue structure
    tableBody.insertBefore(newRow, tableBody.firstChild);
}