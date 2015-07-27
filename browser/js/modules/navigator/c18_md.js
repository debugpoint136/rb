/**
 * ===BASE===// navigator // c18_md.js
 * @param 
 */

function c18_md(event) {
    if (event.button != 0) return;
    event.preventDefault();
    var pos = absolutePosition(event.target);
    indicator.style.display = 'block';
    indicator.style.left = event.clientX + document.body.scrollLeft;
    indicator.style.top = pos[1];
    indicator.style.width = 1;
    indicator.style.height = event.target.clientHeight;
    gflag.c18 = {
        canvas: event.target,
        x: event.clientX + document.body.scrollLeft,
        xcurb: pos[0]
    };
    document.body.addEventListener('mousemove', c18_mm, false);
    document.body.addEventListener('mouseup', c18_mu, false);
}
