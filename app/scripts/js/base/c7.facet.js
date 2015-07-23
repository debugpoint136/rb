/**
 * Created by dpuru on 2/27/15.
 */
function kwsearch_tipover(event) {
    picasays.innerHTML = 'Keywords are case insensititve<br><br>join multiple keywords by <b>AND</b><br><br>e.g. "brain AND h3k4me3"<br><br>To broaden your search, incorporate additional data sets or datahubs';
    pica_go(event.clientX, event.clientY);
}

function tkitemkwsearch_ku(event) {
    if (event.keyCode == 13) tkitemkwsearch();
}
function tkitemkwsearch() {
    var bbj = gflag.menu.bbj;
    var ip = menu.c47.input;
    if (ip.value.length == 0) {
        print2console('Please enter name to search', 2);
        return;
    }
    stripChild(menu.c47.table, 0);
    bbj.ajax('searchtable=' + gflag.menu.tklst[0].name + '&text=' + ip.value + '&dbName=' + bbj.genome.name, function (data) {
        bbj.tkitemkwsearch_cb(data);
    });
}
Browser.prototype.tkitemkwsearch_cb = function (data) {
    menu_shutup();
    menu.c47.style.display = 'block';
    if (!data || !data.lst) {
        var tr = menu.c47.table.insertRow(0);
        tr.insertCell(0).innerHTML = 'Server error!';
        return;
    }
    if (data.lst.length == 0) {
        var tr = menu.c47.table.insertRow(0);
        tr.insertCell(0).innerHTML = 'No hits found.';
        return;
    }
    for (var i = 0; i < data.lst.length; i++) {
        var tr = menu.c47.table.insertRow(-1);
        tr.className = 'clb_o';
        var c = data.lst[i];
        tr.coord = c.chrom + ':' + c.start + '-' + c.stop;
        tr.itemname = c.name;
        tr.addEventListener('click', menu_jump_highlighttkitem, false);
        var td = tr.insertCell(0);
        td.innerHTML = c.name;
        td = tr.insertCell(1);
        td.innerHTML = c.chrom + ':' + c.start + '-' + c.stop;
    }
};

function tkkwsearch_ku(event) {
    if (event.keyCode == 13) tkkwsearch();
}
function tkkwsearch() {
    /* search all tracks
     cgi does sql query
     */
    var bbj = gflag.menu.bbj;
    var ip = menu.grandadd.kwinput;
    if (ip.value.length == 0) {
        print2console('Please enter keyword to search', 2);
        return;
    }
    if (ip.value.indexOf(',') != -1) {
        print2console('Comma not allowed for keywords', 2);
        return;
    }
    var lst = ip.value.split(' AND ');
    var lst2 = [];
    for (var i = 0; i < lst.length; i++) {
        if (lst[i].length > 0) {
            if (lst[i].search(/\S/) != -1) {
                var b = lst[i].replace(/\s/g, '');
                if (b.length == 1) {
                    print2console('Keyword can\'t be just one character', 2);
                    return;
                }
                lst2.push(lst[i]);
            }
        }
    }
    if (lst2.length == 0) {
        print2console('No valid keyword', 2);
        return;
    }
    for (i = 0; i < lst2.length; i++) {
        lst2[i] = lst[i].toLowerCase();
    }
// list of kws ready

    var hitlst = []; // names

// search for decor by label
    for (var tk in bbj.genome.decorInfo) {
        var s = bbj.genome.decorInfo[tk].label.toLowerCase();
        var allmatch = true;
        for (var i = 0; i < lst2.length; i++) {
            if (s.indexOf(lst2[i]) == -1) {
                allmatch = false;
            }
        }
        if (allmatch) {
            hitlst.push(tk);
        }
    }

// search for md terms
    var mdterms = words2mdterm(lst2); // ele: [term, mdidx]

// search hmtk, both by kw and md
    for (var tkn in bbj.genome.hmtk) {
        var o = bbj.genome.hmtk[tkn];
        // label
        var str = o.label.toLowerCase();
        var allmatch = true;
        for (var i = 0; i < lst2.length; i++) {
            if (str.indexOf(lst2[i]) == -1) {
                allmatch = false;
            }
        }
        if (allmatch) {
            hitlst.push(tkn);
            continue;
        }
        // details
        if (o.details) {
            var allmatch = true;
            for (var i = 0; i < lst2.length; i++) {
                var thismatch = false;
                for (var x in o.details) {
                    var str = o.details[x].toLowerCase();
                    if (str.indexOf(lst2[i]) != -1) {
                        thismatch = true;
                        break;
                    }
                }
                if (!thismatch) {
                    allmatch = false;
                }
            }
            if (allmatch) {
                hitlst.push(tkn);
                continue;
            }
        }
        // geo, only look at 1st kw
        if (o.geolst) {
            var match = false;
            for (var i = 0; i < o.geolst.length; i++) {
                if (o.geolst[i].toLowerCase() == lst2[0]) {
                    hitlst.push(tkn);
                    match = true;
                    break;
                }
            }
            if (match) continue;
        }
        // by md
        if (mdterms.length > 0) {
            for (i = 0; i < mdterms.length; i++) {
                var mdidx = mdterms[i][1];
                var tt = mdterms[i][0];
                if (o.md[mdidx] && (tt in o.md[mdidx])) {
                    hitlst.push(tkn);
                    break;
                }
            }
        }
    }
    if (hitlst.length == 0) {
        print2console('No tracks found', 2);
        return;
    }
    print2console('Found ' + hitlst.length + ' track' + (hitlst.length == 1 ? '' : 's'), 1);
    apps.hmtk.bbj = bbj;
    bbj.showhmtkchoice({lst: hitlst, context: 23});
}


