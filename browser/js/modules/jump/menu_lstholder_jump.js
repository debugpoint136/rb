/**
 * ===BASE===// jump // menu_lstholder_jump.js
 * @param 
 */

function menu_lstholder_jump(gene) {
// choose from a list of genes and jump to it
    var bbj = gflag.menu.bbj;
    if (bbj.is_gsv()) {
        print2console('Cannot jump in Gene Set View mode', 2);
        return;
    }
    if (geneisinvalid(gene)) {
        print2console('Invalid gene data, cannot jump', 2);
        return;
    }
    var start = gene.a, stop = gene.b;
    var coord = gene.c + ':' + start + '-' + stop;
//if(bbj.may_portcoord2target(coord)) return;
    if (bbj.may_init_pending_splinter(coord)) return;
    bbj.weavertoggle(stop - start);
    if (bbj.jump_callback) {
        bbj.jump_callback(coord, gene);
        return;
    }
    bbj.cgiJump2coord(coord);
    bbj.__pending_coord_hl = [gene.c, start, stop];
    menu_hide();
    if (gflag.syncviewrange) {
        var lst = gflag.syncviewrange.lst;
        for (var i = 0; i < lst.length; i++) {
            lst[i].cgiJump2coord(coord);
        }
    }
}

