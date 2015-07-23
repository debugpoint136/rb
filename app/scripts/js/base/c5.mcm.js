/**
 * Created by dpuru on 2/27/15.
 */
/*** __mcm__ colormap **/

Browser.prototype.mcm_mayaddgenome = function () {
    if (!this.mcm) return;
// show genome in mcm
    var mdi = getmdidx_internal();
    if (mdi == -1) return;
    for (var k = 0; k < this.mcm.lst.length; k++) {
        var mt = this.mcm.lst[k];
        if (mt[1] == mdi && mt[0] == literal_imd_genome) return k;
    }
    this.mcm.lst.push([literal_imd_genome, mdi]);
    return this.mcm.lst.length - 1;
};

Browser.prototype.showhide_term_in_mcm = function (term, show) {
    /* show or remove a term from mcm
     term follows bbj.mcm.lst style [term, mdidx]
     */
    if (!this.mcm) return;
    if (show) {
        for (var i = 0; i < this.mcm.lst.length; i++) {
            var t = this.mcm.lst[i];
            if (t[1] == term[1] && t[0] == term[0]) return;
        }
        this.mcm.lst.push(term);
    } else {
        for (var i = 0; i < this.mcm.lst.length; i++) {
            var s = this.mcm.lst[i];
            if (s[1] == term[1] && s[0] == term[0]) {
                this.mcm.lst.splice(i, 1);
                break;
            }
        }
    }
    this.initiateMdcOnshowCanvas();
    this.prepareMcm();
    this.drawMcm();
    this.__mcm_termchange();
};

function mcm_termname_click(event) {
// clicking on mcm term name canvas
    var bbj = gflag.browser;
    for (var i = 0; i < bbj.mcm.lst.length; i++) {
        var s = bbj.mcm.lst[i];
        if (s[1] == event.target.mdidx && s[0] == event.target.termname) break;
    }
    if (i == bbj.mcm.lst.length) return;
    bbj.mcm.sortidx = i;
    bbj.mcm.manuallysorted = true;
    bbj.mcm_sort();
}

function mcm_termname_MD(event) {
// for rearranging term canvas in mcm
    if (event.button != 0) return;
    event.preventDefault();
    var lst = gflag.browser.mcm.lst;
    for (var i = 0; i < lst.length; i++) {
        if (lst[i][1] == event.target.mdidx && lst[i][0] == event.target.termname) {
            break;
        }
    }
    gflag.mcmtermmove = {
        idx: i,
        mx: event.clientX
    };
    document.body.addEventListener('mousemove', mcm_termname_M, false);
    document.body.addEventListener('mouseup', mcm_termname_MU, false);
}

function mcm_termname_M(event) {
    event.preventDefault();
    var m = gflag.mcmtermmove;
    var bbj = gflag.browser;
    var mdlst = bbj.mcm.lst;
    if (event.clientX > m.mx) {
        // to right
        if (m.idx == mdlst.length - 1) return;
        if (event.clientX - m.mx >= tkAttrColumnWidth) {
            var ss = mdlst[m.idx + 1];
            mdlst[m.idx + 1] = mdlst[m.idx];
            mdlst[m.idx] = ss;
            bbj.initiateMdcOnshowCanvas();
            bbj.prepareMcm();
            bbj.drawMcm();
            m.mx = event.clientX;
            m.idx++;
        }
    } else if (event.clientX < m.mx) {
        // to left
        if (m.idx == 0) return;
        if (m.mx - event.clientX >= tkAttrColumnWidth) {
            var ss = mdlst[m.idx - 1];
            mdlst[m.idx - 1] = mdlst[m.idx];
            mdlst[m.idx] = ss;
            bbj.initiateMdcOnshowCanvas();
            bbj.prepareMcm();
            bbj.drawMcm();
            m.mx = event.clientX;
            m.idx--;
        }
    }
}
function mcm_termname_MU() {
    document.body.removeEventListener('mousemove', mcm_termname_M, false);
    document.body.removeEventListener('mouseup', mcm_termname_MU, false);
}

