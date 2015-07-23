/**
 * Created by dpuru on 2/27/15.
 */

/*** __md__ ***/

function getmdidx_internal() {
    for (var i = 0; i < gflag.mdlst.length; i++) {
        if (gflag.mdlst[i].tag == literal_imd) return i;
    }
    return -1;
}


function parse_metadata_recursive(pterm, cterm, voc, obj) {
    /*
     pterm: parent term, null for root
     cterm: child term, must not be null
     voc: vocabulary obj at the level of cterm, may be null
     obj: ele in genome.mdlst
     */
    if (pterm != null) {
        // c2p
        if (cterm == pterm) {
            var msg = 'Metadata term "' + cterm + '" is removed as it cannot be both parent and child';
            print2console(msg, 2);
            alertbox_addmsg({text: msg});
            return;
        }
        if (cterm in obj.c2p) {
            obj.c2p[cterm][pterm] = 1;
        } else {
            var x = {};
            x[pterm] = 1;
            obj.c2p[cterm] = x;
        }
        // p2c
        if (pterm in obj.p2c) {
            obj.p2c[pterm][cterm] = 1;
        } else {
            var x = {};
            x[cterm] = 1;
            obj.p2c[pterm] = x;
        }
    }
    if (voc == null) return;
    if (Array.isArray(voc)) {
        // voc is list of leaf terms
        for (var i = 0; i < voc.length; i++) {
            if (voc[i] == cterm) {
                var msg = 'Metadata term "' + voc[i] + '" is removed as it cannot be both parent and attribute';
                print2console(msg, 2);
                alertbox_addmsg({text: msg});
                continue;
            }
            parse_metadata_recursive(cterm, voc[i], null, obj);
        }
    } else {
        // voc is still an hash
        for (var cc in voc) {
            parse_metadata_recursive(cterm, cc, voc[cc], obj);
        }
    }
}

Genome.prototype.invokemds = function (which, x, y) {
    this.mdselect.which = which;
    menu_shutup();
    menu.c55.style.display = 'block';
    menu.c55.says.innerHTML = 'Metadata';
    menu.c31.style.display = 'block';
    menu.c57.style.display = 'block';
    menu.c61.style.display = 'block';
    menu.c61.firstChild.innerHTML = 'about metadata';
    menu.c61.firstChild.onclick = function () {
        window.open(FT2noteurl.md)
    };
    stripChild(menu.c31, 0);
    for (var i = 0; i < gflag.mdlst.length; i++) {
        menu.c31.appendChild(gflag.mdlst[i].main);
    }
    if (menu.style.display != 'block') {
        menu_show(0, x, y);
    }
};


function mcmheader_mover(event) {
    /* mouse over mcm header canvas, must update gflag.browser
     as this canvas stays outside bbj.main table
     */
    var t = event.target;
    while (t.tagName != 'TABLE') t = t.parentNode;
    gflag.browser = horcrux[t.horcrux];
}
function menu_mcm_invokemds() {
    gflag.menu.bbj.mcm_invokemds();
}
function button_mcm_invokemds() {
    if (gflag.mdlst.length == 0) {
        print2console('No metadata available.', 2);
        return;
    }
    gflag.browser.mcm_invokemds();
}
Browser.prototype.mcm_invokemds = function () {
    /* show mdselect ui
     select terms to be displayed in metadata colormap
     */
// uncheck all boxes
    for (var i = 0; i < gflag.mdlst.length; i++) {
        var voc = gflag.mdlst[i];
        for (var t in voc.checkbox) {
            voc.checkbox[t].checked = false;
        }
    }
    for (var i = 0; i < this.mcm.lst.length; i++) {
        var t = this.mcm.lst[i];
        gflag.mdlst[t[1]].checkbox[t[0]].checked = true;
    }
    var hd = this.mcm.tkholder;
    var pos = absolutePosition(hd);
    if (pos[0] + hd.clientWidth + 300 > document.body.clientWidth + document.body.scrollLeft) {
        // place panel on left of mcm
        this.genome.invokemds(1, pos[0] - 200 - document.body.scrollLeft, pos[1] - document.body.scrollTop);
    } else {
        // place panel on right of mcm
        this.genome.invokemds(1, pos[0] + hd.clientWidth + 5 - document.body.scrollLeft, pos[1] - document.body.scrollTop);
    }
};