/*** __facet__ for tracks ***/

function facet2pubs() {
    apps.hmtk.main.style.display = 'none';
    gflag.browser = apps.hmtk.bbj;
    toggle8_2();
}
function pubs2facet() {
    apps.publichub.main.style.display = 'none';
    gflag.browser = apps.publichub.bbj;
    toggle1_2();
}

function mdterm2str(i, t) {
    var v = gflag.mdlst[i];
    if (t in v.idx2attr) return v.idx2attr[t];
    return t;
}

Browser.prototype.generateTrackselectionLayout = function () {
    if (!this.facet) return;
    if (this.facet.dim1.mdidx == null) {
        // uninitiated
        var count = gflag.mdlst.length;
        if (count == 0) {
            // no md??
            this.facet.dim1.mdidx =
                this.facet.dim1.term =
                    this.facet.dim2.mdidx =
                        this.facet.dim2.term = null;
            return;
        }
        if (count == 1) {
            this.facet.dim1.mdidx = 0;
        } else if (count == 2) {
            this.facet.dim1.mdidx = gflag.mdlst[0].tag == literal_imd ? 1 : 0;
        } else {
            for (var i = 0; i < count; i++) {
                if (gflag.mdlst[i].tag != literal_imd) {
                    if (this.facet.dim1.mdidx == null) {
                        this.facet.dim1.mdidx = i;
                    } else {
                        this.facet.dim2.mdidx = i;
                        break;
                    }
                }
            }
        }
        // use 1 root term
        for (var n in gflag.mdlst[this.facet.dim1.mdidx].root) {
            this.facet.dim1.term = n;
            break;
        }
        // dim 2
        if (this.facet.dim2.mdidx != null) {
            for (var n in gflag.mdlst[this.facet.dim2.mdidx].root) {
                this.facet.dim2.term = n;
                break;
            }
        }
    }
    this.facet.dim1.dom.innerHTML = mdterm2str(this.facet.dim1.mdidx, this.facet.dim1.term);
    this.facet.rowlst = [];
    this.facet.collst = [];
    if (this.facet.dim2.mdidx == null) {
        // only one criterion applies, make a text tree
        this.facet.swapbutt.style.display = 'none';
        this.facet.dim2.dom.innerHTML = literal_facet_nouse;
        this.facet.div2.style.display = 'none';
        this.facet.div1.style.display = 'block';
        stripChild(this.facet.div1, 0);
        var ul = dom_create('ul', this.facet.div1);
        var idx = this.facet.dim1.mdidx;
        for (var cterm in gflag.mdlst[idx].p2c[this.facet.dim1.term]) {
            this.trackselectionoption_onecriteria(cterm, idx, ul);
        }
        return;
    }
// two criteria
    this.facet.swapbutt.style.display = 'inline';
    this.facet.dim2.dom.innerHTML = mdterm2str(this.facet.dim2.mdidx, this.facet.dim2.term);
    this.facet.div2.style.display = "block";
    this.facet.div1.style.display = "none";
    for (var cterm in gflag.mdlst[this.facet.dim1.mdidx].p2c[this.facet.dim1.term]) {
        this.facet.rowlst.push([cterm, this.facet.dim1.mdidx, '&#8862;']);
    }
    for (var cterm in gflag.mdlst[this.facet.dim2.mdidx].p2c[this.facet.dim2.term]) {
        this.facet.collst.push([cterm, 0, '&#8862;']);
    }
    this.generateTrackselectionGrid();
};

Browser.prototype.flattenhmtk = function(){
    /* # Before you call this - lets flatten genome.hmtk
     # create a global object that has key as cterm
     # and array, where index is md #
     # value is an array of track num
     */

    var globalHMhash = {};
    for ( var track in this.genome.hmtk){
        var tkNum = this.genome.hmtk[track];
        var arrLen = tkNum.md.length;
        for (var m = 1; m < arrLen; m++ ) {
            for (var n in tkNum.md[m]){
                var arr = [];
                var trackArr = [];
                trackArr.push(track);
                arr[m] = trackArr;
                if ( globalHMhash[n] ) {
                    var curArr = globalHMhash[n];
                    if ( curArr[m] ){
                        curArr[m].push(track);
                    }
                } else {
                    globalHMhash[n] = arr;
                }
            }
        }
    }
    return globalHMhash;
};

