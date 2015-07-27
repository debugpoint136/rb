/**
 * ===BASE===// scalebar // scalebarArrowM.js
 * @param 
 */

function scalebarArrowM(event) {
    var bbj = gflag.scalebarbbj;
    var s = bbj.scalebar;
    var thisx = event.clientX + document.body.scrollLeft;
    var oldleft = parseInt(s.arrow.style.left);
    var newleft = oldleft + thisx - s.arrow.xstart;
    var oldleft2 = parseInt(s.slider.style.left);
    if (newleft > oldleft) {
        if (oldleft2 + s.slider.width + newleft - oldleft > bbj.hmSpan) {
            newleft = bbj.hmSpan;
        }
    } else if (newleft < oldleft) {
        if (s.slider.width < oldleft - newleft) {
            newleft = oldleft;
        }
    }
    s.arrow.style.left = newleft;
    s.arrow.xstart = thisx;
    s.slider.width += newleft - oldleft;
    bbj.drawScalebarSlider();
    bbj.scalebarSlider_fill();
    scalebarbeam.style.width = s.slider.width;
    scalebarbeam.style.display = 'block';
}
