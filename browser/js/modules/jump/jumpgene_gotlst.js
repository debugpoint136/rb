/**
 * ===BASE===// jump // jumpgene_gotlst.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.jumpgene_gotlst = function (genelst) {
    if (!genelst) {
        print2console('No result.', 2);
        return;
    }
    var total = 0; // total genes
    for (var i = 0; i < genelst.length; i++) {
        total += genelst[i].lst.length;
    }
    if (total == 0) {
        print2console('No genes found.', 2);
        return;
    }
    if (total > 1) {
        var table = menu.relocate.jumplstholder;
        table.style.display = 'block';
        genelist2selectiontable(genelst, table, menu_lstholder_jump_closure);
        menu2_hide();
        return;
    }
    var g = genelst[0].lst[0];
    var start = g.a, stop = g.b;
    var coord = g.c + ':' + start + '-' + stop;
//if(this.may_portcoord2target(coord)) return;
    if (this.may_init_pending_splinter(coord)) return;
    this.weavertoggle(stop - start);
    if (this.jump_callback) {
        this.jump_callback(coord, g);
        return;
    }
    this.__pending_coord_hl = [g.c, g.a, g.b];
    this.cgiJump2coord(coord);
    menu_hide();
    if (gflag.syncviewrange) {
        var lst = gflag.syncviewrange.lst;
        for (var i = 0; i < lst.length; i++) {
            lst[i].cgiJump2coord(coord);
        }
    }
};