Browser.prototype.flatHmtk = {};

Browser.prototype.generateTrackselectionGrid = function () {
    /* for two criteria case
     make grid for track selection, each cell corresponds to metadata categories
     rerun when criteria changed
     */
    this.flatHmtk = this.flattenhmtk();
    var attr2tkset = {};
// key: attr, val: set of track
    for (var i = 0, numFacetRows = this.facet.rowlst.length; i < numFacetRows; i++) {
        // skip expanded parent term
        var t = this.facet.rowlst[i];
        if (t[2] == '&#8863;') continue;
        var s = {};
        this.mdgettrack(t[0], this.facet.dim1.mdidx, s );
        attr2tkset[t[0]] = s;
    }
    for (var i = 0, numFacetCols = this.facet.collst.length; i < numFacetCols; i++) {
        var t = this.facet.collst[i];
        if (t[2] == '&#8863;') continue;
        var s = {};
        this.mdgettrack(t[0], this.facet.dim2.mdidx, s );
        attr2tkset[t[0]] = s;
    }
    var table = this.facet.div2;
    if (table.firstChild) {
        stripChild(table.firstChild, 0);
    }

    var rowvoc = gflag.mdlst[this.facet.dim1.mdidx],
        colvoc = gflag.mdlst[this.facet.dim2.mdidx];
    this.facet.rowlst_td = [];
    this.facet.collst_td = [];

    /** first row **/
    var tr = table.insertRow(0);
// one cell for each attribute in facet.collst, vertical canvas
    for (var i = 0; i < this.facet.collst.length; i++) {
        var colt = this.facet.collst[i];
        /* column header */
        var td = tr.insertCell(-1);
        td.className = 'facet_colh';
        td.align = 'center';
        td.vAlign = 'bottom';
        td.style.paddingBottom = colt[1];
        td.idx = i;
        var color;
        if (!(colt[0] in colvoc.p2c)) {
            // is leaf
            td.style.paddingTop = colt[1] + 17;
            color = colorCentral.foreground;
        } else {
            // not leaf
            td.style.cursor = 'pointer';
            td.iscolumn = true;
            td.onclick = facettermclick_grid;
            td.onmousedown = facet_header_press;
            if (colt[2] == '&#8862;') {
                // collapsed
                color = colorCentral.foreground;
            } else {
                color = '#858585';
                td.style.borderColor = 'transparent';
            }
        }
        td.onmouseover = facet_colh_mover;
        td.onmouseout = facet_colh_mout;

        var c = makecanvaslabel({
            str: mdterm2str(this.facet.dim2.mdidx, colt[0]),
            color: color, bottom: true
        });
        td.appendChild(c);

        var d = dom_create('div', td);
        if (colt[0] in colvoc.p2c) {
            d.innerHTML = colt[2];
            d.style.color = color;
        } else {
            d.style.width = d.style.height = 15;
        }
        this.facet.collst_td.push(td); // for highlight
    }
    var td = tr.insertCell(-1);
    td.align = 'left';
    td.vAlign = 'bottom';
    td.className = 'facet_cell';
    td.style.padding = '10px';
    td.addEventListener('mouseover', menu_hide, false);

// remaining rows, one for each attribute in facet.rowlst
    for (i = 0; i < this.facet.rowlst.length; i++) {
        // make first cell, the row header
        var rowt = this.facet.rowlst[i];
        tr = table.insertRow(-1);
        // facet cells
        for (var j = 0; j < this.facet.collst.length; j++) {
            td = tr.insertCell(-1);
            var what2 = this.facet.collst[j][0];
            if (!(rowt[0] in attr2tkset) || !(what2 in attr2tkset)) {
                // to skip expanded row and column
                continue;
            }
            var intersection = {};
            for (var tk in attr2tkset[rowt[0]]) {
                if (tk in attr2tkset[what2])
                    intersection[tk] = 1;
            }
            td.className = 'facet_cell';
            td.ridx = i;
            td.cidx = j;
            var num = this.tracksetTwonumbers(intersection);
            if (num[0] == 0) {
                td.innerHTML = '<span style="color:#ccc;">n/a</span>';
            } else {
                var d = dom_create('div', td, 'display:inline-block;');
                d.className = 'tscell';
                d.i = i;
                d.j = j;
                d.term1 = rowt[0];
                d.term2 = what2;
                d.title = 'click to show tracks';
                d.onmouseover = facet_cellmover;
                d.onmouseout = facet_cellmout;
                d.onclick = facet_clickcell;
                d.innerHTML =
                    ((num[1] == 0) ? '<span>0</span>' : '<span class=r>' + num[1] + '</span>') +
                    '<span>/</span>' +
                    '<span class=g>' + num[0] + '</span>';
            }
        }
        /* row header */
        td = tr.insertCell(-1);
        td.style.paddingLeft = rowt[1];
        td.className = 'facet_rowh';
        td.idx = i;
        var tns = mdterm2str(this.facet.dim1.mdidx, rowt[0]);
        if (!(rowt[0] in rowvoc.p2c)) {
            // is leaf
            td.innerHTML = tns;
            td.style.paddingLeft = rowt[1] + 17;
        } else {
            // not leaf
            td.innerHTML = rowt[2] + ' ' + tns;
            td.iscolumn = false;
            td.onclick = facettermclick_grid;
            td.onmousedown = facet_header_press;
            td.style.cursor = 'pointer';
            if (rowt[2] != '&#8862;') {
                // expanded
                td.style.borderColor = 'transparent';
                td.style.color = '#858585';
            }
        }
        td.onmouseover = facet_rowh_mover;
        td.onmouseout = facet_rowh_mout;
        this.facet.rowlst_td.push(td);
    }
};

