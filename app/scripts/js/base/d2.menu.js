/**
 * Created by dpuru on 2/27/15.
 */
/*** __menu__ context menu ***/
function menu_mover() {
    document.body.removeEventListener("mousedown", menu_hide, false);
}
function menu_mout() {
    document.body.addEventListener("mousedown", menu_hide, false);
}

function menu_appoption(holder, icon, name, desc, callback) {
    var d = dom_create('div', holder);
    d.className = 'menuactivechoice';
    d.addEventListener('click', callback, false);
    var t = dom_create('table', d, 'color:inherit;white-space:nowrap');
    var tr = t.insertRow(0);
    var td = tr.insertCell(0);
//td.className='appicon';
//td.innerHTML=icon;
    td = tr.insertCell(1);
    td.style.paddingLeft = 10;
    td.innerHTML = (desc ? '<strong>' + name + '</strong>' : name) +
    (desc ? '<br><span style="font-size:80%;opacity:0.7;">' + desc + '</span>' : '');
}

function menu_addoption(icon, label, callback, holder) {
    /* make a new menu option
     */
    var d = dom_create('div', holder);
    d.className = 'menuactivechoice';
    if (icon) {
        var d2 = dom_create('div', d);
        d2.className = 'iconholder';
        d2.innerHTML = icon;
    }
    if (label) {
        var s = dom_addtext(d, label);
        s.style.whiteSpace = 'nowrap';
        s.style.marginLeft = 10;
    }
    if (callback) {
        d.addEventListener('click', callback, false);
    }
    return d;
}

function menu_shutup() {
    for (var i = 0; i < menu.childNodes.length; i++) {
        var n = menu.childNodes[i];
        if (n.nodeType == 1) n.style.display = 'none';
    }
}

function menu_show_beneathdom(ctxt, dom, xadjust) {
// xadjust is for parent element scrollLeft, cannot fix this in absolutePosition
    var p = absolutePosition(dom);
    menu_show(ctxt, p[0] - 10 - document.body.scrollLeft - (xadjust ? xadjust : 0), p[1] - 8 - document.body.scrollTop + dom.offsetHeight);
}

function menu_show(ctxt, x, y) {
    /* x/y are optional,
     must not contain body.scroll offset
     set to -1 for not changing position
     */
    pica.style.display = 'none';
    menu.style.display = 'block';
    if (x == undefined) {
        x = parseInt(menu.style.left) - 10;
        y = parseInt(menu.style.top) - 10;
    }
    setTimeout('placePanel(menu,' + x + '+10+document.body.scrollLeft,' + y + '+10+document.body.scrollTop);menu.style.maxHeight="' + maxHeight_menu + '";', 1);
    document.body.addEventListener('mousedown', menu_hide, false);
    gflag.menu.bbj = gflag.browser;
    gflag.menu.context = ctxt;
}
function menu_hide() {
    indicator3.style.display =
        indicator7.style.display =
            indicator6.style.display =
                invisibleBlanket.style.display =
                    menu.style.display = 'none';
    menu.style.maxHeight = 1;
    document.body.removeEventListener('mousedown', menu_hide, false);
    gflag.menu.context = null;
}

function menu_mcm_header(event) {
// over a mcm header term
    menu_shutup();
    menu_show(8, event.clientX, event.clientY);
    menu.c4.style.display = menu.c25.style.display = 'block';
    if (menu.c23)
        menu.c23.style.display = 'block';
    gflag.menu.bbj = gflag.browser;
    gflag.menu.idx = parseInt((event.clientX + document.body.scrollLeft - absolutePosition(gflag.browser.mcm.holder)[0]) / tkAttrColumnWidth);
    return false;
}

function fontpanel_set(tk) {
    menu.font.style.display = 'block';
    if (tk.qtc.fontfamily) {
        var lst = menu.font.family.options;
        for (var i = 0; i < lst.length; i++) {
            if (lst[i].value == tk.qtc.fontfamily) {
                menu.font.family.selectedIndex = i;
                break;
            }
        }
    }
    if (tk.qtc.fontbold != undefined) {
        menu.font.bold.checked = tk.qtc.fontbold;
    }
    if (tk.qtc.textcolor) {
        menu.font.color.style.backgroundColor = tk.qtc.textcolor;
        menu.font.color.style.display = 'inline';
    } else {
        menu.font.color.style.display = 'none';
    }
}


