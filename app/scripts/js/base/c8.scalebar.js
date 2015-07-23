/**
 * Created by dpuru on 2/27/15.
 */
/*** __scalebar__ ***/
function scalebarMout(event) {
// mouse out to hide beam
    var bbj = gflag.browser;
    var ctx = bbj.scalebar.arrow.getContext('2d');
    ctx.strokeStyle = colorCentral.foreground;
    bbj.scalebararrowStroke();
    scalebarbeam.style.display = 'none';
}
function scalebarMover(event) {
// mouse over to show beam
    var bbj = gflag.browser;
    var ctx = bbj.scalebar.arrow.getContext('2d');
    ctx.strokeStyle = '#f00';
    gflag.browser.scalebararrowStroke();
    gflag.browser.show_scalebarbeam();
}
Browser.prototype.show_scalebarbeam = function () {
    var s = scalebarbeam;
    s.style.display = 'block';
    s.style.width = this.scalebar.slider.width;
    var pos = absolutePosition(this.scalebar.slider);
    s.style.left = pos[0];
    s.style.top = pos[1] + this.scalebar.slider.height;
    s.style.height = this.tkpanelheight() + (this.rulercanvas ? this.rulercanvas.height : 0);
};
Browser.prototype.scalebararrowStroke = function () {
    var x = 6;
    var ctx = this.scalebar.arrow.getContext('2d');
    ctx.clearRect(0, 0, 20, 16);
    ctx.beginPath();
    ctx.moveTo(x, 2);
    ctx.lineTo(x, 15);
    ctx.lineTo(1, 12);
    ctx.moveTo(x, 15);
    ctx.lineTo(x * 2 - 1, 12);
    ctx.stroke();
};
function scalebarSliderMD(event) {
    if (event.button != 0) return;
    event.preventDefault();
    gflag.browser.scalebar.slider.xstart = event.clientX + document.body.scrollLeft;
    gflag.browser.show_scalebarbeam();
    gflag.scalebarbbj = gflag.browser;
    document.body.addEventListener('mousemove', scalebarSliderM, false);
    document.body.addEventListener('mouseup', scalebarSliderMU, false);
    scalebarbeam.style.display = 'block';
}
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
function scalebarSliderMU(event) {
    document.body.removeEventListener('mousemove', scalebarSliderM, false);
    document.body.removeEventListener('mouseup', scalebarSliderMU, false);
    scalebarbeam.style.display = 'none';
}
function scalebarArrowMD(event) {
    if (event.button != 0) return;
    event.preventDefault();
    gflag.browser.scalebar.arrow.xstart = event.clientX + document.body.scrollLeft;
    gflag.scalebarbbj = gflag.browser;
    document.body.addEventListener('mousemove', scalebarArrowM, false);
    document.body.addEventListener('mouseup', scalebarArrowMU, false);
    scalebarbeam.style.display = 'block';
}
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
function scalebarArrowMU(event) {
    document.body.removeEventListener('mousemove', scalebarArrowM, false);
    document.body.removeEventListener('mouseup', scalebarArrowMU, false);
    scalebarbeam.style.display = 'none';
}
Browser.prototype.drawScalebarSlider = function () {
    var ctx = this.scalebar.slider.getContext('2d');
    ctx.fillRect(0, 3, 1, this.scalebar.slider.height - 5);
    ctx.fillRect(0, 8, this.scalebar.slider.width, 1);
};
Browser.prototype.scalebarSlider_fill = function () {
    if (!this.scalebar || !this.scalebar.slider) return;
    var bp = this.pixelwidth2bp(this.scalebar.slider.width);
    this.scalebar.says.innerHTML = bp > 10 ? parseInt(bp) : bp.toFixed(1);
    this.scalebar.says.style.left = parseInt(this.scalebar.slider.style.left) - this.scalebar.says.clientWidth - 3;
};
/*** __scalebar__ ends ***/
