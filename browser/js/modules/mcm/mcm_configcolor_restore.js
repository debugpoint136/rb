/**
 *
 */

function mcm_configcolor_restore() {
    var lst = [];
    for (var i = 0; i < colorCentral.longlst_bk.length; i++) lst.push(colorCentral.longlst_bk[i]);
    colorCentral.longlst = lst;
    show_mcmColorConfig();
    gflag.menu.bbj.drawMcm(false);
}