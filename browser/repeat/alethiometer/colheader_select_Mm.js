/**
 * colheader_select_Mm
 * @param event
 */

function colheader_select_Mm(event)
{
    if(event.clientX==gflag.zoomin.x) return;
    if(event.clientX>gflag.zoomin.x0) {
        // on right of original point, only change width
        if(event.clientX>gflag.zoomin.borderright)
            return;
        indicator.style.width=parseInt(indicator.style.width)+event.clientX-gflag.zoomin.x;
    } else {
        // on left of original point, change both width and left
        if(event.clientX<gflag.zoomin.borderleft)
            return;
        var c=event.clientX-gflag.zoomin.x;
        indicator.style.width=parseInt(indicator.style.width)-c;
        indicator.style.left=parseInt(indicator.style.left)+c;
    }
    gflag.zoomin.x=event.clientX;
}