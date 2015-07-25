/**
 * @param event
 */

function consensusPlot_ruler_md(event)
{
    if(event.button!=0) return;
    event.preventDefault();
    var pos=absolutePosition(event.target.parentNode);
    var pos2=absolutePosition(event.target);
    var z=gflag.zoomin;
    z.x=event.clientX;
    z.x0=event.clientX; // original x
    z.borderleft=Math.max(pos[0],pos2[0]);
    z.borderright=Math.min(pos[0]+event.target.parentNode.clientWidth,pos2[0]+event.target.width);
    z.inuse=true;
    z.viewkey=event.target.key;
    indicator.style.display='block';
    indicator.style.width=1;
    indicator.style.height=event.target.parentNode.parentNode.parentNode.parentNode.clientHeight;
    indicator.style.left=event.clientX;
    indicator.style.top=pos[1]-1;
    document.body.addEventListener('mousemove', consensusPlot_ruler_mm,false);
    document.body.addEventListener('mouseup', consensusPlot_ruler_mu,false);
}