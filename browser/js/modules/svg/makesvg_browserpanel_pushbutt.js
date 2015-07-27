/**
 * ===BASE===// svg // makesvg_browserpanel_pushbutt.js
 * @param 
 */

function makesvg_browserpanel_pushbutt(event) {
    /* called by pushing "generate graph" buttons
     called with trunk browser, but not splinter
     */
    event.target.disabled = true;
    apps.svg.urlspan.innerHTML = 'working...';

    var showtklabel = apps.svg.showtklabel.checked;

    /* dimension of entire graph
     for safety reason, tk label height is included for all tracks to estimate height
     */
    var bbj = apps.svg.bbj;
    var viewabletkcount = 0;
    for (var i = 0; i < bbj.tklst.length; i++) {
        if (!tkishidden(bbj.tklst[i])) viewabletkcount++;
    }
    var gwidth = bbj.hmSpan +
        (showtklabel ? bbj.leftColumnWidth : 0) +
        (tkAttrColumnWidth) * bbj.mcm.lst.length;
    for (var k in bbj.splinters) {
        gwidth += bbj.splinters[k].hmSpan;
    }
    var gheight = bbj.main.clientHeight + 1 * viewabletkcount;
    for (var k in bbj.splinters) {
        var s = bbj.splinters[k];
        gheight = Math.max(gheight, s.main.clientHeight + 1 * viewabletkcount);
    }

    /* graph size is now determined */

    var content = ['<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="' + gwidth + '" height="' + gheight + '">'];

    /* draw splinters first!
     trunk will put blankets later
     */
    var offset = bbj.hmSpan + (showtklabel ? bbj.leftColumnWidth : 0) + 2;
    for (var k in bbj.splinters) {
        var s = bbj.splinters[k];
        var h = s.makesvg_specific({gx: offset, showtklabel: false});
        // border around splinter
        h += 2; // h is inaccurate..
        s.svg.gy = 0;
        s.svgadd({
            type: svgt_rect_notscrollable,
            x: -1,
            y: 0,
            w: s.hmSpan,
            h: h,
            stroke: colorCentral.foreground_faint_3
        });
        content = content.concat(s.svg.content);
        delete s.svg;
        offset += s.hmSpan + 3;
    }
    bbj.makesvg_specific({gx: 0, showtklabel: showtklabel, svgheight: gheight});
    content = content.concat(bbj.svg.content);
    delete bbj.svg;
    content.push('</svg>');
    ajaxPost('svg\n' + content.join(''), function (text) {
        svgshowlink(text);
    });
}
