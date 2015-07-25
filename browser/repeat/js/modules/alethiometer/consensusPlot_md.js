/**
 * mouse down
 * @param event
 */

function consensusPlot_md(event)
{
// pan
    if(event.button!=0) return;
    event.preventDefault();
    document.body.addEventListener('mousemove',consensusPlot_mm,false);
    document.body.addEventListener('mouseup',consensusPlot_mu,false);
    gflag.pan={cp:apps.gg.view[event.target.key].consensusplot,oldx:event.clientX};
}