function config_cmtk(tk) {
    menu.c14.style.display = 'block';
    menu.c14.unify.style.display = 'none';
    menu.c45.style.display = 'block';
    menu.c45.combine_chg.div.style.display = 'none';
    if (tk.cm.set.rd_r) {
        // has two strands
        menu.c45.combine_notshown.style.display = 'none';
        menu.c45.combine.parentNode.style.display = 'block';
        menu.c45.combine.checked = tk.cm.combine;
        if (tk.cm.set.chg_f && tk.cm.set.chg_r && tk.cm.combine) {
            menu.c45.combine_chg.div.style.display = 'block';
            menu.c45.combine_chg.checkbox.checked = tk.cm.combine_chg;
        }
    } else {
        menu.c45.combine_notshown.style.display = 'block';
        menu.c45.combine.parentNode.style.display = 'none';
        menu.c45.combine.checked = false;
    }
    menu.c45.scale.checked = tk.cm.scale;
    if (tk.cm.filter > 0) {
        menu.c45.filter.checkbox.checked = true;
        menu.c45.filter.div.style.display = 'block';
        menu.c45.filter.input.value = tk.cm.filter;
    } else {
        menu.c45.filter.checkbox.checked = false;
        menu.c45.filter.div.style.display = 'none';
    }
    var hasreverse = tk.cm.set.rd_r;
    var t = menu.c45.table;
    stripChild(t, 0);
    var tr = t.insertRow(0);
    tr.insertCell(0);
    var td = tr.insertCell(1);
    td.align = 'center';
    td.style.fontSize = '70%';
    td.innerHTML = 'forward / comb.';
    if (hasreverse) {
        td = tr.insertCell(2);
        td.align = 'center';
        td.style.fontSize = '70%';
        td.innerHTML = 'reverse';
    }
    tr = t.insertRow(-1);
    td = tr.insertCell(0);
    td.align = 'right';
    td.innerHTML = 'CG';
    td = tr.insertCell(-1);
    var c = dom_create('canvas', td, 'background-color:' + tk.cm.color.cg_f);
    c.width = 36;
    c.height = 20;
    c.which = 'cg_f';
    c.addEventListener('click', cmtk_color_initiate, false);
    c = dom_create('canvas', td, 'background-color:' + tk.cm.bg.cg_f);
    c.width = 36;
    c.height = 20;
    c.which = 'cg_f';
    c.addEventListener('click', cmtk_color_initiate, false);
    c.bg = true;
    if (hasreverse) {
        td = tr.insertCell(-1);
        c = dom_create('canvas', td, 'background-color:' + tk.cm.color.cg_r);
        c.width = 36;
        c.height = 20;
        c.which = 'cg_r';
        c.addEventListener('click', cmtk_color_initiate, false);
        c = dom_create('canvas', td, 'background-color:' + tk.cm.bg.cg_r);
        c.width = 36;
        c.height = 20;
        c.which = 'cg_r';
        c.addEventListener('click', cmtk_color_initiate, false);
        c.bg = true;
    }
    if (tk.cm.set.chg_f) {
        tr = t.insertRow(-1);
        td = tr.insertCell(0);
        td.align = 'right';
        td.innerHTML = 'CHG';
        td = tr.insertCell(-1);
        c = dom_create('canvas', td, 'background-color:' + tk.cm.color.chg_f);
        c.width = 36;
        c.height = 20;
        c.addEventListener('click', cmtk_color_initiate, false);
        c.which = 'chg_f';
        c = dom_create('canvas', td, 'background-color:' + tk.cm.bg.chg_f);
        c.width = 36;
        c.height = 20;
        c.which = 'chg_f';
        c.addEventListener('click', cmtk_color_initiate, false);
        c.bg = true;
        if (hasreverse) {
            td = tr.insertCell(-1);
            c = dom_create('canvas', td, 'background-color:' + tk.cm.color.chg_r);
            c.width = 36;
            c.height = 20;
            c.which = 'chg_r';
            c.addEventListener('click', cmtk_color_initiate, false);
            c = dom_create('canvas', td, 'background-color:' + tk.cm.bg.chg_r);
            c.width = 36;
            c.height = 20;
            c.which = 'chg_r';
            c.addEventListener('click', cmtk_color_initiate, false);
            c.bg = true;
        }
    }
    if (tk.cm.set.chh_f) {
        tr = t.insertRow(-1);
        td = tr.insertCell(0);
        td.align = 'right';
        td.innerHTML = 'CHH';
        td = tr.insertCell(-1);
        c = dom_create('canvas', td, 'background-color:' + tk.cm.color.chh_f);
        c.width = 36;
        c.height = 20;
        c.which = 'chh_f';
        c.addEventListener('click', cmtk_color_initiate, false);
        c = dom_create('canvas', td, 'background-color:' + tk.cm.bg.chh_f);
        c.width = 36;
        c.height = 20;
        c.which = 'chh_f';
        c.addEventListener('click', cmtk_color_initiate, false);
        c.bg = true;
        if (hasreverse) {
            td = tr.insertCell(-1);
            c = dom_create('canvas', td, 'background-color:' + tk.cm.color.chh_r);
            c.width = 36;
            c.height = 20;
            c.which = 'chh_r';
            c.addEventListener('click', cmtk_color_initiate, false);
            c = dom_create('canvas', td, 'background-color:' + tk.cm.bg.chh_r);
            c.width = 36;
            c.height = 20;
            c.which = 'chh_r';
            c.addEventListener('click', cmtk_color_initiate, false);
            c.bg = true;
        }
    }
    tr = t.insertRow(-1);
    td = tr.insertCell(0);
    td.innerHTML = 'read depth';
    td = tr.insertCell(-1);
    c = dom_create('canvas', td, 'background-color:' + tk.cm.color.rd_f);
    c.width = 50;
    c.height = 20;
    c.which = 'rd_f';
    c.addEventListener('click', cmtk_color_initiate, false);
    if (hasreverse) {
        td = tr.insertCell(-1);
        c = dom_create('canvas', td, 'background-color:' + tk.cm.color.rd_r);
        c.width = 50;
        c.height = 20;
        c.which = 'rd_r';
        c.addEventListener('click', cmtk_color_initiate, false);
    }
// smoothing for rd
    menu.c46.style.display = 'block';
    if (tk.cm.set.rd_f.qtc.smooth) {
        menu.c46.checkbox.checked = true;
        menu.c46.div.style.display = 'block';
        menu.c46.says.innerHTML = tk.cm.set.rd_f.qtc.smooth + '-pixel window';
    } else {
        menu.c46.checkbox.checked = false;
        menu.c46.div.style.display = 'none';
    }
}

