/**
 * ===BASE===// preqtc // placeIndicator3.js
 * @param 
 */

function placeIndicator3(x, y, w, h) {
// place indicator3 at a place (x,y) with resizing (w,h)
    indicator3.style.left = x;
    indicator3.style.top = y;
    var d = indicator3.firstChild;
    d.style.width = w;
    d.style.height = h;
    var dd = d.firstChild;
    dd.style.width = w;
    dd.style.height = h;
    dd = d.childNodes[1];
    dd.style.width = w;
    dd.style.height = h;
    dd = d.childNodes[2];
    dd.style.width = w;
    dd.style.height = h;
    dd = d.childNodes[3];
    dd.style.width = w;
    dd.style.height = h;
    indicator3.style.display = "block";
}

