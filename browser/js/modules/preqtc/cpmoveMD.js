/**
 * ===BASE===// preqtc // cpmoveMD.js
 * @param 
 */

function cpmoveMD(event) {
    /* generic moving panel */
    if (event.button != 0) return;
    var tab = event.target;
    while (tab.getAttribute('holderid') == null) tab = tab.parentNode;
    event.preventDefault();
    gflag.cpmove.dom = document.getElementById(tab.getAttribute('holderid'));
    gflag.cpmove.oldx = event.clientX;
    gflag.cpmove.oldy = event.clientY;
    document.body.addEventListener('mousemove', cpmoveM, false);
    document.body.addEventListener('mouseup', cpmoveMU, false);
}
