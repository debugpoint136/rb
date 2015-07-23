/**
 * Created by dpuru on 2/27/15.
 */


/*** __jump__ ***/

function jump2coord_closure(bbj, chr, start, stop) {
    return function () {
        bbj.weavertoggle(stop - start);
        bbj.cgiJump2coord(chr + ' ' + start + ' ' + stop);
    };
}

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

function menu_lstholder_jump_closure(gene) {
    return function () {
        menu_lstholder_jump(gene);
    };
}
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

Browser.prototype.cgiJump2coord = function (coord) {
    if (this.is_gsv()) {
        var tmp = this.parseCoord_wildgoose(coord);
        var a, b, c;
        if (tmp.length == 3) {
            a = tmp[0];
            b = tmp[1];
            c = tmp[2];
        } else {
            return;
        }
        for (var i = 0; i < this.genesetview.lst.length; i++) {
            var t = this.genesetview.lst[i];
            if (t.chrom == a && Math.max(t.start, b) < Math.min(t.stop, c)) {
                this.cloak();
                this.ajaxX("itemlist=on&imgAreaSelect=on&statusId=" + this.statusId +
                "&startChr=" + t.name + "&startCoord=" + Math.max(t.start, b) +
                "&stopChr=" + t.name + "&stopCoord=" + Math.min(t.stop, c) +
                (this.entire.atbplevel ? '&atbplevel=on' : ''));
                return;
            }
        }
        return;
    }
    this.cloak();
    this.ajaxX(this.displayedRegionParam() + "&jump=on&jumppos=" + coord);
};

function menu_jump_highlighttkitem(event) {
    var bbj = gflag.menu.bbj;
    if (bbj.is_gsv()) {
        print2console('Cannot jump in Gene Set View mode', 2);
        return;
    }
    var tr = event.target;
    while (tr.tagName != 'TR') tr = tr.parentNode;
    if (bbj.jump_callback) {
        bbj.jump_callback(tr.coord);
        return;
    }
    var t = bbj.parseCoord_wildgoose(tr.coord);
    if (t.length == 3) bbj.__pending_coord_hl = t;
    bbj.cgiJump2coord(tr.coord);
    menu_hide();
}


function jumpsnp_keyup(event) {
    if (event.keyCode == 13) menuJumpsnp();
}
function menuJumpsnp() {
    var ss = menu.relocate.snp.value;
    if (ss.length == 0) {
        print2console('Please enter SNP id.', 2);
        return;
    }
    var bbj = gflag.menu.bbj;
    stripChild(menu.c47.table, 0);
    bbj.ajax('searchtable=' + bbj.genome.snptable + '&dbName=' + bbj.genome.name + '&text=' + ss,
        function (data) {
            bbj.tkitemkwsearch_cb(data);
        });
}


function jump_clearinput() {
    menu.relocate.coord.value = menu.relocate.gene.value = '';
}

function menuJump_keyup(event) {
    if (event.keyCode == 13) menuJump();
}

function jumpgene_keyup(event) {
    if (event.keyCode == 13) {
        menuJump();
        menu2_hide();
        return;
    }
    if (event.keyCode == 27) return;
    menu.relocate.jumplstholder.style.display = 'none';
    var ss = event.target.value;
    if (ss.length <= 1) {
        menu2_hide();
        return;
    }
    var bbj = gflag.menu.bbj;
    bbj.ajax('findgenebypartialname=on&dbName=' + bbj.genome.name + '&query=' + ss +
        '&searchgenetknames=' + bbj.genome.searchgenetknames.join(','),
        function (data) {
            bbj.jumpgene_keyup_cb(data, ss);
        });
}
Browser.prototype.jumpgene_keyup_cb = function (data, query) {
    if (!data || !data.lst || data.lst.length == 0) {
        menu2_hide();
        return;
    }
    menu2_show();
    var p = absolutePosition(menu.relocate.gene);
    menu2.style.left = p[0];
    menu2.style.top = p[1] + 20;
    stripChild(menu2, 0);
// returned gene names could be identical
    var s = {};
    for (var i = 0; i < data.lst.length; i++) {
        s[data.lst[i]] = 1;
    }
// put genes whose name start with the query to front
    var lst = [];
    query = query.toLowerCase();
    for (var n in s) {
        var sn = n.toLowerCase();
        if (sn.indexOf(query) == 0) {
            lst.push(n);
            delete s[n];
        }
    }
    for (n in s) lst.push(n);
    for (var i = 0; i < Math.min(20, lst.length); i++) {
        dom_create('div', menu2, null, {c: 'menu2ele', t: lst[i], clc: menu2ele_click}).genename = lst[i];
    }
};


Browser.prototype.showjumpui = function (param) {
    if (param.d) {
        menu_show_beneathdom(11, param.d);
    } else {
        menu_show(11, param.x, param.y);
    }
    gflag.menu.bbj = this;
    menu_shutup();
    menu.relocate.style.display = 'block';
    menu.relocate.jumplstholder.style.display = 'none';
    menu.relocate.snptr.style.display = this.genome.snptable ? 'table-row' : 'none';
    if (param.showchr) {
        menu.c18.style.display = 'none';
        if (!this.is_gsv()) {
            var t = this.getDspStat();
            if (t[0] == t[2]) {
                menu.c18.style.display = 'block';
                var c = menu.c18_canvas;
                c.context = 1;
                var chrom = this.regionLst[0][0];
                this.genome.drawSinglechr_markInterval(c, chrom, this.dspBoundary.vstartc, this.dspBoundary.vstopc, 13, 2);
                c.chrom = chrom;
                c.chromlen = this.genome.scaffold.len[chrom];
                c.bpperpx = c.chromlen / c.width;
                var ctx = c.getContext('2d');
                ctx.fillStyle = colorCentral.foreground_faint_5;
                drawRuler_basepair(ctx, c.chromlen, c.width, 0, 22);
            }
        }
    }
    menu.relocate.div1.style.display = 'block';
    menu.relocate.div2.style.display = 'none';
    menu.relocate.div3.style.display = 'none';
// decide whether to show scfd-related options
    if (this.genome.linkagegroup) {
        menu.c24.style.display = 'none';
        menu.c43.style.display = 'block';
    } else {
        menu.c43.style.display = 'none';
        menu.c24.style.display = this.genome.scaffold.current.length > max_viewable_chrcount ? 'none' : 'block';
    }
};


Browser.prototype.getcoord4genenames = function (lst, callback) {
    var bbj = this;
    this.ajax('getcoord4genenames=on&scaffoldruntimenoupdate=on&dbName=' + this.genome.name +
        '&lst=' + lst.join(',') + '&searchgenetknames=' + this.genome.searchgenetknames.join(','),
        function (data) {
            bbj.getcoord4genenames_cb(data, callback);
        });
};

Browser.prototype.getcoord4genenames_cb = function (data, callback) {
    if (!data) {
        print2console('Server crashed', 2);
        callback(null);
        return;
    }
    if (!data.result) {
        print2console('result missing from getcoord4genenames', 2);
    }
    if (data.newscaffold) {
        this.ajax_scfdruntimesync();
    }
    callback(data.result);
};

/*** __jump__ ends ***/