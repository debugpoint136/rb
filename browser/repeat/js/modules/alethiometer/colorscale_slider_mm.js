/**
 * @param event
 */

function colorscale_slider_mm(event)
{
    var bev=gflag.css.bev;
    var left=parseInt(bev.csbj.sliderpad.style.left);
    var dif=event.clientX-gflag.css.oldx;
    if(dif>0) {
        bev.csbj.sliderpad.style.left=bev.csbj.sliderpole.style.left=Math.min(colorscalewidth,left+dif);
    } else {
        bev.csbj.sliderpad.style.left=bev.csbj.sliderpole.style.left=Math.max(0,left+dif);
    }
    colorscale_slidermoved(bev);
    gflag.css.oldx=event.clientX;
}