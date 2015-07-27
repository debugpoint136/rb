/**
 * ===BASE===// navigator // navigatorMU.js
 * @param 
 */

function navigatorMU(event) {
    document.body.removeEventListener("mousemove", navigatorM, false);
    document.body.removeEventListener("mouseup", navigatorMU, false);
    indicator.style.display = 'none';
    var n = gflag.navigator;
    var x = parseInt(indicator.style.left) - n.xcurb; // relative to minichr canvas div
    var w = parseInt(indicator.style.width);
    if (w == 0) return;
    var jt = n.bbj.juxtaposition.type;
    var coord1 = n.bbj.navigatorSeek(x);
    var coord2 = n.bbj.navigatorSeek(x + w);
    if (coord1[0] == coord2[0] && coord1[1] == coord2[1]) return;

    if (n.bbj.is_gsv()) {
        /* if selected region is too small to fit in the entire genomeheatmap,
         need to expand it so it won't yield "truncated" hmtks
         */
        var hmbp = n.bbj.hmSpan / MAXbpwidth_bold;
        var wbp = w * n.bbj.genesetview.lstsf; // bp spanned by indicator box
        if (wbp < hmbp) {
            var neww = Math.ceil(hmbp * this.genesetview.lstsf);
            x -= Math.ceil((neww - w) / 2);
            w = neww;
            if (x < 0) {
                x = 0;
            } else if (x + w > this.navigator.canvas.width) {
                x = this.navigator.canvas.width - w;
            }
        }
        n.bbj.cloak();
        var samestring = "itemlist=on&imgAreaSelect=on&statusId=" + n.bbj.statusId +
            "&startChr=" + coord1[0] + "&startCoord=" + coord1[1] +
            "&stopChr=" + coord2[0] + "&stopCoord=" + coord2[1] +
            (n.bbj.entire.atbplevel ? '&atbplevel=on' : '');
        n.bbj.ajaxX(samestring);
        return;
    }
    n.bbj.weavertoggle(n.bbj.navigator.totalbp * w / n.bbj.navigator.canvas.width);
    var param = 'imgAreaSelect=on&' + n.bbj.runmode_param() + '&startChr=' + coord1[0] + '&startCoord=' + coord1[1] + '&stopChr=' + coord2[0] + '&stopCoord=' + coord2[1];
    n.bbj.cloak();
    n.bbj.ajaxX(param);
    if (gflag.syncviewrange) {
        for (var i = 0; i < gflag.syncviewrange.lst.length; i++) {
            gflag.syncviewrange.lst[i].ajaxX(param);
        }
    }
}

/* c18_canvas, showing only one chr
 */
