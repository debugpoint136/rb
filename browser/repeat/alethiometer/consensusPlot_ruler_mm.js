/**
 * @param event
 */

function consensusPlot_ruler_mm(event)
{
// duplicative
    var z=gflag.zoomin;
    if(event.clientX==z.x) return;
    var w;
    if(event.clientX>z.x0) {
        // on right of original point, only change width
        if(event.clientX>z.borderright)
            return;
        w=indicator.style.width=parseInt(indicator.style.width)+event.clientX-z.x;
    } else {
        // on left of original point, change both width and left
        if(event.clientX<z.borderleft)
            return;
        var c=event.clientX-z.x;
        w=indicator.style.width=parseInt(indicator.style.width)-c;
        indicator.style.left=parseInt(indicator.style.left)+c;
    }
    z.x=event.clientX;
    indicator.firstChild.style.backgroundColor=indicator.style.borderColor=
        (w/apps.gg.view[z.viewkey].consensusplot.sf>80) ? 'blue' : 'red';
}