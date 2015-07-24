/**
 * @param event
 */

function consensusPlot_mu(event)
{
    gflag.pan.cp.preset_left=parseInt(gflag.pan.cp.scrollable[0].style.left);
    document.body.removeEventListener('mousemove',consensusPlot_mm,false);
    document.body.removeEventListener('mouseup',consensusPlot_mu,false);
}