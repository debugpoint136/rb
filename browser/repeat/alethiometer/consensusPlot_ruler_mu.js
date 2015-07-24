/**
 * @param event
 */

function consensusPlot_ruler_mu(event)
{
    if(indicator.style.borderColor=='blue') {
        var z=gflag.zoomin;
        z.inuse=false;
        var cp=apps.gg.view[z.viewkey].consensusplot;
        // set new values of .preset_left and .sf
        var start=parseInt(indicator.style.left)-z.borderleft-cp.preset_left;
        var width=parseInt(indicator.style.width);
        var outbp=start/cp.sf;
        cp.sf=800/(width/cp.sf);
        cp.preset_left=0-outbp*cp.sf;
        draw_consensusPlot(z.viewkey);
        cp.allbutt.style.display='inline';
    }
    indicator.style.display='none';
    document.body.removeEventListener('mousemove', consensusPlot_ruler_mm,false);
    document.body.removeEventListener('mouseup', consensusPlot_ruler_mu,false);
}