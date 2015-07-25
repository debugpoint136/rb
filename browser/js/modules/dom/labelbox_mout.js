/**
 * @param event
 */

function labelbox_mout(event)
{
    var d=event.target;
    while(d.className!='labelbox') d=d.parentNode;
    d.firstChild.childNodes[1].firstChild.style.borderColor=d.color;
}