/**
 * ===BASE===// menu // menu_addoption.js
 * @param 
 */

function menu_addoption(icon, label, callback, holder) {
    /* make a new menu option
     */
    var d = dom_create('div', holder);
    d.className = 'menuactivechoice';
    if (icon) {
        var d2 = dom_create('div', d);
        d2.className = 'iconholder';
        d2.innerHTML = icon;
    }
    if (label) {
        var s = dom_addtext(d, label);
        s.style.whiteSpace = 'nowrap';
        s.style.marginLeft = 10;
    }
    if (callback) {
        d.addEventListener('click', callback, false);
    }
    return d;
}

