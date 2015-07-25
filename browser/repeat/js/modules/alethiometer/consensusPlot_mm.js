/**
 * @param event
 */

function consensusPlot_mm(event)
{
    var inc=event.clientX-gflag.pan.oldx;
    var lst=gflag.pan.cp.scrollable;
    var newl=parseInt(lst[0].style.left)+inc;
    for(var i=0; i<lst.length; i++)
        lst[i].style.left=newl;
    gflag.pan.oldx=event.clientX;
}