function config_numerical(tk) {
    var q = tk.qtc;
    qtcpanel_setdisplay({
        qtc: q,
        color1: 'rgb(' + q.pr + ',' + q.pg + ',' + q.pb + ')',
        color1text: 'positive',
        color2: 'rgb(' + q.nr + ',' + q.ng + ',' + q.nb + ')',
        color2text: 'negative',
        ft: tk.ft,
    });
    menu.c14.style.display = 'block';
    menu.c14.unify.style.display = 'none';
    menu.c51.sharescale.style.display = tk.group != undefined ? 'block' : 'none';
}
function config_cat(tk) {
    cateCfg_show(tk, false);
}
function config_density(tk) {
    qtcpanel_setdisplay({
        qtc: tk.qtc,
        color1: 'rgb(' + tk.qtc.pr + ',' + tk.qtc.pg + ',' + tk.qtc.pb + ')',
        ft: tk.ft,
    });
    menu.c14.style.display = 'block';
    menu.c14.unify.style.display = 'none';
    menu.c59.style.display = 'none';
    menu.c51.sharescale.style.display = tk.group != undefined ? 'block' : 'none';
}
function config_ld(tk) {
// not density mode
    menu.c49.style.display = 'block';
    menu.c49.color.style.backgroundColor = 'rgb(' + tk.qtc.pr + ',' + tk.qtc.pg + ',' + tk.qtc.pb + ')';
    menu.c14.style.display = 'block';
    menu.c14.unify.style.display = 'none';
    config_hammock(tk);
    menu.font.style.display = menu.bed.style.display = 'none';
}