function facet_header_press(event) {
    var t = event.target;
    if (t.tagName != 'TD') {
        t = t.parentNode;
    }
    t.style.backgroundColor = 'rgba(255,255,100,0.5)';
}

Browser.prototype.facet_swap = function () {
    var f = this.facet;
    if (f.dim2.mdidx == null) return;
    var a = f.dim2.mdidx,
        b = f.dim2.term,
        c = f.dim2.dom.innerHTML;
    f.dim2.mdidx = f.dim1.mdidx;
    f.dim2.term = f.dim1.term;
    f.dim2.dom.innerHTML = f.dim1.dom.innerHTML;
    f.dim1.mdidx = a;
    f.dim1.term = b;
    f.dim1.dom.innerHTML = c;
    this.generateTrackselectionLayout();
};

Browser.prototype.tracksetTwonumbers = function (tkset) {
// takes in a hash of track names
// return a list [total number, number displayed now]
    var numall = 0; // # tracks in tkset
    var numinuse = 0; // # tracks in tkset in display
    for (var tk in tkset) {
        numall++;
        if (this.findTrack(tk) != null) numinuse++;
    }
    return [numall, numinuse];
};

Browser.prototype.trackselectionoption_onecriteria = function (term, idx, ul) {
// one criterion, initial
    var voc = gflag.mdlst[idx];
    var isLeaf = !(term in voc.p2c);
// count tracks annotated to this term
    var tkset = {};
    this.mdgettrack(term, idx, tkset);
    var num = this.tracksetTwonumbers(tkset);
    var li = dom_create('li', ul);
    if (isLeaf) {
        dom_addtext(li, ((term in voc.idx2attr) ? voc.idx2attr[term] : term) + '&nbsp;');
    } else {
        li.idx = idx;
        li.term = term;
        var s = dom_addtext(li, '<span>&#8862;</span> ' + term + '&nbsp;', null, 'clb');
        s.addEventListener('click', toggle32, false);
    }
    if (num[0] == 0) {
        dom_addtext(li, 'n/a', colorCentral.foreground_faint_3);
    } else {
        var d = dom_create('div', li, 'display:inline-block;');
        d.className = 'tscell';
        d.term1 = term;
        d.idx = idx;
        d.addEventListener('click', facet_clickcell, false);
        d.title = 'click to show tracks';
        d.innerHTML =
            ((num[1] == 0) ? '<span>0</span>' : '<span class=r>' + num[1] + '</span>') +
            '<span>/</span>' +
            '<span class=g>' + num[0] + '</span>';
    }
    if (!isLeaf) {
        dom_create('ul', ul).style.display = 'none';
    }
};

function toggle32(event) {
    /* called by clicking on <span> within <li>
     for facet, one criterion state
     <li> should have <ul> as its next sibling
     */
    var li = event.target;
    while (li.tagName != 'LI') {
        li = li.parentNode;
    }
    var span = li.firstChild.firstChild;
    var ul = li.nextSibling;
    if (ul.tagName != 'UL') {
        fatalError('toggle32: could not find UL as next sibling');
    }
    var hidden = ul.style.display == 'none';
    var term = li.term;
    var p2c = gflag.mdlst[li.idx].p2c;
    if (hidden) {
        for (var cterm in p2c[term]) {
            apps.hmtk.bbj.trackselectionoption_onecriteria(cterm, li.idx, ul);
        }
        ul.style.display = "block";
        span.innerHTML = '&#8863;';
    } else {
        stripChild(ul, 0);
        ul.style.display = "none";
        span.innerHTML = '&#8862;';
    }
}