Genome.prototype.mdvGetallchild = function (term, p2c, lst) {
    if (term in p2c) {
        for (var cterm in p2c[term]) {
            lst.push(cterm);
            this.mdvGetallchild(cterm, p2c, lst);
        }
    }
};


function mdCheckboxchange(event) {
    /* on changing a checkbox in metadata selector panel
     need to tell which genome this checkbox belongs to
     and which browser to place the effect

     beware: adding new term during editing annotation of a track
     new custom term's checkbox will be simulated with click
     new term shall be displayed in mcm, but it will not be used to annotate tk
     as only tk attr can be used for annotation
     TODO
     */
    var term = event.target.term;
    var bbj = gflag.menu.bbj;
    var mdidx = event.target.mdidx;
    switch (bbj.genome.mdselect.which) {
        case 1:
            // add to mcm in bbj panel
            bbj.showhide_term_in_mcm([term, mdidx], event.target.checked);
            return;
        case 3:
            // editing custom track anno after submission
            // not in use
            if (event.target.checked) {
                /* adding annotation
                 to both registry/display objects
                 to insert <tr> in table to be used in annotation
                 term must be leaf, and could be native or custom
                 need to imprint both term and parent info on the <tr>
                 */
                document.getElementById('custtkmdanno_editsaysno').style.display = 'none';
                var showtable = document.getElementById('custtkmdanno_showholder');
                showtable.style.display = 'table';
                // TODO
                bbj.genome.custmd_tableinsert(showtable, term, iscustom, custtkmdannoedit_removeTerm);
                var ft = gflag.ctmae.ft;
                var tkname = gflag.ctmae.tkname;
                // 1: registry object
                var obj = gflag.ctmae.bbj.genome.hmtk[tkname];
                if (!obj.md[mdidx]) {
                    obj.md[mdidx] = {};
                }
                obj.md[mdidx][term] = 1;
                // 2: display object
                obj = gflag.ctmae.bbj.findTrack(tkname);
                if (obj != null) {
                    if (!obj.md[mdidx]) {
                        obj.md[mdidx] = {};
                    }
                    obj.md[mdidx][term] = 1;
                    gflag.ctmae.bbj.prepareMcm();
                    gflag.ctmae.bbj.drawMcm();
                }
            } else {
                custtkmdannoedit_removeTerm(term);
            }
            return;
        case 4:
            compass_customhub_assignterm(term);
            return;
        default:
            fatalError('mdCheckboxchange: unknown bbj.genome.mdselect.which');
    }
}

Browser.prototype.mdgettrack = function (term, mdidx, tkset) {
    /* search for any tracks annotated by an attribute, store in hash, key is track name

     args:
     - term: term name
     - mdidx: genome.mdlst array index, to find the voc
     (term and mdidx must be consistent!)
     - tkset: {}
     */
    var voc = gflag.mdlst[mdidx];
    if (term in voc.p2c) {
        // not leaf
        for (var cterm in voc.p2c[term]) {
            this.mdgettrack(cterm, mdidx, tkset);
        }
    } else {
        // is leaf
/*        for (var n in this.genome.hmtk) {
            var tk = this.genome.hmtk[n];
            if (!tk.md) continue;
            if (tk.md[mdidx] == undefined) continue;
            if (term in tk.md[mdidx]) {
                tkset[n] = 1;
            }
        }*/
        //Re-implement the above logic by inverting the loop call

        /*var hmtkCache = this.genome.hmtk,
            tkCache = {},
            tkmdCache = {};
        for( var n in hmtkCache ){
            tkCache = hmtkCache[n];
            tkmdCache = tkCache.md;
            if(!tkmdCache) continue;
            if( tkmdCache[mdidx] == undefined ) continue;
            if ( term in tkmdCache[mdidx] ) tkset[n] = 1;
        }*/
        var termFetch = this.flatHmtk[term];
        if ( termFetch ) {
            for( var n in termFetch[mdidx] ) {
                var foundArr = termFetch[mdidx];
                for ( var i = 0; i < foundArr.length ; i++){
                    tkset[foundArr[i]] = 1;
                }
            }
        }
    }
};


