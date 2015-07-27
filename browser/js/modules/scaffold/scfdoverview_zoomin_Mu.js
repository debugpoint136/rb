/**
 * ===BASE===// scaffold // scfdoverview_zoomin_Mu.js
 * @param 
 */

function scfdoverview_zoomin_Mu(event) {
    document.body.removeEventListener("mousemove", scfdoverview_zoomin_Mm, false);
    document.body.removeEventListener("mouseup", scfdoverview_zoomin_Mu, false);
    indicator.style.display = "none";
    var n = gflag.navigator;
    var x = parseInt(indicator.style.left) - n.xcurb; // relative to minichr canvas div
    var w = parseInt(indicator.style.width);
    if (w == 0) {
        w = 1;
    }
    var coord1 = parseInt(n.bbj.genome.scaffold.overview.sf * x);
    var coord2 = coord1 + parseInt(n.bbj.genome.scaffold.overview.sf * w);
    if (coord1 > n.bbj.genome.scaffold.len[n.chr]) return;
    coord2 = Math.max(coord2, coord1 + n.bbj.hmSpan / MAXbpwidth_bold);
    if (coord2 > n.bbj.genome.scaffold.len[n.chr]) return;
    menu_hide();
    var coord = n.chr + ':' + coord1 + '-' + coord2;
    if (n.bbj.may_init_pending_splinter(coord)) return;
    if (n.bbj.jump_callback) {
        n.bbj.jump_callback(coord);
        return;
    }
    n.bbj.weavertoggle(coord2 - coord1);
    n.bbj.cgiJump2coord(coord);
    if (gflag.syncviewrange) {
        var lst = gflag.syncviewrange.lst;
        for (var i = 0; i < lst.length; i++) {
            lst[i].cgiJump2coord(coord);
        }
    }
}