function config_hammock(tk) {
    /* not density
     can be nested inside other tracks that derives from hammock format
     */
    fontpanel_set(tk);
    if (tk.mode == M_bar) {
        menu.c14.style.display = 'block';
        menu.c14.unify.style.display = 'none';
    }
    if (tk.cateInfo) {
        // TODO text color is same as item color
        menu.font.color.style.display = 'none';
        menu.bed.style.display = 'none';
        cateCfg_show(tk, false, true);
    } else {
        // all items have same color, separate color for item/text
        menu.font.color.style.display = 'inline';
        menu.bed.style.display = 'block';
        menu.bed.color.style.backgroundColor = tk.qtc.bedcolor;
    }
    if (tk.showscoreidx != undefined) {
        menu.c48.style.display = 'block';
        stripChild(menu.c48, 0);
        var n = Math.random().toString();
        dom_create('div', menu.c48, 'opacity:0.5;margin-bottom:8px;').innerHTML = 'Apply score';
        if (tk.group != undefined) {
            dom_create('div', menu.c48, 'margin:5px 5px 15px 5px;padding:5px;background-color:rgba(255,204,51,.5);font-size:70%;text-align:center;', {t: 'This track shares Y scale with other tracks.'});
        }
        for (var i = -1; i < tk.scorenamelst.length; i++) {
            var d0 = dom_create('div', menu.c48);
            var ip = dom_create('input', d0);
            ip.type = 'radio';
            ip.setAttribute('name', n);
            ip.id = n + (i == -1 ? 'n' : i);
            ip.checked = tk.showscoreidx == i;
            ip.idx = i;
            ip.addEventListener('change', menu_hammock_choosescore, false);
            var lb = dom_create('label', d0);
            lb.setAttribute('for', ip.id);
            lb.innerHTML = ' ' + (i == -1 ? 'do not use score' : tk.scorenamelst[i]);
            if (i != -1) {
                var d = dom_create('div', menu.c48, null, {c: 'menushadowbox'});
                d.style.display = i == tk.showscoreidx ? 'block' : 'none';
                var scale = tk.scorescalelst[i];
                var tt;
                if (scale.min_fixed != undefined) {
                    tt = 'auto (min set at ' + scale.min_fixed + ')';
                } else if (scale.max_fixed != undefined) {
                    tt = 'auto (max set at ' + scale.max_fixed + ')';
                } else {
                    tt = 'automatic scale';
                }
                dom_addselect(d, menu_hammock_changescale,
                    [{text: tt, value: scale_auto, selected: scale_auto == scale.type},
                        {text: 'fixed scale', value: scale_fix, selected: scale_fix == scale.type}]);
                var d2 = dom_create('div', d);
                d2.style.display = scale.type == scale_fix ? 'block' : 'none';
                dom_addtext(d2, 'min: ');
                dom_inputnumber(d2, {width: 50, value: scale.min});
                dom_addtext(d2, ' max: ');
                dom_inputnumber(d2, {width: 50, value: scale.max});
                dom_addbutt(d2, 'set', menu_hammock_setfixscale);
            }
        }
    }
}

function menu_hammock_changescale(event) {
// from <select>
    var s = event.target;
    var scale = parseInt(s.options[s.selectedIndex].value);
    gflag.menu.hammock_focus = {type: scale};
    s.nextSibling.style.display = scale == scale_fix ? 'block' : 'none';
    if (scale == scale_fix) return;
    menu_update_track(29);
}

function menu_hammock_setfixscale(event) {
// press button
    var t = event.target.parentNode;
    var min = parseFloat(t.childNodes[1].value);
    var max = parseFloat(t.childNodes[3].value);
    if (isNaN(min) || isNaN(max) || min >= max) {
        print2console('wrong min/max value', 2);
        return;
    }
    gflag.menu.hammock_focus = {min: min, max: max};
    menu_update_track(28);
}

function config_bam(tk) {
// not density
    fontpanel_set(tk);
    menu.bam.style.display = 'block';
    menu.bam.f.style.backgroundColor = tk.qtc.forwardcolor;
    menu.bam.r.style.backgroundColor = tk.qtc.reversecolor;
    menu.bam.m.style.backgroundColor = tk.qtc.mismatchcolor;
}
function config_weaver(tk) {
    menu.c14.style.display = tk.weaver.mode == W_rough ? 'block' : 'none';
    menu.c14.unify.style.display = 'none';
}

