/**
 * ===BASE===// render // make_skewbox_butt.js
 * @param 
 */

function make_skewbox_butt(holder) {
    var d = dom_create('div', holder);
    d.className = 'skewbox_butt';
    dom_create('div', d);
    dom_create('div', d);
    return d;
}