function facet_cellmover(event) {
// i/j: array idx to facet.rowlst, .collst
    var d = event.target;
    if (d.tagName != 'DIV') {
        d = d.parentNode;
    }
    var f = apps.hmtk.bbj.facet;
    var t = f.rowlst_td[d.i];
    t.style.backgroundColor = colorCentral.hl;
    t = f.collst_td[d.j];
    t.style.backgroundColor = colorCentral.hl;
    menu.style.display = 'none';
}
function facet_cellmout(event) {
    var d = event.target;
    if (d.tagName != 'DIV') {
        d = d.parentNode;
    }
    var f = apps.hmtk.bbj.facet;
    var t = f.rowlst_td[d.i];
    t.style.backgroundColor = "transparent";
    t = f.collst_td[d.j];
    t.style.backgroundColor = "transparent";
}
function facet_colh_mover(event) {
    var td = event.target;
    while (td.tagName != 'TD') {
        td = td.parentNode;
    }
    td.style.backgroundColor = colorCentral.hl;
    menu_shutup();
    menu.facetm.style.display = 'block';
    var p = absolutePosition(td);
    menu_show(9, p[0] - document.body.scrollLeft - 10, p[1] - 70 - document.body.scrollTop);
    gflag.menu.termname = apps.hmtk.bbj.facet.collst[td.idx][0];
    gflag.menu.mdidx = apps.hmtk.bbj.facet.dim2.mdidx;
}
function facet_colh_mout(event) {
    var td = event.target;
    while (td.tagName != 'TD') {
        td = td.parentNode;
    }
    td.style.backgroundColor = "transparent";
// don't call menu_hide(), can't let cursor move from td to menu
}
function facet_rowh_mover(event) {
    var td = event.target;
    while (td.tagName != 'TD') {
        td = td.parentNode;
    }
    td.style.backgroundColor = colorCentral.hl;
    menu_shutup();
    menu.facetm.style.display = 'block';
    var p = absolutePosition(td);
    menu_show(9, p[0] + td.clientWidth - 10 - document.body.scrollLeft, p[1] - 10 - document.body.scrollTop);
    gflag.menu.termname = apps.hmtk.bbj.facet.rowlst[td.idx][0];
    gflag.menu.mdidx = apps.hmtk.bbj.facet.dim1.mdidx;
}
function facet_rowh_mout(event) {
    var td = event.target;
    while (td.tagName != 'TD') {
        td = td.parentNode;
    }
    td.style.backgroundColor = "transparent";
}
function facettermclick_grid(event) {
    var bbj = apps.hmtk.bbj;
    var td = event.target;
    while (td.tagName != 'TD') {
        td = td.parentNode;
    }
    var voc = gflag.mdlst[td.iscolumn ? bbj.facet.dim2.mdidx : bbj.facet.dim1.mdidx];
    var termarray = td.iscolumn ? bbj.facet.collst : bbj.facet.rowlst;
    var term = termarray[td.idx];
    if (term[2] == '&#8862;') {
        // expand details, insert child terms into array
        term[2] = '&#8863;';
        var j = 1;
        for (var cterm in voc.p2c[term[0]]) {
            termarray.splice(td.idx + j, 0, [cterm, term[1] + 20, '&#8862;']);
            j++;
        }
    } else {
        // hide details, remove child terms from array
        term[2] = '&#8862;';
        var lst = [];
        bbj.genome.mdvGetallchild(term[0], voc.p2c, lst);
        var i = 0;
        while (true) {
            if (thinginlist(termarray[i][0], lst)) {
                termarray.splice(i, 1);
            } else {
                i++;
            }
            if (i == termarray.length) break;
        }
    }
    bbj.generateTrackselectionGrid();
}

function facet_dimension_show(event) {
    var s = event.target;
    menu_blank();
    var table = dom_create('table', menu.c32, 'margin:10px;border-top:solid 1px #ededed;');
    table.cellPadding = 5;
// root terms from all md objects
    var bbj = apps.hmtk.bbj;
    for (var i = 0; i < gflag.mdlst.length; i++) {
        var v = gflag.mdlst[i];
        for (var t in v.root) {
            // equal to itself?
            if (s.isrow && i == bbj.facet.dim1.mdidx && t == bbj.facet.dim1.term) continue;
            if (!s.isrow && i == bbj.facet.dim2.mdidx && t == bbj.facet.dim2.term) continue;
            if (!s.isrow) {
                // escape dim1 term
                if (i == bbj.facet.dim1.mdidx && t == bbj.facet.dim1.term) continue;
            }
            var tr = table.insertRow(-1);
            var td = tr.insertCell(0);
            dom_addtext(td, t, null, 'mdt_box').onclick = facet_choosedim_closure(bbj, i, t, s.isrow);
            td = tr.insertCell(1);
            td.style.fontSize = '70%';
            td.style.opacity = .7;
            if (v.tag == literal_imd) {
                td.innerHTML = 'internal';
            } else if (v.source) {
                td.innerHTML = 'private<br>' + v.source;
            } else if (v.sourceurl) {
                td.innerHTML = 'shared<br>' + v.sourceurl;
            }
        }
    }
    if (!s.isrow && bbj.facet.dim2.term != null) {
        menu.c4.style.display = 'block';
    }
    menu_show_beneathdom(s.isrow ? 4 : 5, s);
}