Browser.prototype.mcm_sort = function () {
    /* sort but not stuffing track doms!
     should call this to separate tracks in and out of ghm
     so that .where 1 and 2 are not mixed
     even when .mcm.lst is empty, can still run
     */
    if (!this.mcm || !this.mcm.lst) return;
    if (this.weaver && this.weaver.iscotton) {
        // only applies to target
        return;
    }
    var hmlst = [], nhlst = [];
    for (var i = 0; i < this.tklst.length; i++) {
        var tk = this.tklst[i];
        if (tk.where == 1) {
            hmlst.push(tk);
        } else {
            nhlst.push(tk);
        }
    }
    if (this.mcm.lst.length == 0) {
        this.tklst = hmlst.concat(nhlst);
        return;
    }
    if (this.mcm.sortidx >= this.mcm.lst.length) {
        this.mcm.sortidx = 0;
    }
    if (this.weaver) {
        var mdi = getmdidx_internal();
        var t = this.mcm.lst[this.mcm.sortidx];
        if (t[1] == mdi && t[0] == literal_imd_genome) {
            // in case of weaving and clicking genome term name, will sort all tracks by genome
            var ttk = [];
            var g2tk = {};
            for (var n in this.weaver.q) {
                g2tk[n] = [];
            }
            for (var i = 0; i < this.tklst.length; i++) {
                var tk = this.tklst[i];
                tk.where = 1;
                tk.atC.style.display = 'block';
                if (tk.cotton) {
                    g2tk[tk.cotton].push(tk);
                } else {
                    ttk.push(tk);
                }
            }
            for (var n in g2tk) {
                // add weavertk first
                var lst = g2tk[n];
                for (var i = 0; i < lst.length; i++) {
                    if (lst[i].ft == FT_weaver_c) {
                        ttk.push(lst[i]);
                        break;
                    }
                }
                for (var i = 0; i < lst.length; i++) {
                    if (lst[i].ft != FT_weaver_c) {
                        ttk.push(lst[i]);
                    }
                }
            }
            this.tklst = ttk;
            this.trackdom2holder();
            return;
        }
    }
    var m2tk = {_empty_: []};
    for (var i = 0; i < hmlst.length; i++) {
        var tk = hmlst[i];
        var av = tk.attrlst[this.mcm.sortidx];
        if (av == undefined) {
            m2tk._empty_.push(tk);
        } else {
            if (av in m2tk) {
                m2tk[av].push(tk);
            } else {
                m2tk[av] = [tk];
            }
        }
    }
    var newlst = [];
    for (var av in m2tk) {
        if (av == '_empty_') continue;
        for (var i = 0; i < m2tk[av].length; i++) {
            newlst.push(m2tk[av][i]);
        }
    }
    if ('_empty_' in m2tk) {
        for (var i = 0; i < m2tk._empty_.length; i++) {
            newlst.push(m2tk._empty_[i]);
        }
    }
    this.tklst = newlst.concat(nhlst);
    this.trackdom2holder();
    for (var sk in this.splinters) {
        var b = this.splinters[sk];
        if (b.tklst.length != this.tklst.length) continue;
        // cannot call mcm_sort on splinter, no mcm
        var newlst = [];
        for (var i = 0; i < this.tklst.length; i++) {
            var n = this.tklst[i].name + this.tklst[i].cotton;
            for (var j = 0; j < b.tklst.length; j++) {
                var t2 = b.tklst[j];
                if (t2.name + t2.cotton == n) {
                    newlst.push(t2);
                    break;
                }
            }
        }
        b.tklst = newlst;
        b.trackdom2holder();
    }
};

Browser.prototype.prepareMcm = function () {
    /* requires:
     bbj.mcm.lst and tklst[x].md
     */
// wipe out old data
    if (!this.mcm || !this.mcm.lst) return;
    for (var i = 0; i < this.tklst.length; i++) {
        var tk = this.tklst[i];
        if (tkishidden(tk)) continue;
        tk.attrlst = [];
        tk.attrcolor = [];
    }
    for (i = 0; i < this.mcm.lst.length; i++) {
        this.prepareMcM_oneterm(i);
    }
};