function config_lr(tk) {
// not density
    if (tk.mode == M_full) {
        fontpanel_set(tk);
    } else if (tk.mode == M_trihm) {
        menu.c14.style.display = 'block';
        menu.c14.unify.style.display = 'none';
    }
    menu.lr.style.display = 'block';
    longrange_showplotcolor('rgb(' + tk.qtc.pr + ',' + tk.qtc.pg + ',' + tk.qtc.pb + ')', 'rgb(' + tk.qtc.nr + ',' + tk.qtc.ng + ',' + tk.qtc.nb + ')');
    menu.lr.autoscale.parentNode.style.display = 'block';
    menu.lr.autoscale.checked = tk.qtc.thtype == scale_auto;
    menu.lr.pcscore.parentNode.style.display = menu.lr.ncscore.parentNode.style.display = tk.qtc.thtype == scale_auto ? 'none' : 'inline';
    menu.lr.pcscoresays.style.display = menu.lr.ncscoresays.style.display = tk.qtc.thtype == scale_auto ? 'inline' : 'none';
    menu.lr.pcscore.value = tk.qtc.pcolorscore;
    menu.lr.pcscoresays.innerHTML = tk.qtc.pcolorscore;
    menu.lr.ncscore.value = tk.qtc.ncolorscore;
    menu.lr.ncscoresays.innerHTML = tk.qtc.ncolorscore;
    menu.lr.pfscore.value = tk.qtc.pfilterscore;
    menu.lr.nfscore.value = tk.qtc.nfilterscore;
    menu.lr.pfscore.parentNode.style.display = menu.lr.nfscore.parentNode.style.display = 'block';
}
function config_dispatcher(tk) {
    if (tk.mode == M_den) {
        config_density(tk);
        return;
    }
    switch (tk.ft) {
        case FT_matplot:
            config_matplot(tk);
            break;
        case FT_cm_c:
            config_cmtk(tk);
            break;
        case FT_bedgraph_c:
        case FT_bedgraph_n:
        case FT_bigwighmtk_c:
        case FT_bigwighmtk_n:
        case FT_qdecor_n:
            config_numerical(tk);
            break;
        case FT_cat_c:
        case FT_cat_n:
        case FT_catmat:
        case FT_qcats:
            config_cat(tk);
            break;
        case FT_bed_c:
        case FT_bed_n:
        case FT_anno_n:
        case FT_anno_c:
            config_hammock(tk);
            break;
        case FT_lr_n:
        case FT_lr_c:
            config_lr(tk);
            break;
        case FT_bam_c:
        case FT_bam_n:
            config_bam(tk);
            break;
        case FT_ld_c:
        case FT_ld_n:
            config_ld(tk);
            break;
        case FT_weaver_c:
            config_weaver(tk);
            break;
        default:
            fatalError('single tk unknown ft');
    }
}


function menuConfig() {
    menu_shutup();
    var m = gflag.menu;
    var bbj = m.bbj;
    if (m.context == 1) {
        // single track from main browser panel
        menu.c53.style.display = 'block';
        menu.c53.checkbox.checked = false;
        var tk = m.tklst[0];
        // bg applies to everyone
        menu.c44.style.display = 'block';
        if (tk.qtc.bg) {
            menu.c44.checkbox.checked = true;
            menu.c44.color.style.display = 'block';
            menu.c44.color.style.backgroundColor = tk.qtc.bg;
        } else {
            menu.c44.checkbox.checked = false;
            menu.c44.color.style.display = 'none';
        }
        config_dispatcher(tk);
    } else if (m.context == 2) {
        /* right click on mcm block for tracks in ghm, confusing as any tracks can be here
         or multi-selection
         */
        menu.c53.checkbox.checked = false;
        if (m.tklst.length == 1) {
            m.context = 1;
            menuConfig();
        } else {
            menu.c44.style.display = 'block'; // tk bg
            menu.c44.checkbox.checked = false;
            menu.c44.color.style.display = 'none';
            var ft = {};
            var den = [];
            var nft = FT_nottk, count = 0; // most abundant tk
            // will only show config table of one ft, so need to prioritize
            for (var i = 0; i < m.tklst.length; i++) {
                var t = m.tklst[i];
                if (t.mode == M_den) {
                    den.push(i);
                } else {
                    if (t.ft in ft) {
                        ft[t.ft].push(i);
                    } else {
                        ft[t.ft] = [i];
                    }
                    var c = ft[t.ft].length;
                    if (c > count) {
                        count = c;
                        nft = t.ft;
                    }
                }
            }
            if (den.length > count) {
                // density mode tk wins
                config_density(m.tklst[den[0]])
            } else {
                if (nft == FT_cat_c || nft == FT_cat_n) {
                    // but do not show cat config as each tk has its own cateInfo
                    menu.c14.style.display = menu.c44.style.display = 'block';
                    menu.c44.checkbox.checked = false;
                    menu.c44.color.style.display = 'none';
                } else {
                    config_dispatcher(m.tklst[ft[nft][0]]);
                }
            }
            menu.c14.unify.style.display = 'table-cell';
        }
    } else {
        fatalError("unknown menu context id");
    }
    placePanel(menu, parseInt(menu.style.left), parseInt(menu.style.top));
}


function menuMcmflip() {
    var m = gflag.menu.bbj.mcm;
    m.holder.attop = !m.holder.attop;
    gflag.menu.bbj.mcmPlaceheader();
    menu_hide();
}


