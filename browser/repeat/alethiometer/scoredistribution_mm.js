/**
 * @param event
 */

function scoredistribution_mm(event)
{
// over a score distribution graph along with color scale
    var vobj=event.target.vobj;
    var bev=event.target.bev;
    var x=event.clientX-absolutePosition(event.target)[0];
    var v=bev.minv+bev.csbj.scorestep*x;
    /* in case of has_input, 0 ratio count is omitted because it usually has large number
     */
    if(vobj.has_input && v<=0 && v+bev.csbj.scorestep>=0) {
        picasays.innerHTML= neatstr(v)+' to '+neatstr(v+bev.csbj.scorestep)+
            '<br><b>'+bev.csbj.zeroRatioCount+'</b> TEs with 0 ratio'+
            '<div style="color:rgba(255,0,0,0.7)">not represented on the histogram</div>';
    } else {
        var num=bev.csbj.distributionArr[x];
        picasays.innerHTML= neatstr(v)+' to '+neatstr(v+bev.csbj.scorestep)+
            (num>0?'<br><b>'+num+'</b> TEs within this range':'');
    }
    pica_go(event.clientX,absolutePosition(bev.csbj.distributionCanvas)[1]+bev.csbj.distributionCanvas.height-7);
}