Browser.prototype.drawMcm_onetrack = function (tkobj, tosvg) {
    if (!this.mcm || !this.mcm.lst) return [];
    var svgdata = [];
    var c = tkobj.atC;
    var h = tk_height(tkobj);
    if (!c.alethiometer) {
        c.height = h;
        c.width = this.mcm.lst.length * tkAttrColumnWidth;
    }
    var ctx = c.getContext('2d');
    var clen = colorCentral.longlst.length - 1;
    for (var j = 0; j < this.mcm.lst.length; j++) {
        ctx.fillStyle = tkobj.attrcolor[j];
        ctx.fillRect(j * tkAttrColumnWidth, 0, tkAttrColumnWidth - 1, h);
        if (tosvg) svgdata.push({
            type: svgt_rect_notscrollable,
            x: j * tkAttrColumnWidth,
            w: tkAttrColumnWidth - 1,
            h: h,
            fill: ctx.fillStyle
        });
    }
    c.attr = tkobj.attrlst;
    if (tosvg) return svgdata;
};

Browser.prototype.recursiveFetchTrackAttr = function (term, mdcidx, tkobj) {
    /* args:
     term:
     mdcidx: bbj.mcm.lst array idx
     tkobj: tklst array element
     sets tkobj.attrlst[mdcidx] using the attr value in .attrhash.....
     */
    var mdidx = this.mcm.lst[mdcidx][1];
    if (!tkobj.md[mdidx]) {
        // no md hash for this voc
        return;
    }
    var voc = gflag.mdlst[mdidx];
    if (!(term in voc.p2c)) {
        // leaf
        if (term in tkobj.md[mdidx]) {
            tkobj.attrlst[mdcidx] = term;
        }
        return;
    }
    for (var cterm in voc.p2c[term]) {
        this.recursiveFetchTrackAttr(cterm, mdcidx, tkobj);
    }
};

Browser.prototype.initiateMdcOnshowCanvas = function () {
    /* make or re-make mcm holder table according to contents in _browser.mcm.lst
     write metadata categories vertically, check metadata voc tree checkboxes, only do once
     */
    if (!this.mcm || !this.mcm.holder) return;
    var holder = this.mcm.holder;
    stripChild(holder.firstChild.firstChild, 0); // table-tbody-tr
    var terms = this.mcm.lst;
    if (terms.length == 0) {
        if (gflag.mdlst.length == 0) {
            // no md
            return;
        }
        // no term, make clickable blank
        var c = makecanvaslabel({str: 'add terms', color: colorCentral.foreground_faint_5, bottom: true});
        c.title = 'Click to add metadata terms to metadata color map';
        c.className = 'tkattrnamevcanvas';
        c.onclick = button_mcm_invokemds;
        holder.firstChild.firstChild.insertCell(-1).appendChild(c);
        this.mcmPlaceheader();
        return;
    }
    holder.style.width = tkAttrColumnWidth * terms.length;
    for (var i = 0; i < terms.length; i++) {
        var s = terms[i];
        var voc = gflag.mdlst[s[1]];
        var c = makecanvaslabel({str: (s[0] in voc.idx2attr ? voc.idx2attr[s[0]] : s[0]), bottom: true});
        c.className = 'tkattrnamevcanvas';
        c.termname = s[0];
        c.mdidx = s[1];
        c.onclick = mcm_termname_click;
        c.onmousedown = mcm_termname_MD;
        c.oncontextmenu = menu_mcm_header;
        holder.firstChild.firstChild.insertCell(-1).appendChild(c);
    }
    this.mcmPlaceheader();
};