Browser.prototype.prepareMcM_oneterm = function (mdcidx) {
    /* arg: bbj.mcm.lst array index
     make tk.attrlst[mdcidx] for each track
     different treatment for native/custom metadata

     ! expansion: md may supply color for each term
     */
    var term = this.mcm.lst[mdcidx][0];
    var tidhash = {};
    for (var i = 0; i < this.tklst.length; i++) {
        this.recursiveFetchTrackAttr(term, mdcidx, this.tklst[i]);
        var tid = this.tklst[i].attrlst[mdcidx];
        if (tid != undefined) {
            tidhash[tid] = 1;
        }
    }
    var i = 0, clen = colorCentral.longlst.length;
    var mdobj = gflag.mdlst[this.mcm.lst[mdcidx][1]];
    for (var tid in tidhash) {
        if (tid in mdobj.idx2color) {
            tidhash[tid] = mdobj.idx2color[tid];
        } else {
            if (i >= clen) {
                var f = parseInt(i / clen);
                tidhash[tid] = darkencolor(colorstr2int(colorCentral.longlst[i % clen]), f < 10 ? f / 10 : 1);
            } else {
                tidhash[tid] = colorCentral.longlst[i];
            }
            i++;
        }
    }
    for (i = 0; i < this.tklst.length; i++) {
        var t = this.tklst[i];
        var tid = t.attrlst[mdcidx];
        t.attrcolor[mdcidx] = (tid == undefined) ? colorCentral.foreground_faint_5 : tidhash[tid];
    }
};

Browser.prototype.getHmtkIdxlst_mcmCell = function (mcidx, tkname, cotton) {
    /* args:
     mcidx: bbj.mcm.lst array idx
     tkname: hmtk name
     return null if clicked on an area with no annotation data
     */
    var tkidx = -1;
    for (var i = 0; i < this.tklst.length; i++) {
        if (this.tklst[i].name == tkname) {
            if (cotton && this.tklst[i].cotton == cotton) {
                tkidx = i;
                break;
            } else if (!cotton && !this.tklst[i].cotton) {
                tkidx = i;
                break;
            }
        }
    }
    if (tkidx == -1) return null;
    var m = this.tklst[tkidx].attrlst[mcidx];
    if (m == undefined) return null;
// all tracks in the same color block
    var tkarr = [tkidx];
    for (i = tkidx - 1; i >= 0; i--) {
        if (this.tklst[i].attrlst[mcidx] == m)
            tkarr.unshift(i);
        else
            break;
    }
    for (i = tkidx + 1; i < this.tklst.length; i++) {
        if (this.tklst[i].where != 1) break;
        if (this.tklst[i].attrlst[mcidx] == m)
            tkarr.push(i);
        else
            break;
    }
    return tkarr;
};

Browser.prototype.movetk_hmtk = function (tkidxlst, up) {
    /* a group of them can be moved at same time
     but only move up/down for one track at each move
     this is not supposed to be called on splinters
     */
    var hmlst = [], nhlst = [], hidelst = [];
    for (var i = 0; i < this.tklst.length; i++) {
        var t = this.tklst[i];
        if (tkishidden(t)) {
            hidelst.push(t);
        }
        else if (t.where == 1) {
            hmlst.push(t);
        }
        else {
            nhlst.push(t);
        }
    }
    if (up) {
        var el = hmlst.splice(tkidxlst[0] - 1, 1)[0];
        hmlst.splice(tkidxlst[tkidxlst.length - 1], 0, el);
    } else {
        var el = hmlst.splice(tkidxlst[tkidxlst.length - 1] + 1, 1)[0];
        hmlst.splice(tkidxlst[0], 0, el);
    }
    var d1 = this.hmdiv;
    var d2 = this.mcm ? this.mcm.tkholder : null;
    var d3 = this.hmheaderdiv;
    for (var i = 0; i < hmlst.length; i++) {
        var t = hmlst[i];
        if (t.canvas) {
            d1.appendChild(t.canvas);
        }
        if (d2 && t.atC) {
            d2.appendChild(t.atC);
        }
        if (d3 && t.header) {
            d3.appendChild(t.header);
        }
    }
    this.tklst = hmlst.concat(nhlst.concat(hidelst));
    this.splinterSynctkorder();
};


