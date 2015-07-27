/**
 * ===BASE===// preqtc // qtc_thresholdcolorcell.js
 * @param 
 */

function qtc_thresholdcolorcell(_qtc) {
    if (!_qtc || _qtc.thtype == undefined) return;
    if (menu.c50.style.display == 'none') return;
    if (_qtc.thtype == scale_auto) {
        menu.c50.color1_1.style.display = menu.c50.color2_1.style.display = 'none';
        return;
    }
    if (menu.c50.color1.style.display != 'none') {
        var c = menu.c50.color1_1;
        c.style.display = 'inline-block';
        c.innerHTML = 'beyond threshold';
        c.style.backgroundColor = _qtc.pth;
    }
    if (menu.c50.color2.style.display != 'none') {
        var c = menu.c50.color2_1;
        c.style.display = 'inline-block';
        c.innerHTML = 'beyond threshold';
        c.style.backgroundColor = _qtc.nth;
    }
}


