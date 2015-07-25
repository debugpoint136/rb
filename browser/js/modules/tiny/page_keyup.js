/**
 * pushing Esc to remove any app panel that is open
 * @param event
 */

function page_keyup(event) {
// pushing Esc to remove any app panel that is open
    if (event.keyCode !== 27) return;
    if (menu.style.display != 'none') menu_hide();
    if (menu2.style.display != 'none') menu2_hide();
    if (bubble.style.display != 'none') bubbleHide();
    for (var appname in apps) {
        if (apps[appname].main.style.display != 'none') {
            if (appname == 'oneshot') {
                shake_dom(apps.oneshot.main);
                return;
            }
            pagecloak.style.display = 'none';
            panelFadeout(apps[appname].main);
            return;
        }
    }
}