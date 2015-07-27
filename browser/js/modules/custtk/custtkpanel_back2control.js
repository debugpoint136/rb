/**
 * ===BASE===// custtk // custtkpanel_back2control.js
 * @param 
 */

function custtkpanel_back2control() {
    apps.custtk.main.__hbutt2.style.display = 'none';
    var c = apps.custtk.bbj.genome.custtk;
    if (c.ui_submit.style.display != 'none') {
        flip_panel(c.buttdiv, c.ui_submit, false);
    }
}

