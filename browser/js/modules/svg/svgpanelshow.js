/**
 * ===BASE===// svg // svgpanelshow.js
 * @param 
 */

function svgpanelshow() {
// called from menu option
    cloakPage();
    panelFadein(apps.svg.main, 100 + document.body.scrollLeft, 100 + document.body.scrollTop);
    apps.svg.bbj = gflag.menu.bbj;
    apps.svg.urlspan.innerHTML = '';
    menu_hide();
}

