/**
 * @param event
 */

function labelbox_mover(event)
{
    var d=event.target;
    while(d.className!='labelbox') d=d.parentNode;
    d.firstChild.childNodes[1].firstChild.style.borderColor=darkencolor(colorstr2int(d.color),.4);
}