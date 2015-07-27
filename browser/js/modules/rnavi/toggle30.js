/**
 * Created by dpuru on 2/27/15.
 */
/** __rnavi__ navigate region */
function toggle30() {
    apps.navregion.shortcut.style.display = 'inline-block';
    if (apps.navregion.main.style.display == "none") {
        panelFadein(apps.navregion.main, 100 + document.body.scrollLeft, 50 + document.body.scrollTop);
    } else {
        panelFadeout(apps.navregion.main);
    }
    menu_hide();
}

