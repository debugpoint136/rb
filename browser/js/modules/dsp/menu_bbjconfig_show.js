/**
 * ===BASE===// dsp // menu_bbjconfig_show.js
 * @param 
 */

function menu_bbjconfig_show(event) {
// clicking gear button in bbj header, also show genome info option
    menu_shutup();
    var bbj = gflag.browser;
    menu.bbjconfig.style.display =
        menu.c33.style.display = 'block';
    menu.c33.firstChild.innerHTML = 'About ' + bbj.genome.name;
    menu.c33.genome = bbj.genome.name;
    menu.bbjconfig.leftwidthdiv.style.display = bbj.hmheaderdiv ? 'table-cell' : 'none';
    menu.bbjconfig.setbutt.style.display = 'none';
    menu.bbjconfig.allow_packhide_tkdata.checked = gflag.allow_packhide_tkdata;
    menu_show_beneathdom(0, event.target);
}