Browser.prototype.removeTrack_obj = function (objlst) {
    var lst = [];
    for (var i = 0; i < objlst.length; i++) {
        var tk = objlst[i];
        lst.push(tk.name);
        if (tk.ft == FT_cm_c) {
            var s = tk.cm.set;
            if (s.cg_f) lst.push(s.cg_f.name);
            if (s.cg_r) lst.push(s.cg_r.name);
            if (s.chg_f) lst.push(s.chg_f.name);
            if (s.chg_r) lst.push(s.chg_r.name);
            if (s.chh_f) lst.push(s.chh_f.name);
            if (s.chh_r) lst.push(s.chh_r.name);
            if (s.rd_f) lst.push(s.rd_f.name);
            if (s.rd_r) lst.push(s.rd_r.name);
        } else if (tk.ft == FT_matplot) {
            for (var j = 0; j < tk.tracks.length; j++) {
                lst.push(tk.tracks[j].name);
            }
        }
    }
    this.removeTrack(lst);
};


function menuRemove() {
    /* remove/hide/turnoff things depend on context
     remove a thing through menu 'remove' option
     */
    var _context = gflag.menu.context;
    menu_hide();
    var bbj = gflag.menu.bbj;
    switch (_context) {
        case 1:
        case 2:
            /* removing tracks
             in removing from multi-select or mcm, always calling from target
             */
            if (bbj.splinterTag) {
                bbj = bbj.trunk;
            }
            if (bbj.weaver) {
                var target = bbj.weaver.iscotton ? bbj.weaver.target : bbj;
                var g2lst = {}, tlst = [];
                for (var i = 0; i < gflag.menu.tklst.length; i++) {
                    var t = gflag.menu.tklst[i];
                    if (t.cotton && t.ft != FT_weaver_c) {
                        if (t.cotton in g2lst) {
                            g2lst[t.cotton].push(t);
                        } else {
                            g2lst[t.cotton] = [t];
                        }
                    } else {
                        if (t.ft != FT_weaver_c) tlst.push(t);
                    }
                }
                if (tlst.length > 0) target.removeTrack_obj(tlst);
                for (var n in g2lst) {
                    target.weaver.q[n].removeTrack_obj(g2lst[n]);
                }
            } else {
                bbj.removeTrack_obj(gflag.menu.tklst);
            }
            glasspane.style.display = 'none';
            return;
        case 3:
            // deleting a gene set, apps.gsm is on
            apps.gsm.bbj.genome.geneset_delete(menu.genesetIdx);
            menu_hide();
            return;
        case 5:
            // remove 2nd dimension in facet
            var fa = apps.hmtk.bbj.facet;
            fa.dim2.term = fa.dim2.mdidx = null;
            fa.dim2.dom.innerHTML = literal_facet_nouse;
            menu_hide();
            apps.hmtk.bbj.generateTrackselectionLayout();
            return;
        case 8:
            // delete a term from mcm
            if (gflag.menu.idx >= bbj.mcm.lst.length) return;
            bbj.mcm.lst.splice(gflag.menu.idx, 1);
            bbj.initiateMdcOnshowCanvas();
            bbj.prepareMcm();
            bbj.drawMcm();
            bbj.__mcm_termchange();
            return;
        case 19:
            // single wreath tk
            apps.circlet.hash[gflag.menu.viewkey].wreath.splice(gflag.menu.wreathIdx, 1);
            hengeview_draw(gflag.menu.viewkey);
            return;
        case 20:
            // single bev tk
            var cc = gflag.menu.bbj.genome.bev.tklst[gflag.menu.bevtkidx].chrcanvas;
            for (var chr in cc)
                cc[chr].parentNode.removeChild(cc[chr]);
            gflag.menu.bbj.genome.bev.tklst.splice(gflag.menu.bevtkidx, 1);
            return;
        case 21:
            // hide a region from circlet plot
            var b = menu.circlet_blob;
            var vobj = apps.circlet.hash[b.viewkey];
            vobj.regionorder.splice(vobj.regionorder.indexOf(b.ridx), 1);
            hengeview_computeRegionRadian(b.viewkey);
            hengeview_ajaxupdatepanel(b.viewkey);
            menu_hide();
            return;
        default:
            fatalError("menu remove: unknown menu context id");
    }
}

function menu_overallconfig() {
    menu_shutup();
    document.getElementById('overallconfig').style.display = 'block';
}


