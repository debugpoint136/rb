/**
 * ===BASE===// facet // facet_header_press.js
 * @param 
 */

function facet_header_press(event) {
    var t = event.target;
    if (t.tagName != 'TD') {
        t = t.parentNode;
    }
    t.style.backgroundColor = 'rgba(255,255,100,0.5)';
}