Browser.prototype.mcmPlaceheader = function () {
    var m = this.mcm;
    if (!m || !m.holder) return;
    /* this is to escape for alethiometer
     */
    var lst = m.holder.firstChild.firstChild.childNodes;
    if (m.holder.attop == undefined) {
        for (var i = 0; i < lst.length; i++)
            lst[i].vAlign = 'bottom';
        return;
    }
    if (m.holder.attop) {
        m.headerholder_top.appendChild(m.holder);
        m.holder.style.top = '';
        m.holder.style.bottom = 0;
    } else {
        m.headerholder_bottom.appendChild(m.holder);
        m.holder.style.top = 0;
        m.holder.style.bottom = '';
    }
    for (var i = 0; i < lst.length; i++) {
        lst[i].vAlign = m.holder.attop ? 'bottom' : 'top';
    }
};


function show_mcmColorConfig() {
// called by clicking menu.c9
    menu_shutup();
    menu.style.left = Math.min(parseInt(menu.style.left), document.body.clientWidth - 300);
    var holder = menu.c9.nextSibling;
    holder.style.display = 'block';
    stripChild(holder, 0);
    var tr = holder.insertRow(0);
    var td = tr.insertCell(0);
    td.colSpan = 3;
    td.innerHTML = 'Change color setting<div style="color:#858585;font-size:60%;">These colors are used to paint metadata color map</div>';
    for (var i = 0; i < 3; i++) {
        tr = holder.insertRow(-1);
        for (var j = 0; j < 3; j++) {
            var sid = i * 3 + j;
            td = tr.insertCell(-1);
            td.innerHTML = '&nbsp;';
            td.style.backgroundColor = colorCentral.longlst[sid];
            td.sid = sid;
            td.addEventListener('click', mcm_configcolor_initiate, false);
        }
    }
    td = holder.insertRow(-1).insertCell(0);
    td.colSpan = 3;
    td.innerHTML = '<button type=button onclick=mcm_configcolor_restore()>Restore default settings</button>';
}

function mcm_configcolor_restore() {
    var lst = [];
    for (var i = 0; i < colorCentral.longlst_bk.length; i++) lst.push(colorCentral.longlst_bk[i]);
    colorCentral.longlst = lst;
    show_mcmColorConfig();
    gflag.menu.bbj.drawMcm(false);
}


function mcm_configcolor_initiate(event) {
    paletteshow(event.clientX, event.clientY, 12);
    palettegrove_paint(event.target.style.backgroundColor);
    menu.colorlonglstcell = event.target;
}
function mcm_configcolor() {
    var c = menu.colorlonglstcell;
    c.style.backgroundColor =
        colorCentral.longlst[c.sid] = palette.output;
    gflag.menu.bbj.drawMcm(false);
}