function mdterm_print(d, term, voc) {
    /* d - holder
     term - term id or name
     voc  - md voc
     */
    var d3 = dom_create('div', d);
    d3.className = 'mdt_box';
    if (voc.color) {
        d3.style.borderTop = 'solid 2px ' + voc.color;
    }
    d3.voc = voc;
    d3.innerHTML = term in voc.idx2attr ? voc.idx2attr[term] : term;
    d3.title = term in voc.idx2desc ? voc.idx2desc[term] : term;
    d3.term = term;
    d3.onclick = function (event) {
        mdt_box_click(event.target, term, voc);
    };
}

function mdt_box_click(box, term, voc) {
    /* from inside menu > tk detail > md term listing
     click box
     */
    if (box.className != 'mdt_box') box = box.parentNode;
    if (box.__clc) {
        box.__clc = false;
        box.innerHTML = term in voc.idx2attr ? voc.idx2attr[term] : term;
        return;
    }
    var indent = '&nbsp;&nbsp;&nbsp;';
    var lst = [];
// FIXME not handling multi-parent case
    var x = term;
    while (x in voc.c2p) {
        var y = undefined;
        for (y in voc.c2p[x]) {
            break;
        }
        lst.unshift(y);
        x = y;
    }
    var name = term in voc.idx2attr ? voc.idx2attr[term] : term;
    lst.push(name);
    var slst = [];
    for (var i = 0; i < lst.length; i++) {
        slst.push('<div');
        if (i < lst.length - 1) {
            slst.push(' style="font-size:80%"');
        }
        slst.push('>');
        for (var j = 0; j < i; j++) {
            slst.push(indent);
        }
        if (i > 0) {
            slst.push('&#9492;&nbsp;');
        }
        slst.push(lst[i]);
        slst.push('</div>');
    }
    box.innerHTML = slst.join('') +
    (term in voc.idx2desc ?
    '<div style="font-size:70%;opacity:.8;">' + voc.idx2desc[term] + '<br>' +
    'term id: ' + term +
    '</div>' : ''
    );
    box.__clc = true;
}

function mdshowhide(event) {
    /* called by clicking on <span> inside <li>, which is non-leaf metadata term
     <li>'s next sibling must be <ul>, and will show/hide it
     */
    var li = event.target.parentNode;
    if (li.tagName != 'LI') {
        li = li.parentNode;
    }
    var x = li.firstChild;
    if (x.tagName == 'INPUT') x = x.nextSibling;
    var icon = x.firstChild;
    var ul = li.nextSibling;
    if (ul.style.display == 'none') {
        ul.style.display = "block";
        icon.innerHTML = '&#8863;';
    } else {
        ul.style.display = 'none';
        icon.innerHTML = '&#8862;';
    }
}

function parse_nativemd(tk) {
// arg: registry object, from mdlst to md
    if (!tk.mdlst) return;
    if (!tk.md) tk.md = [];
    var s = {};
    for (var i = 0; i < tk.mdlst.length; i++) {
        s[tk.mdlst[i]] = 1;
    }
    tk.md[0] = s;
    delete tk.mdlst;
}

Browser.prototype.tknamelst_getmdidxhash = function (namelst) {
    /* given a list of tknames, need to update all facet associated with those tracks
     find out mdidx and give a hash of it
     */
    var hash = {};
    for (var i = 0; i < namelst.length; i++) {
        var o = this.genome.hmtk[namelst[i]];
        if (o && o.md) {
            for (var j = 0; j < o.md.length; j++) {
                if (o.md[j]) {
                    hash[j] = 1;
                }
            }
        }
    }
    return hash;
};

function md_findterm(md, words) {
    var hits = [];
    for (var t in md.c2p) {
        var s;
        if (t in md.idx2attr) {
            s = md.idx2attr[t].toLowerCase();
        } else {
            s = t.toLowerCase();
        }
        var allmatch = true;
        for (var j = 0; j < words.length; j++) {
            if (s.indexOf(words[j]) == -1) {
                allmatch = false;
            }
        }
        if (allmatch) {
            var x = parseInt(t);
            hits.push(isNaN(x) ? t : x);
        }
    }
    return hits;
}


