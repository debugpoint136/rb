/**
 * @param event
 */

function consensusPlot_showall(event)
{
    event.target.style.display='none';
    var vobj=apps.gg.view[event.target.key];
    var cp=vobj.consensusplot;
    cp.preset_left=0;
    cp.sf=800/id2subfam[vobj.subfamid].consensuslen;
    draw_consensusPlot(event.target.key);
}