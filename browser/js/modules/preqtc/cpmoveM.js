/**
 * ===BASE===// preqtc // cpmoveM.js
 * @param 
 */

function cpmoveM(event) {
    var d = gflag.cpmove.dom;
    d.style.left = parseInt(d.style.left) + event.clientX - gflag.cpmove.oldx;
    d.style.top = parseInt(d.style.top) + event.clientY - gflag.cpmove.oldy;
    gflag.cpmove.oldx = event.clientX;
    gflag.cpmove.oldy = event.clientY;
}