function words2mdterm(lst) {
    var words = [];
    for (var i = 0; i < lst.length; i++) {
        words.push(lst[i].toLowerCase());
    }
    var hits = [];
    for (var i = 0; i < gflag.mdlst.length; i++) {
        var h = md_findterm(gflag.mdlst[i], words);
        for (var j = 0; j < h.length; j++) {
            hits.push([h[j], i]);
        }
    }
    return hits;
}

Browser.prototype.load_metadata_url = function (url) {
// currently internal, not called from user action on ui
    var bbj = this;
    this.ajaxText('loaddatahub=on&url=' + url, function (text) {
        bbj.loadmetadata_jsontext(text, url);


    });
};

Browser.prototype.loadmetadata_jsontext = function (text, url) {
    if (!text) {
        print2console('Cannot load metadata file ' + url, 2);
        this.__hubfailedmdvurl[url] = 1;
    } else {
        var j = parse_jsontext(text);
        if (j) {
            if (!j.vocabulary) {
                print2console('vocabulary missing from metadata ' + url, 2);
                this.__hubfailedmdvurl[url] = 1;
            } else {
                j.sourceurl = url;
                load_metadata_json(j);
            }
        } else {
            print2console('Invalid metadata JSON: ' + url, 2);
            this.__hubfailedmdvurl[url] = 1;
        }
    }
    if (this.__pending_hubjson) {
        var ibp = this.__pending_hubjson;
        delete this.__pending_hubjson;
        this.loaddatahub_json(ibp);
    }
};

function load_metadata_json(raw) {
    var obj = {
        c2p: {},
        p2c: {},
        root: {},
        checkbox: {},
        idx2attr: {},
        idx2desc: {},
        idx2color: {},
    };
    gflag.mdlst.push(obj);
    var idx = gflag.mdlst.length - 1;

    for (var term in raw.vocabulary) {
        parse_metadata_recursive(null, term, raw.vocabulary[term], obj);
        obj.root[term] = 1;
    }
    if (raw.tag) {
        obj.tag = raw.tag;
    }
    if (raw.sourceurl) {
        obj.sourceurl = raw.sourceurl;
    } else {
        // no source url, not a shared md
        if (raw.source) obj.source = raw.source;
        obj.original = raw; // for stringify
    }
    if (raw.terms) {
        for (var t in raw.terms) {
            var v = raw.terms[t];
            if (Array.isArray(v)) {
                if (v.length == 0) {
                    print2console('Empty array for term definition (' + t + ')', 2);
                    v = ['unidentified_' + t];
                }
                obj.idx2attr[t] = v[0];
                if (v[1]) {
                    obj.idx2desc[t] = v[1];
                }
                if (v[2]) {
                    obj.idx2color[t] = v[2];
                }
            }
        }
    }
// for showing in c31
    var d = document.createElement('div');
    d.style.margin = 10;
    obj.main = d;
    var ul = dom_create('ul', d, 'padding:5px 10px;margin:0px;');
    if (obj.color) {
        ul.style.borderTop = 'solid 2px ' + obj.color;
        ul.style.backgroundColor = lightencolor(colorstr2int(obj.color), 0.9);
    }
    obj.mainul = ul;
    for (var rt in obj.root) {
        make_mdtree_recursive(rt, obj, idx, ul);
    }
    return idx;
}


function make_mdtree_recursive(term, mdobj, idx, holder) {
    var li = dom_create('li', holder);
// a checkbox for each term, no matter child or parent
    var cb = dom_create('input', li);
    cb.type = 'checkbox';
    cb.term = term;
    cb.mdidx = idx;
    cb.onchange = mdCheckboxchange;
    mdobj.checkbox[term] = cb;
    if (term in mdobj.p2c) {
        // not leaf
        var s = dom_addtext(li, '<span>&#8862;</span> ' + term, null, 'clb');
        s.onclick = mdshowhide;
        var ul2 = dom_create('ul', holder, 'display:none;');
        for (var cterm in mdobj.p2c[term]) {
            make_mdtree_recursive(cterm, mdobj, idx, ul2);
        }
    } else {
        // is leaf
        dom_addtext(li,
            (term in mdobj.idx2attr ? mdobj.idx2attr[term] : term) +
            (term in mdobj.idx2desc ? '<div style="font-size:70%;opacity:.7;">' + mdobj.idx2desc[term] + '</div>' : '')
        );
    }
}


