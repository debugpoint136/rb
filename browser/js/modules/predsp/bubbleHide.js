/**
 * ===BASE===// predsp // bubbleHide.js
 * @param 
 */

function bubbleHide() {
    bubble.style.display = 'none';
    document.body.removeEventListener('mousedown', bubbleHide, false);
    setTimeout('bubble.says.style.maxHeight=0;bubble.sayajax.style.maxHeight=0;', 1);
// must not directly set maxHeight to 0 in case of clicking on blank track region
}