function menu_track_browser(event) {
    /* over a track in main browser panel
     or a splinter
     */
    menu_shutup();

    var bbj = gflag.browser;
    var tk = bbj.findTrack(event.target.tkname, event.target.cotton);
    if (!tk) return;

// deal with multiple select, needs trunk track
    var sbj = bbj.splinterTag ? bbj.trunk : bbj;
    var t0 = sbj.findTrack(event.target.tkname, event.target.cotton);
    if (!t0) fatalError('missing trunk tk');
    if (t0.menuselected) {
        // click on a multi-selected track
        gflag.menu.tklst = [];
        var qtknum = 0;
        for (var i = 0; i < sbj.tklst.length; i++) {
            var t = sbj.tklst[i];
            if (t.menuselected) {
                gflag.menu.tklst.push(t);
                if (isNumerical(t) && isCustom(t.ft)) {
                    qtknum++;
                }
            }
        }
        menu_show(2, event.clientX, event.clientY);
        menu.c1.style.display =
            menu.c5.style.display =
                menu.c54.style.display =
                    menu.c4.style.display = 'block';
        menu.c1.innerHTML = gflag.menu.tklst.length + ' selected';
        indicator3.style.display = 'none';
        if (qtknum > 1) menu.c64.style.display = 'block';
        return false;
    } else {
        /* doing multiple select, now clicked on a tk that's not selected
         need to cancel the selection
         */
        sbj.multipleselect_cancel();
    }

    menu_show(1, event.clientX, event.clientY);
    if (tk.cotton && tk.ft != FT_weaver_c) {
        // a cottontk, should switch to cottonbbj
        if (!bbj.weaver.iscotton) {
            gflag.menu.bbj = bbj.weaver.q[tk.cotton];
        }
    }

    gflag.menu.tklst = [tk];
    bbj.highlighttrack([tk]);

    menu.c5.style.display = // conf
        menu.c4.style.display = // x
            menu.c16.style.display = 'block'; // info

    if (isCustom(tk.ft)) {
        if (menu.c19) menu.c19.style.display = 'block';
        if (!tk.public) {
            if (menu.c58) menu.c58.style.display = 'block';
        }
    }

    menu.c22.packbutt.style.display = 'none';
    switch (tk.ft) {
        case FT_qdecor_n:
            if (menu.c20) menu.c20.style.display = 'block';
            break;
        case FT_bedgraph_c:
        case FT_bedgraph_n:
            if (menu.c20) menu.c20.style.display = 'block'; // bev
            break;
        case FT_bigwighmtk_c:
        case FT_bigwighmtk_n:
            if (menu.c20) menu.c20.style.display = 'block';
            break;
        case FT_bed_n:
        case FT_bed_c:
        case FT_anno_n:
        case FT_anno_c:
            /*
             if(tk.dbsearch && menu.c47) {
             // search
             menu.c47.style.display='block';
             stripChild(menu.c47.table,0);
             }
             */
            menu.c16.style.display = 'block'; // info
            menu.c22.style.display = 'block';
            if (gflag.allow_packhide_tkdata && tk.mode == M_full) {
                // pack mode only available for bed and hammock
                menu.c22.packbutt.style.display = 'block';
                // alert: must make copy of tk here...
                var tk2 = tk;
                menu.c22.packbutt.onclick = function () {
                    bbj.track2packmode(tk2);
                    menu_hide();
                };
            }
            menu_showmodebutt(tk);
            if (!tk.issnp) {
                if (menu.c20) menu.c20.style.display = 'block';
                // do not allow this on snp tk
                if (bbj.juxtaposition.type == bbj.genome.defaultStuff.runmode) {
                    menu.c12.style.display = 'block';
                    menu.c2.style.display = 'none';
                } else {
                    menu.c2.style.display = 'block';
                    menu.c12.style.display = 'none';
                }
            }
            break;
//case FT_sam_n: case FT_sam_c:
        case FT_bam_n:
        case FT_bam_c:
            menu.c22.style.display = 'block';
            menu_showmodebutt(tk);
            if (bbj.juxtaposition.type == bbj.genome.defaultStuff.runmode) {
                menu.c2.style.display = 'none';
            } else {
                menu.c2.style.display = 'block';
            }
            break;
        case FT_lr_n:
        case FT_lr_c:
            if (menu.c3) {
                menu.c3.style.display = tk.mode == M_den ? 'none' : 'block';
            }
            menu_showmodebutt(tk);
            if (bbj.juxtaposition.type == bbj.genome.defaultStuff.runmode) {
                menu.c2.style.display = 'none';
            } else {
                menu.c2.style.display = 'block';
            }
            break;
        case FT_cat_c:
        case FT_cat_n:
            if (menu.c20) menu.c20.style.display = 'block'; // bev
            break;
        case FT_matplot:
            menu.c65.style.display = 'block';
            break;
        case FT_cm_c:
        case FT_ld_c:
        case FT_ld_n:
            break;
        case FT_weaver_c:
            menu.c4.style.display = 'none';
            if (tk.reciprocal) {
                menu.c62.style.display = 'block';
                //menu.c63.style.display=
                menu.c62.childNodes[1].innerHTML = 'Use <strong><span style="color:' + tk.qtc.bedcolor + '">' + tk.cotton + '</span></strong> as reference';
                //menu.c63.childNodes[1].innerHTML='Find <strong><span style="color:'+tk.qtc.bedcolor+'">'+tk.cotton+'</span></strong> regions';
            }
            break;
        case FT_catmat:
            break;
        case FT_qcats:
            break;
        default:
            print2console('invoking menu on tk of unknown ft', 2);
    }

    if (tk.ft in FT2noteurl) {
        menu.c61.style.display = 'block';
        menu.c61.firstChild.innerHTML = 'about ' + FT2verbal[tk.ft] + ' track';
        var ft = tk.ft;
        menu.c61.firstChild.onclick = function () {
            window.open(FT2noteurl[ft])
        };
    }

// any associated regions?
    var tk = bbj.genome.hmtk[event.target.tkname];
    if (tk != undefined && tk.regions != undefined) {
        var opt = menu.tk2region_showlst;
        opt.style.display = 'block';
        opt.childNodes[1].innerHTML = tk.regions[0];
    }
    return false;
}

