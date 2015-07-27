/**
 * ===BASE===// render // qtcpanel_setdisplay.js
 * @param 
 */

function qtcpanel_setdisplay(pm) {
// color
    menu.c50.style.display = "block";
    menu.c50.row2.style.display = 'none';
    if (pm.color1) {
        menu.c50.color1.style.display = 'inline-block';
        menu.c50.color1.innerHTML = pm.color1text ? pm.color1text : 'choose color';
        menu.c50.color1.style.backgroundColor = pm.color1;
    } else {
        menu.c50.color1.style.display = 'none';
    }
    if (pm.color2) {
        menu.c50.row2.style.display = 'block';
        menu.c50.color2.style.display = 'inline-block';
        menu.c50.color2.innerHTML = pm.color2text ? pm.color2text : 'choose color';
        menu.c50.color2.style.backgroundColor = pm.color2;
    } else {
        menu.c50.color2.style.display = 'none';
    }
    menu.c50.color1_1.style.display = menu.c50.color2_1.style.display = 'none';
    if (pm.qtc) {
        qtc_thresholdcolorcell(pm.qtc);
    }
// scale
    if (!pm.no_scale && pm.qtc && pm.qtc.thtype != undefined) {
        menu.c51.style.display = 'block';
        menu.c51.fix.style.display = menu.c51.percentile.style.display = 'none';
        menu.c51.select.firstChild.text = pm.qtc.min_fixed != undefined ? 'Auto (min set at ' + pm.qtc.min_fixed + ')' : (pm.qtc.max_fixed != undefined ? 'Auto (max set at ' + pm.qtc.max_fixed + ')' : 'Automatic scale');
        switch (pm.qtc.thtype) {
            case scale_auto:
                menu.c51.select.selectedIndex = 0;
                break;
            case scale_fix:
                menu.c51.select.selectedIndex = 1;
                menu.c51.fix.style.display = 'block';
                menu.c51.fix.min.value = pm.qtc.thmin;
                menu.c51.fix.max.value = pm.qtc.thmax;
                break;
            case scale_percentile:
                menu.c51.select.selectedIndex = 2;
                menu.c51.percentile.style.display = 'block';
                menu.c51.percentile.says.innerHTML = pm.qtc.thpercentile + ' percentile';
                break;
            default:
                print2console('unknown scale type ' + pm.qtc.thtype, 2);
        }
    } else {
        menu.c51.style.display = 'none';
    }
// log
    if (!pm.no_log && pm.qtc) {
        menu.c52.style.display = 'block';
        if (pm.qtc.logtype == undefined || pm.qtc.logtype == log_no) {
            menu.c52.select.selectedIndex = 0;
        } else {
            menu.c52.select.selectedIndex = pm.qtc.logtype == log_2 ? 1 : (pm.qtc.logtype == log_e ? 2 : 3);
        }
    } else {
        menu.c52.style.display = 'none';
    }
// smoothing
    if (!pm.no_smooth && pm.qtc) {
        menu.c46.style.display = 'block';
        if (pm.qtc.smooth == undefined) {
            menu.c46.checkbox.checked = false;
            menu.c46.div.style.display = 'none';
        } else {
            menu.c46.checkbox.checked = true;
            menu.c46.div.style.display = 'block';
            menu.c46.says.innerHTML = pm.qtc.smooth + '-pixel window';
        }
    } else {
        menu.c46.style.display = 'none';
    }
// summary method
    if (pm.qtc && pm.qtc.summeth != undefined) {
        menu.c59.style.display = 'block';
        menu.c59.select.selectedIndex = pm.qtc.summeth - 1;
        menu.c59.select.options[3].disabled = (pm.ft == FT_bigwighmtk_n || pm.ft == FT_bigwighmtk_c);
    }
    if (pm.ft == FT_bedgraph_n || pm.ft == FT_bedgraph_c) {
        menu.c29.style.display = 'block';
        if (pm.qtc.barplotbg) {
            menu.c29.checkbox.checked = true;
            menu.c29.color.style.display = 'block';
            menu.c29.color.style.backgroundColor = pm.qtc.barplotbg;
        } else {
            menu.c29.checkbox.checked = false;
            menu.c29.color.style.display = 'none';
        }
    }
    if (menu.c66) {
        menu.c66.style.display = 'block';
        menu.c66.checkbox.checked = pm.qtc.curveonly;
    }
}

