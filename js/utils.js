// Done by Pushkar Biring
// js/utils.js

/**
 * Global Utility Functions
 * Import these into your modules to maintain consistent data formatting.
 */

// ==========================================
// 1. CURRENCY FORMATTING (For Person 4 - Payroll)
// ==========================================
export const formatCurrency = (amount, currency = 'USD') => {
    if (isNaN(amount)) return '--';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

// ==========================================
// 2. DATE FORMATTING (For all modules)
// ==========================================
export const formatDate = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    // Check if valid date
    if (isNaN(date.getTime())) return dateString; 
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};

// ==========================================
// 3. TIME CALCULATION (For Person 3 - Attendance)
// ==========================================
export const calculateWorkingHours = (checkInIso, checkOutIso) => {
    if (!checkInIso || !checkOutIso) return '0h 0m';
    
    const start = new Date(checkInIso);
    const end = new Date(checkOutIso);
    const diffMs = end - start;
    
    if (diffMs < 0) return 'Invalid Time';

    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.round(((diffMs % 3600000) / 60000));
    
    return `${diffHrs}h ${diffMins}m`;
};

// ==========================================
// 4. DEBOUNCE FUNCTION (For Person 2 - Employee Search)
// ==========================================
// Prevents a function from firing too many times in a row (e.g., waiting until a user stops typing to search Firebase).
export const debounce = (func, delay = 300) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};

// ==========================================
// 5. LOCAL STORAGE HELPERS
// ==========================================
export const saveToLocal = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error("Error saving to localStorage", e);
    }
};

export const getFromLocal = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error("Error reading from localStorage", e);
        return null;
    }
};