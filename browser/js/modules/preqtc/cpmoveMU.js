/**
 * ===BASE===// preqtc // cpmoveMU.js
 * @param 
 */

function cpmoveMU(event) {
    gflag.cpmove.dom = null;
    document.body.removeEventListener('mousemove', cpmoveM, false);
    document.body.removeEventListener('mouseup', cpmoveMU, false);
}


