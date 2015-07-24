/**
 * called by clicking on span
 delete an experiment from vobj.tklst, and from bev panel
 */

function delete_bev_experiment(event)
{
    /* called by clicking on span
     delete an experiment from vobj.tklst, and from bev panel
     */
    var vobj=event.target.vobj;
    var bev=event.target.bev;
    var s=vobj.colorscale;
    s.cell0.removeChild(bev.csbj.header);
    s.cell1.removeChild(bev.csbj.sliderpad.parentNode);
    s.cell2.removeChild(bev.csbj.distributionCanvas);
    s.cell3.removeChild(bev.csbj.lowGradient);
    s.cell3.removeChild(bev.csbj.highGradient);
    s.cell4.removeChild(bev.csbj.ruler);
    for(var chr in bev.data)
        vobj.bev.chr2holder[chr].removeChild(bev.chr2canvas[chr]);
    for(var i=0; i<vobj.tklst.length; i++) {
        if(vobj.tklst[i].geoid==event.target.geoid) {
            vobj.tklst.splice(i,1);
            break;
        }
    }
}