function facet_choosedim_closure(bbj, i, t, isrow) {
    return function () {
        bbj.facet_choosedim(i, t, isrow);
    };
}

Browser.prototype.facet_choosedim = function (mdidx, term, isrow) {
    if (isrow) {
        this.facet.dim1.mdidx = mdidx;
        this.facet.dim1.term = term;
        this.facet.dim1.dom.innerHTML = mdterm2str(mdidx, term);
        // may need to turm off dim2
        if (mdidx == this.facet.dim2.mdidx && term == this.facet.dim2.term) {
            this.facet.dim2.term = this.facet.dim2.mdidx = null;
            this.facet.dim2.dom.innerHTML = literal_facet_nouse;
        }
    } else {
        this.facet.dim2.mdidx = mdidx;
        this.facet.dim2.term = term;
        this.facet.dim2.dom.innerHTML = mdterm2str(mdidx, term);
    }
    menu_hide();
    apps.hmtk.bbj.generateTrackselectionLayout();
};

function facet_clickcell(event) {
    /* called by clicking on a number pair g/r in facet list or grid
     and show the list of tracks in menu.facettklsttable
     */
    var div = event.target;
    if (div.tagName != 'DIV') {
        div = div.parentNode;
    }
    var term1 = div.term1;
    if (term1 == null) return;
    var term2 = div.term2;
    var bbj = apps.hmtk.bbj;
    var tkset1 = {};
    bbj.mdgettrack(term1, bbj.facet.dim1.mdidx, tkset1);
    if (term2) {
        // second term available, from double criteria
        // can both be big grid, or sub-table which is also a grid
        var tkset2 = {};
        bbj.mdgettrack(term2, bbj.facet.dim2.mdidx, tkset2);
        var intersection = {};
        for (var tk in tkset1) {
            if (tk in tkset2) {
                intersection[tk] = 1;
            }
        }
        tkset1 = intersection;
    }
    gflag.tsp.invoke = {
        cell: div,
    };
    var tkselectionlst = [];
    for (var tk in tkset1) {
        tkselectionlst.push(tk);
    }
    if (tkselectionlst.length == 0) {
        return;
    }
    var pos = absolutePosition(div);
    bbj.showhmtkchoice({
        lst: tkselectionlst,
        x: pos[0] + div.clientWidth - 6 - document.body.scrollLeft,
        y: pos[1] - 10 - document.body.scrollTop,
        context: 10,
    });
}


function dom_addtkentry(domtype, holder, shown, obj, showname, callback, charlimit) {
    /* can also be used to show gene set
     args:
     domtype: 1 for <td>, 2 for <div>
     holder:
     shown: boolean
     obj: will be null for gene set
     showname: in case of weaving, will show genome name together with label
     callback: optional
     charlimit: optional
     */
    var ent;
    switch (domtype) {
        case 1:
            ent = holder.insertCell(-1);
            break;
        case 2:
            ent = dom_create('div', holder);
            break;
        default:
            ent = dom_create('span', holder);
            break;
    }
    ent.tkobj = obj;
    if (shown) {
        ent.className = 'tkentry_inactive';
    } else {
        ent.className = 'tkentry';
        if (callback) ent.onclick = callback;
    }
    if (charlimit == undefined) charlimit = 30;
    if (showname.length >= charlimit + 5) {
        ent.innerHTML = showname.substr(0, charlimit) + '...';
        ent.title = showname;
    } else {
        ent.innerHTML = showname;
    }
    return ent;
}