function mcm_Mdown(event) {
    /* press mouse on .atC */
    if (event.button != 0) return;
    event.preventDefault();
    var pos = absolutePosition(event.target);
    var mcidx = parseInt((event.clientX + document.body.scrollLeft - pos[0]) / tkAttrColumnWidth);
    var bbj = gflag.browser;
    var tkarr = bbj.getHmtkIdxlst_mcmCell(mcidx, event.target.tkname, event.target.cotton);
    if (tkarr == null) return;
    var lst = [];
    for (var i = 0; i < tkarr.length; i++) {
        lst.push(bbj.tklst[tkarr[i]]);
    }
    bbj.highlighttrack(lst);
    gflag.mcmMove = {
        bbj: bbj,
        oldy: event.clientY + document.body.scrollTop,
        basey: absolutePosition(event.target.parentNode)[1],
        tkarr: tkarr,
        midx: mcidx
    };
    document.body.addEventListener('mousemove', mcmMoveM, false);
    document.body.addEventListener('mouseup', mcmMoveMU, false);
}
function mcmMoveM(event) {
    var m = gflag.mcmMove;
    var bbj = m.bbj;
    var cy = event.clientY + document.body.scrollTop;
    var up = true;
    if (cy > m.oldy) {
        if (cy > m.basey + bbj.hmdiv.clientHeight) return;
        up = false;
    } else if (cy < m.oldy) {
        if (cy < m.basey) return;
    } else {
        return;
    }
    if (up) {
        if (m.tkarr[0] == 0) return;
        if (m.oldy - cy >= tk_height(bbj.tklst[m.tkarr[0] - 1])) {
            bbj.movetk_hmtk(m.tkarr, true);
            m.oldy = cy;
            m.tkarr = bbj.getHmtkIdxlst_mcmCell(m.midx, bbj.tklst[m.tkarr[0] - 1].name, bbj.tklst[m.tkarr[0] - 1].cotton);
            var lst = [];
            for (var i = 0; i < m.tkarr.length; i++) lst.push(bbj.tklst[m.tkarr[i]]);
            bbj.highlighttrack(lst);
        }
    } else {
        if (m.tkarr[m.tkarr.length - 1] == bbj.hmdiv.childNodes.length - 1) return;
        if (cy - m.oldy >= tk_height(bbj.tklst[m.tkarr[m.tkarr.length - 1] + 1])) {
            bbj.movetk_hmtk(m.tkarr, false);
            m.oldy = cy;
            m.tkarr = bbj.getHmtkIdxlst_mcmCell(m.midx, bbj.tklst[m.tkarr[m.tkarr.length - 1] + 1].name, bbj.tklst[m.tkarr[m.tkarr.length - 1] + 1].cotton);
            var lst = [];
            for (var i = 0; i < m.tkarr.length; i++) lst.push(bbj.tklst[m.tkarr[i]]);
            bbj.highlighttrack(lst);
        }
    }
}

function mcmMoveMU(event) {
    indicator3.style.display = 'none';
    document.body.removeEventListener('mousemove', mcmMoveM, false);
    document.body.removeEventListener('mouseup', mcmMoveMU, false);
}

function mcm_tooltipmove(event) {
// show pica over mcm track canvas
    var bbj = gflag.browser;
    var tk = bbj.findTrack(event.target.tkname, event.target.cotton);
    var pos = absolutePosition(event.target);
// mcm.lst idx
    var mcidx = parseInt((event.clientX + document.body.scrollLeft - pos[0]) / tkAttrColumnWidth);
    var m = tk.attrlst[mcidx];
    if (m == undefined) {
        pica.style.display = 'none';
        return;
    }
    pica.style.display = 'block';
    var voc = gflag.mdlst[bbj.mcm.lst[mcidx][1]];
    var plst = [];
    for (var x in voc.c2p[m]) {
        plst.push(x);
    }
    picasays.innerHTML = (m in voc.idx2attr ? voc.idx2attr[m] : m) +
    (m in voc.idx2desc ? '<div style="color:white;font-size:80%;">' + voc.idx2desc[m] + '</div>' : '') +
    '<div style="margin-top:5px;color:white;font-size:80%;">parent: ' +
    plst.join(', ') + '</div>';
    pica_go(event.clientX, event.clientY);
}

function mcm_Mover(event) {
    var bbj = gflag.browser;
    var tk = bbj.findTrack(event.target.tkname, event.target.cotton);
    tk.header.style.backgroundColor = colorCentral.tkentryfill;
}
function mcm_Mout(event) {
    var bbj = gflag.browser;
    var tk = bbj.findTrack(event.target.tkname, event.target.cotton);
    tk.header.style.backgroundColor = 'transparent';
    pica.style.display = 'none';
}

function mcm_addterm_closure(term) {
    return function () {
        mcm_addterm(term);
    };
}
function mcm_addterm(term) {
    gflag.menu.bbj.showhide_term_in_mcm(term, true);
}


/*** __mcm__ over **/
