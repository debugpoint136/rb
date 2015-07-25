/**
 * take the bev object
 * @param obj
 */

function colorscale_slidermoved(obj)
{
    /* take the bev object
     */
    var x=parseInt(obj.csbj.sliderpad.style.left);
    if(x<0) {
        x=obj.csbj.sliderpad.style.left=
            obj.csbj.sliderpole.style.left=0;
    } else if(x>colorscalewidth) {
        x=obj.csbj.sliderpad.style.left=obj.csbj.sliderpole.style.left=colorscalewidth;
    }
    var bv=obj.minv+x*obj.csbj.scorestep;
    obj.csbj.baseline=bv;
    obj.csbj.sliderpad.innerHTML=neatstr(bv);
    obj.csbj.lowGradient.style.width=x;
    obj.csbj.highGradient.style.width=colorscalewidth-x;
}