Browser.prototype.showhmtkchoice = function (p) {
    /* arg:
     .lst: list of tk name or objects
     .selected: boolean, if true, all entries are selected by default
     .x/.y: x/y position to show menu (no scroll offset!)
     .delete: show delete buttons
     .call: direct call back
     .context: for gflag.menu.context, if .call is not provided
     .allactive: if true, make all tk available for selection
     */
    var bbj = this;
    if (apps.hmtk && apps.hmtk.main.style.display != 'none') {
        // cover the facet panel
        invisible_shield(apps.hmtk.main);
    }
    menu.facettklstdiv.submit.count = 0;
    menu.facettklstdiv.submit.style.display = 'none';
// adjust list order, put tk first that are on show
    var lst1 = [], lst2 = [];
    for (var i = 0; i < p.lst.length; i++) {
        var n = p.lst[i];
        if (typeof(n) == 'string') {
            var t = this.findTrack(n);
            if (t) lst1.push(t);
            else lst2.push(n);
        } else {
            if (this.findTrack(n.name, n.cotton)) {
                lst1.push(n);
            } else {
                lst2.push(n);
            }
        }
    }
    p.lst = lst1.concat(lst2);

    menu_shutup();
    menu.facettklstdiv.style.display = 'block';
    menu.facettklstdiv.buttholder.style.display = p.hidebuttholder ? 'none' : 'block';
    if (p.context == undefined) {
        p.context = 0;
    }
    if (p.x != undefined) {
        menu_show(p.context, p.x, p.y);
    } else {
        gflag.menu.context = p.context;
    }
    var table = menu.facettklsttable;
    stripChild(table, 0);
    if (p.lst.length <= 8) {
        table.parentNode.style.height = "auto";
        table.parentNode.style.overflowY = "auto";
    } else {
        table.parentNode.style.height = "200px";
        table.parentNode.style.overflowY = "scroll";
    }
    var showremovebutt = false;
    for (var i = 0; i < p.lst.length; i++) {
        var tk = p.lst[i];
        var tkn, obj;
        if (typeof(tk) == 'string') {
            tkn = tk;
            obj = this.genome.getTkregistryobj(tkn);
            if (!obj) {
                print2console('registry object not found for ' + tkn, 2);
                continue;
            }
        } else {
            tkn = tk.name;
            obj = tk;
        }
        var tr = table.insertRow(-1);
        var shown = false;
        if (!p.allactive) {
            shown = typeof(tk) != 'string';
        }
        var td = dom_addtkentry(1, tr, shown, obj,
            (this.weaver ? ('(' + (obj.cotton ? obj.cotton : this.genome.name) + ') ') : '') + obj.label,
            p.call ? p.call : tkentry_click);
        if (shown) {
            showremovebutt = true;
        } else {
            if (p.selected) simulateEvent(td, 'click');
        }
        td = tr.insertCell(-1);
        td.className = 'tkentrytype';
        td.innerHTML = FT2verbal[obj.ft];
        td = tr.insertCell(-1);
        td.innerHTML = '&nbsp;&#8505;&nbsp;';
        td.className = 'clb';
        td.onclick = tkinfo_show_closure(bbj, obj);
        if (p.delete) {
            td = tr.insertCell(-1);
            dom_addbutt(td, 'delete', menu_delete_custtk).tkname = tkn;
        }
    }
    table.style.display = "block";
    menu.facetremovebutt.style.display = showremovebutt ? 'inline' : 'none';
};

function menu_delete_custtk(event) {
// called by pushing butt in 'list all' menu
    gflag.menu.bbj.delete_custtk([event.target.tkname]);
    menu_custtk_showall();
}

Browser.prototype.delete_custtk = function (names) {
// permanent removal
    var pending = [];
    for (var i = 0; i < names.length; i++) {
        var t = this.genome.hmtk[names[i]];
        if (!t) {
            print2console('registry object not found: ' + names[i], 2);
            return;
        }
        if (this.findTrack(names[i])) {
            this.removeTrack([names[i]]);
        }
        if (t.ft == FT_cm_c) {
            var s = t.cm.set;
            if (s.cg_f) pending.push(s.cg_f);
            if (s.cg_r) pending.push(s.cg_r);
            if (s.chg_f) pending.push(s.chg_f);
            if (s.chg_r) pending.push(s.chg_r);
            if (s.chh_f) pending.push(s.chh_f);
            if (s.chh_r) pending.push(s.chh_r);
            if (s.rd_f) pending.push(s.rd_f);
            if (s.rd_r) pending.push(s.rd_r);
        }
        delete this.genome.hmtk[names[i]];
        for (var j = 0; j < this.genome.custtk.names.length; j++) {
            if (this.genome.custtk.names[j] == names[i]) {
                this.genome.custtk.names.splice(j, 1);
                break;
            }
        }
    }
    if (pending.length > 0) {
        this.delete_custtk(pending);
    }
};

function facet_tklst_toggleall(event) {
    /* called by clicking all/none buttons in facet/menu/tklst panel
     arg: boolean to tell if check/uncheck all tracks
     */
    var tofill = event.target.tofill;
    var bbj = apps.hmtk.bbj;
    var lst = menu.facettklsttable.firstChild.childNodes;
    for (var i = 0; i < lst.length; i++) {
        var td = lst[i].firstChild;
        if ((td.className == 'tkentry' && tofill) || (td.className == 'tkentry_onfocus' && !tofill)) {
            simulateEvent(td, 'click');
        }
    }
}


