/**
 * @param event
 */

function click_gghandle(event)
{
    var t=event.target;
    while(t.className!='skewbox_butt') t=t.parentNode;
    view_gg(t.viewkey);
    indicator4fly(apps.gg.handleholder,apps.gg.holder,false);
}