/* js/calendar.js */

document.addEventListener("DOMContentLoaded", () => {
    initializeCalendarSlots();
});

/**
 * Attaches operational click captures onto each active day container cell
 */
function initializeCalendarSlots() {
    const calendarDays = document.querySelectorAll(".calendar-day-slot:not(.outside-month)");
    
    calendarDays.forEach(daySlot => {
        const dayNumber = daySlot.querySelector(".day-label").innerText;
        
        // Let the user click any day cell layout block to add a quick note reminder
        daySlot.style.cursor = "pointer";
        daySlot.addEventListener("click", (e) => {
            // Stop click bubbling if clicking directly on a pre-existing event pill component
            if (e.target.classList.contains("calendar-event-pill")) {
                const legacyEvent = e.target.innerText;
                alert(`Event Schedule Detail: "${legacyEvent}"`);
                return;
            }

            const newEventText = prompt(`Add a new organizational tracking note for July ${dayNumber}, 2026:`);
            if (newEventText && newEventText.trim() !== "") {
                createCalendarEventPill(daySlot, newEventText.trim());
            }
        });
    });
}

/**
 * Spawns a new event element container dynamically inside a day slot grid block
 */
function createCalendarEventPill(dayContainer, titleText) {
    const pill = document.createElement("div");
    pill.className = "calendar-event-pill event-purple";
    pill.innerText = titleText;
    pill.style.animation = "scaleUp 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards";
    
    dayContainer.appendChild(pill);
}

// Global visual style animations injection for interactive scheduling blocks
const calendarStyles = document.createElement("style");
calendarStyles.innerText = `
    @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
`;
document.head.appendChild(calendarStyles);