function mdtermsearch_show(forwhat, handler, mdidxlimit) {
// handler must be a closure function
    menu_shutup();
    menu.c55.style.display = 'block';
    menu.c55.says.innerHTML = forwhat;
    menu.c56.style.display = 'block';
    menu.c56.hit_handler = handler;
    menu.c56.input.focus();
    if (mdidxlimit) {
        menu.c56.mdidxlimit = mdidxlimit;
    } else {
        delete menu.c56.mdidxlimit;
    }
}

function mdtermsearch_ku(event) {
    if (event.keyCode == 13) mdtermsearch();
}
function mdtermsearch() {
    var d = menu.c56;
    if (d.input.value.length == 0) return;
    if (d.input.value.length == 1) {
        print2console('Can\'t search by just one letter', 2);
        return;
    }
    var re = words2mdterm([d.input.value]);
    if (re.length == 0) {
        print2console('No hits', 2);
        return;
    }
    if (d.mdidxlimit != undefined) {
        var lst = [];
        for (var i = 0; i < re.length; i++) {
            if (re[i][1] == d.mdidxlimit) {
                lst.push(re[i]);
            }
        }
        re = lst;
    }
// group terms by vocabulary
    var mdidx2term = [];
    for (var i = 0; i < gflag.mdlst.length; i++) {
        mdidx2term.push([])
    }
    for (var i = 0; i < re.length; i++) {
        mdidx2term[re[i][1]].push(re[i][0]);
    }
    d.table.style.display = 'block';
    stripChild(d.table, 0);
// first show terms from shared voc
    var hasprivate = false;
    for (var i = 1; i < mdidx2term.length; i++) {
        if (mdidx2term[i].length == 0) {
            continue;
        }
        var md = gflag.mdlst[i];
        if (md.sourceurl) {
            var tr = d.table.insertRow(-1);
            var td = tr.insertCell(0);
            td.colSpan = 3;
            td.style.fontSize = '70%';
            td.innerHTML = 'following terms are from this shared vocabulary<br><a href=' + md.sourceurl + ' target=_blank>' + md.sourceurl + '</span>';
            for (var j = 0; j < mdidx2term[i].length; j++) {
                var tr = d.table.insertRow(-1);
                var td = tr.insertCell(0);
                var tid = mdidx2term[i][j];
                var tn = null;
                if (tid in md.idx2attr) {
                    td.innerHTML = 'id: ' + tid;
                }
                td = tr.insertCell(1);
                mdterm_print(td, tid, md);
                if (menu.c56.hit_handler) {
                    td = tr.insertCell(2);
                    dom_addtext(td, 'use &#187;', null, 'clb').onclick = menu.c56.hit_handler([tid, i]);
                }
            }
        } else {
            hasprivate = true;
        }
    }
    if (hasprivate) {
        var tr = d.table.insertRow(-1);
        var td = tr.insertCell(0);
        td.colSpan = 3;
        td.style.fontSize = '70%';
        td.innerHTML = 'following terms are from private vocabularies';
        for (var i = 1; i < mdidx2term.length; i++) {
            if (mdidx2term[i].length == 0) {
                continue;
            }
            var md = gflag.mdlst[i];
            if (!md.sourceurl) {
                for (var j = 0; j < mdidx2term[i].length; j++) {
                    var tr = d.table.insertRow(-1);
                    var td = tr.insertCell(0);
                    var tid = mdidx2term[i][j];
                    var tn = null;
                    if (tid in md.idx2attr) {
                        td.innerHTML = 'id: ' + tid;
                    }
                    td = tr.insertCell(1);
                    mdterm_print(td, tid, md);
                    if (menu.c56.hit_handler) {
                        td = tr.insertCell(2);
                        dom_addtext(td, 'use &#187;', null, 'clb').onclick = menu.c56.hit_handler([tid, i]);
                    }
                }
            }
        }
    }
}

/*** __md__ over ***/

