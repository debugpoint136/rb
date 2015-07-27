/**
 * ===BASE===// preqtc // itemcoord2plotbox.js
 * @param 
 */

function itemcoord2plotbox(itemstart, itemstop, boxstart, boxstop, boxpw) {
    /*
     itemstart/itemstop: coord of item
     boxstart/boxstop: coord of box
     boxwidth: plot width of box
     returns [xpos, plotwidth] in pixel
     */
    if (itemstart >= boxstop || itemstop <= boxstart) return [-1, -1];
    var sf = boxpw / (boxstop - boxstart); // px per bp
    var _start = Math.max(itemstart, boxstart);
    return [(_start - boxstart) * sf, Math.ceil((Math.min(itemstop, boxstop) - _start) * sf)];
}

