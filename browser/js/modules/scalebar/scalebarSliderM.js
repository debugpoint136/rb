/**
 * ===BASE===// scalebar // scalebarSliderM.js
 * @param 
 */

function scalebarSliderM(event) {
    var bbj = gflag.scalebarbbj;
    var s = bbj.scalebar;
    var thisx = event.clientX + document.body.scrollLeft;
    var oldleft = parseInt(s.slider.style.left);
    var newleft = oldleft + thisx - s.slider.xstart;
    if (newleft > oldleft) {
        if (newleft > bbj.hmSpan - s.slider.width) {
            newleft = bbj.hmSpan - s.slider.width;
        }
    } else if (newleft < oldleft) {
        if (newleft < 0) {
            newleft = 0;
        }
    }
    s.slider.style.left = newleft;
    s.slider.xstart = thisx;
    s.says.style.left = newleft - s.says.clientWidth - 3;
    s.arrow.style.left = newleft + s.slider.width - 6;
    scalebarbeam.style.left = parseInt(scalebarbeam.style.left) + newleft - oldleft;
    scalebarbeam.style.display = 'block';
}