function facet_tklst_addSelected() {
// called by clicking big green butt from the menu
    if (menu.facettklstdiv.submit.count == 0) return;
    var bbj = gflag.menu.bbj;
    var lst = menu.facettklsttable.firstChild.childNodes;
    var addlst = [];
    for (var i = 0; i < lst.length; i++) {
        var td = lst[i].firstChild;
        if (td.className == 'tkentry_onfocus') {
            var o = duplicateTkobj(td.tkobj);
            o.mode = tkdefaultMode(o);
            addlst.push(o);
        }
    }
    if (addlst.length == 0) return;
    menu.facettklstdiv.submit.innerHTML = 'Working...';
// may add context-specific handling
    for (var i = 0; i < addlst.length; i++) {
        var oo = bbj.genome.getTkregistryobj(addlst[i].name);
        if (!oo) {
            print2console('registry object not found for ' + addlst[i].label, 2);
        } else {
            if (oo.defaultmode != undefined) {
                o.mode = oo.defaultmode;
            }
        }
    }
    bbj.ajax_addtracks(addlst);
}

function facet_tklst_removeall() {
// called by clicking button in facet-menu-tklst panel from menu
    var bbj = gflag.menu.bbj;
    var lst = menu.facettklsttable.firstChild.childNodes;
    var rlst = [];
    for (var i = 0; i < lst.length; i++) {
        var td = lst[i].firstChild;
        if (td.className == 'tkentry_inactive') {
            rlst.push(td.tkobj.name);
        }
    }
    if (rlst.length == 0) return;
    bbj.removeTrack(rlst);
}

function facet_term_selectall() {
    /* called by clicking 'select all' option in menu
     to select all tracks annotated by the underlining term
     */
    var bbj = apps.hmtk.bbj;
    var s = {};
    bbj.mdgettrack(gflag.menu.termname, gflag.menu.mdidx, s);
    var newlst = [];
    for (var n in s) {
        if (bbj.findTrack(n) == null) {
            newlst.push(n);
        }
    }
    if (newlst.length == 0) {
        menu_hide();
        return;
    }
    gflag.tsp.invoke = {mdidx: gflag.menu.mdidx};
    bbj.showhmtkchoice({lst: newlst, selected: true, context: 9});
}
function facet_term_removeall() {
// called by clicking 'remove all' option in menu
    var bbj = apps.hmtk.bbj;
    var s = {};
    bbj.mdgettrack(gflag.menu.termname, gflag.menu.mdidx, s);
    var lst = [];
    for (var tk in s) {
        if (bbj.findTrack(tk) != null) {
            lst.push(tk);
        }
    }
    if (lst.length == 0) return;
    bbj.removeTrack(lst);
    menu_hide();
}

Browser.prototype.facetclickedcell_remake = function () {
    /* remake single facet cell after updating
     tell which cell and context by gflag.tsp.invoke
     */
    var bbj = this.trunk ? this.trunk : this;
    var div = gflag.tsp.invoke.cell;
    var s1 = {};
    this.mdgettrack(div.term1, bbj.facet.dim1.mdidx, s1);
    var intersection = {};
    if (div.term2 != undefined) {
        // two term
        var s2 = {};
        this.mdgettrack(div.term2, bbj.facet.dim2.mdidx, s2);
        for (var tk in s1) {
            if (tk in s2) intersection[tk] = 1;
        }
    } else {
        intersection = s1;
    }
    var num = bbj.tracksetTwonumbers(intersection);
    div.innerHTML = ((num[1] == 0) ? '<span>0</span>' : '<span class=r>' + num[1] + '</span>') +
    '<span>/</span>' +
    '<span class=g>' + num[0] + '</span>';
    simulateEvent(div, 'click');
};


function facet_removeall(event) {
    /* called by pushing butt in facet panel
     */
    var bbj = apps.hmtk.bbj;
    var cells = bbj.facet.main.getElementsByClassName('tscell');
    var tkshown = {};
    for (var i = 0; i < cells.length; i++) {
        if (cells[i].firstChild.className == 'r') {
            var s1 = {};
            bbj.mdgettrack(cells[i].term1, bbj.facet.dim1.mdidx, s1);
            if (cells[i].term2 != undefined) {
                var s2 = {};
                bbj.mdgettrack(cells[i].term2, bbj.facet.dim2.mdidx, s2);
                var si = {};
                for (var n in s2) {
                    if (n in s1) {
                        si[n] = 1;
                    }
                }
                s1 = si;
            }
            for (var n in s1) {
                tkshown[n] = 1;
            }
        }
    }
    var lst = [];
    for (var n in tkshown) {
        lst.push(n);
    }
    if (lst.length == 0) {
        print2console('No tracks are on display from this group.', 0);
        return;
    }
    bbj.removeTrack(lst);
    bbj.generateTrackselectionLayout();
}

/*** __facet__ ends ***/