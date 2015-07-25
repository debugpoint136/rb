/**
 * @param event
 */

function add2gg_invoketkselect(event)
{
    menu_shutup();
    var pos=absolutePosition(event.target);
    menu_show(0,pos[0]-document.body.scrollLeft-10,pos[1]-5-document.body.scrollTop+event.target.clientHeight);
    browser.showcurrenttrack4select(tkentryclick_add2gg,ftfilter_numerical);
    gflag.add2go_key=event.target.key;
}