/**
 * ===BASE===// custtk // tkentryclick_simple.js
 * @param 
 */

function tkentryclick_simple(event) {
    event.target.className = event.target.className == 'tkentry' ? 'tkentry_onfocus' : 'tkentry';
}

