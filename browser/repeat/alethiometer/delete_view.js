/**
 * @param event
 */

function delete_view(event)
{
    var tr=apps.gg.view[event.target.key].viewtr;
    tr.parentNode.removeChild(tr);
    var m= apps.gg.view[event.target.key].main;
    if(m.parentNode)
        pane.childNodes[1].removeChild(m);
    stripChild(pane.says,0);
    delete apps.gg.view[event.target.key];
    afteraddremoveview(false);
}