/**
 * ===BASE===// jump // menuJump.js
 * @param 
 */

function menuJump() {
    /* called by pushing 'go' button in jump ui
     */
    var bbj = gflag.menu.bbj;
    if (bbj.is_gsv()) {
        print2console('Cannot jump while running Gene Set View', 2);
        return;
    }
    var param = menu.relocate.coord.value;
    if (param.length > 0) {
        var c = bbj.parseCoord_wildgoose(param, true);
        if (!c) {
            print2console('Invalid coordinate', 2);
            return;
        }
        var s = c.length == 3 ? (c[0] + ':' + c[1] + '-' + c[2]) : c.join(',');
        if (bbj.may_init_pending_splinter(s)) return;
        if (c.length == 3) {
            bbj.weavertoggle(c[2] - c[1]);
        }
        if (bbj.jump_callback) {
            // careful here in case of moving to single base
            if (c.length == 3) {
                if (c[2] - c[1] < bbj.hmSpan) {
                    var m = Math.max(bbj.hmSpan / 2, parseInt((c[1] + c[2]) / 2));
                    c[1] = m - bbj.hmSpan / 2;
                    c[2] = m + bbj.hmSpan / 2;
                }
                bbj.jump_callback(c[0] + ':' + c[1] + '-' + c[2]);
                return;
            }
        }
        bbj.cgiJump2coord(s);
        if (gflag.syncviewrange) {
            var lst = gflag.syncviewrange.lst;
            for (var i = 0; i < lst.length; i++) {
                lst[i].cgiJump2coord(s);
            }
        }
        return;
    }
    param = menu.relocate.gene.value;
    if (param.length > 0) {
        bbj.getcoord4genenames([param], function (dat) {
            bbj.jumpgene_gotlst(dat);
        });
        return;
    }
    print2console("Neither gene nor coordinate given", 2);
}