function menu_showmodebutt(tk) {
    menu.c22.style.display = 'block';
    if (tk.ft == FT_lr_c || tk.ft == FT_lr_n) {
        menu.c10.style.display = tk.mode == M_trihm ? 'none' : 'table-cell';
        menu.c11.style.display = tk.mode == M_arc ? 'none' : 'table-cell';
    } else {
        menu.c10.style.display = menu.c11.style.display = 'none';
    }
    menu.c6.style.display = tk.mode == M_thin ? 'none' : 'table-cell';
    menu.c7.style.display = tk.mode == M_full ? 'none' : 'table-cell';
    menu.c8.style.display = tk.mode == M_den ? 'none' : 'table-cell';
    menu.c60.style.display = 'none';
    if ((tk.ft == FT_anno_c || tk.ft == FT_anno_n) && tk.scorenamelst && tk.mode != M_bar) {
        menu.c60.style.display = 'table-cell';
    }
}

function menuDecorChangemode(event) {
// pushing mode butt
    var bbj = gflag.menu.bbj;
    var tk = gflag.menu.tklst[0];
    if (bbj.splinterTag) {
        bbj = bbj.trunk;
        tk = bbj.findTrack(tk.name);
    }
// alert
    var tom = event.target.mode;
    if ((tom == M_thin || tom == M_full || tom == M_bar) && tk.mode != M_den) {
        var itemcount = 0;
        for (var i = 0; i < tk.data.length; i++) {
            itemcount += tk.data[i].length;
        }
        itemcount += tk.skipped ? tk.skipped : 0;
        if (itemcount > trackitemnumAlert) {
            menu_shutup();
            var d = menu.changemodealert;
            d.style.display = 'block';
            d.count.innerHTML = itemcount;
            d.mode.innerHTML = mode2str[tom];
            d.tk = tk;
            d.tom = tom;
            return;
        }
    }
    bbj.tkchangemode(tk, tom);
    menu_hide();
}

Browser.prototype.tkchangemode = function (tk, mode) {
    tk.mode = mode;
    this.ajax_addtracks([tk]);
    for (var tag in this.splinters) {
        var tk2 = this.splinters[tag].findTrack(tk.name);
        tk2.mode = mode;
        this.splinters[tag].ajax_addtracks([tk2]);
    }
};

function risky_changemode() {
    var bbj = gflag.menu.bbj;
    if (bbj.trunk) bbj = bbj.trunk;
    bbj.tkchangemode(menu.changemodealert.tk, menu.changemodealert.tom);
    menu_hide();
}

function menu_blank() {
    menu_shutup();
    stripChild(menu.c32, 0);
    menu.c32.style.display = 'block';
}

/*** __menu__ ends ***/