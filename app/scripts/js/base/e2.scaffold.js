/**
 * Created by dpuru on 2/27/15.
 */


/*** __scaffold__ ***/

Browser.prototype.ajax_scfdruntimesync = function () {
    /* big trap!!
     in case of gsv, border name is itemname, but not chrom name
     so adding new chrom in case of gsv need to preserve old right border!!
     */
    var bbj = this;
    this.ajax('scfdruntimesync=on&dbName=' + this.genome.name + '&session=' + this.sessionId + '&status=' + this.statusId, function (data) {
        bbj.scfdruntimesync(data)
    });
};

Browser.prototype.scfdruntimesync = function (data) {
    if (!data || data.error) {
        print2console('scfdruntimesync failed!', 2);
        return;
    }
    var right = [];
    if (this.is_gsv()) {
        right[0] = this.border.rname;
        right[1] = this.border.rpos;
    }
    for (var i = 0; i < data.lst.length; i++) {
        if (!thinginlist(data.lst[i], this.genome.scaffold.current)) {
            this.genome.addnewscaffold([data.lst[i]]);
        }
    }
    if (this.is_gsv()) {
        // flip it back...
        this.border.rname = right[0];
        this.border.rpos = right[1];
    }
};

function toggle6() {
// inside menu, show/hide scaffold display panel
    var bait1 = menu.relocate.div1;
    var bait2 = menu.relocate.div2;
    menu.relocate.jumplstholder.style.display = 'none'; // always hide it
    if (bait1.style.display == 'block') {
        bait1.style.display = 'none';
        bait2.style.display = 'block';
        menu.c18.style.display = 'none';
        stripChild(menu.scfd_holder, 0);
        menu.scfd_holder.appendChild(gflag.menu.bbj.genome.scaffold.overview.holder);
        scfd_cancelconfigure();
        placePanel(menu);
    } else {
        bait1.style.display = 'block';
        bait2.style.display = 'none';
    }
}

function toggle25() {
    var bait1 = menu.relocate.div1;
    var bait3 = menu.relocate.div3;
    menu.relocate.jumplstholder.style.display = 'none'; // always hide it
    if (bait1.style.display == 'block') {
        menu.style.left = 50;
        bait1.style.display = 'none';
        bait3.style.display = 'block';
        stripChild(bait3, 0);
        var bbj = gflag.menu.bbj;
        bait3.appendChild(bbj.genome.linkagegroup.holder);
        placePanel(menu);
    } else {
        bait1.style.display = 'block';
        bait3.style.display = 'none';
    }
}


Genome.prototype.addnewscaffold = function (lst) {
    for (var i = 0; i < lst.length; i++) {
        if (lst[i] in this.scaffold.len) {
            this.scaffold.current.push(lst[i])
        }
    }
    this.scfdoverview_makepanel();
    this.scfd_cancelconfigure();
    var lastone = this.scaffold.current[this.scaffold.current.length - 1];
    this.border.rname = lastone;
    this.border.rpos = this.scaffold.len[lastone];
};

Genome.prototype.scfdoverview_makepanel = function () {
    /* make overview panel
     by the content and order of scaffold.current
     if there's too many scaffolds, *do not* make this
     */
    if (this.linkagegroup) {
        var o = this.linkagegroup;
        o.holder = document.createElement('table');
        o.holder.cellSpacing = o.holder.cellPadding = 0;
        var d = document.createElement('div'); // to point out current location
        d.style.position = 'absolute';
        d.style.width = 2;
        d.style.bottom = 0 - (o.h_top + o.h_link + o.h_bottom);
        d.style.height = o.h_bottom;
        d.style.border = 'solid 2px blue';
        o.shadow = d;
        var tr = o.holder.insertRow(0);
        var td = tr.insertCell(0);
        td.colSpan = 2;
        td.align = 'center';
        td.style.paddingBottom = 10;
        td.style.color = colorCentral.foreground_faint_5;
        td.innerHTML = o.totalnum + ' scaffold sequences (bars ' +
        '<span title="forward strand" style="color:white;background-color:' + o.c_for + ';">&nbsp;&gt;&nbsp;</span> ' +
        '<span title="reverse strand" style="color:white;background-color:' + o.c_rev + ';">&nbsp;&lt;&nbsp;</span> ' +
        '<span title="unknown strand" style="color:white;background-color:' + o.c_un + ';">&nbsp;?&nbsp;</span> ) ' +
        'are mapped on the linkage groups.' +
        '<br>' +
        'To display in browser: click on a scaffold, or drag and select multiple scaffolds';

        // longest group
        var m = 0;
        for (var n in o.len) {
            var x = o.len[n];
            if (x > m) m = x;
        }
        var sf = o.maxw / m;
        o.sf = sf;
        var lg2holder = {}; // lnkgrp name 2 div
        var lg2piecewidth = {}; // px width of a seq bar
        // render
        var h_barplot = 50;
        for (var i = 0; i < o.order.length; i++) {
            var lgname = o.order[i];
            var lst = o.hash[lgname]; // all scfd in this group
            // get max bp length to make barplot
            var maxbp = 0;
            for (var j = 0; j < lst.length; j++) {
                var s = this.scaffold.len[lst[j].n];
                if (maxbp < s) maxbp = s;
            }
            var plotwidth = Math.ceil(o.len[lgname] * sf); // graph px width
            var seqwidth = plotwidth / lst.length;
            lg2piecewidth[lgname] = seqwidth;
            // 1-1
            var tr = o.holder.insertRow(-1);
            var td = tr.insertCell(0);
            td.align = 'right';
            td.style.paddingRight = 10;
            var header = dom_create('canvas', td);
            header.height = h_barplot;
            header.width = 100;
            plot_ruler({
                ctx: header.getContext('2d'),
                color: 'black',
                start: h_barplot - .5,
                stop: 0,
                horizontal: false,
                min: 0,
                max: maxbp,
                xoffset: 99,
                extremeonly: true
            });
            // 1-2
            td = tr.insertCell(1);
            var d = dom_create('div', td, 'position:relative');
            lg2holder[lgname] = d;
            d.addEventListener('mousedown', lnkgrp_div_md, false);
            d.lgname = lgname;
            for (j = 0; j < lst.length; j++) {
                var s = lst[j];
                // cannot use canvas for ele
                var ele = dom_create('div', d, 'width:' + seqwidth + 'px;height:' + h_barplot + 'px;');
                ele.className = 'lnkgrp_box';
                ele.n = s.n;
                ele.cM = s.d;
                var bar = dom_create('div', ele);
                // fill bar
                bar.style.height = h_barplot * this.scaffold.len[s.n] / maxbp;
                if (s.s == '+') {
                    bar.style.backgroundColor = o.c_for;
                    ele.strand = 'forward';
                } else if (s.s == '-') {
                    bar.style.backgroundColor = o.c_rev;
                    ele.strand = 'reverse';
                } else {
                    bar.style.backgroundColor = o.c_un;
                    ele.strand = '';
                }
                ele.addEventListener('mouseover', lnkgrp_seq_mo, false);
                ele.addEventListener('mouseout', pica_hide, false);
                ele.addEventListener('click', lnkgrp_seq_click, false);
            }
            // 2-1
            tr = o.holder.insertRow(-1);
            td = tr.insertCell(0);
            td.style.paddingRight = 20;
            td.align = 'right';
            //td.vAlign='bottom';
            td.style.paddingBottom = '10px';
            td.innerHTML = lgname;
            // 2-2
            td = tr.insertCell(1);
            td.style.paddingBottom = '10px';
            var canvas = dom_create('canvas', td, 'border-bottom:solid 3px ' + colorCentral.foreground_faint_3);
            canvas.width = plotwidth;
            canvas.height = o.h_top + o.h_link + o.h_bottom;
            var ctx = canvas.getContext('2d');
            for (var j = 0; j < lst.length; j++) {
                var s = lst[j];
                if (s.s == '+') {
                    ctx.strokeStyle = o.c_for;
                } else if (s.s == '-') {
                    ctx.strokeStyle = o.c_rev;
                } else {
                    ctx.strokeStyle = o.c_un;
                }
                ctx.beginPath();
                var x = parseInt(seqwidth * (j + 0.5)) + 0.5;
                ctx.moveTo(x, 0);
                ctx.lineTo(x, o.h_top);
                x = parseInt(s.d * sf) + 0.5;
                ctx.lineTo(x, o.h_top + o.h_link);
                ctx.lineTo(x, o.h_top + o.h_link + o.h_bottom);
                ctx.stroke();
            }
        }
        o.lg2holder = lg2holder;
        o.lg2piecewidth = lg2piecewidth;
        return;
    }
    if (this.scaffold.current.length > max_viewable_chrcount) {
        return;
    }
    var maxlen = 0;
    for (var i = 0; i < this.scaffold.current.length; i++) {
        var c = this.scaffold.current[i];
        maxlen = Math.max(maxlen, this.scaffold.len[c]);
    }
    var table = this.scaffold.overview.holder;
    if (table.firstChild) {
        stripChild(table.firstChild, 0);
    }
    this.scaffold.overview.trlst = [];
    var sf = maxlen / this.scaffold.overview.maxw;
    for (i = 0; i < this.scaffold.current.length; i++) {
        var chr = this.scaffold.current[i];
        var w = Math.ceil(this.scaffold.len[chr] / sf);
        var tr = this.scaffold.overview.holder.insertRow(-1);
        tr.style.backgroundColor = 'transparent';
        tr.chr = chr;
        var td = tr.insertCell(0);
        td.style.width = 100;
        td.align = 'right';
        td.innerHTML = '<div style="color:#b3b3b3;font-size:12px;">' + chr + '</div>' +
        '<div class=header_b style="margin-right:5px" onmousedown="scfd_movebutt_md(event)">' + chr + '</div>' +
        '<span class=header_r onclick="scfd_hidebutt_click(event)">&#10005;</span>';
        var c = document.createElement('canvas');
        c.chr = chr;
        c.width = w + 1;
        c.height = this.scaffold.overview.barheight + 1;
        c.className = 'opaque5';
        c.addEventListener('mousemove', scfdoverview_Hmove, false);
        c.addEventListener('mouseout', pica_hide, false);
        c.addEventListener('mousedown', scfdoverview_zoomin_Md, false);
        drawIdeogramSegment_simple(
            this.getcytoband4region2plot(chr, 0, this.scaffold.len[chr], w),
            c.getContext('2d'), 0, 0, w, ideoHeight, false);
        td = tr.insertCell(-1);
        td.appendChild(c);
        this.scaffold.overview.pwidth[c] = w;
        this.scaffold.overview.trlst.push(tr);
    }
    this.scaffold.overview.sf = sf;
// last row for items not in .current and can be added
    var addlst = [];
    for (var n in this.scaffold.len) {
        if (!thinginlist(n, this.scaffold.current)) addlst.push(n);
    }
    if (addlst.length > 0) {
        var tr = table.insertRow(-1);
        var td = tr.insertCell(0);
        td.colSpan = 2;
        div = document.createElement('div');
        div.innerHTML = addlst.length + ' additional items available';
        div.style.fontSize = '12px';
        div.style.padding = 4;
        div.addEventListener('click', toggle2, false);
        td.appendChild(div);
        div = document.createElement('div');
        div.style.display = 'none';
        td.appendChild(div);
        var d2 = document.createElement('div');
        d2.style.width = 100 + this.scaffold.overview.maxw;
        div.appendChild(d2);
        for (i = 0; i < addlst.length; i++) {
            var ent = document.createElement('span');
            ent.className = 'header_g';
            ent.style.display = 'inline-block';
            ent.style.margin = 2;
            ent.innerHTML = addlst[i];
            ent.chr = addlst[i];
            ent.addEventListener('click', scfd_toadd_entryclick, false);
            d2.appendChild(ent);
        }
        this.scaffold.overview.newtr = tr;
    }
    /* over */
};

function scfd_toadd_entryclick(event) {
// click an entry and add it to overview table, pending for submission
    var lst = gflag.menu.bbj.genome.scaffold.toadd;
    if (event.target.className == 'header_g') {
        lst.push(event.target.chr);
        event.target.className = 'header_b';
    } else {
        for (var i = 0; i < lst.length; i++) {
            if (lst[i] == event.target.chr) {
                lst.splice(i, 1);
                break;
            }
        }
        event.target.className = 'header_g';
    }
}

function scfdoverview_Hmove(event) {
    var genome = gflag.menu.bbj.genome;
    var pos = absolutePosition(event.target);
    picasays.innerHTML = event.target.chr + ', ' + parseInt((event.clientX + document.body.scrollLeft - pos[0]) * genome.scaffold.overview.sf);
    pica_go(event.clientX - document.body.scrollLeft, pos[1] + event.target.clientHeight - document.body.scrollTop);
}
function scfdoverview_zoomin_Md(event) {
// press down
    if (event.button != 0) return; // only process left click
    event.preventDefault();
    var pos = absolutePosition(event.target);
    indicator.style.display = "block";
    indicator.style.left = event.clientX + document.body.scrollLeft;
    indicator.style.top = pos[1];
    indicator.style.width = 0;
    indicator.style.height = event.target.clientHeight;
    gflag.navigator = {
        bbj: gflag.menu.bbj,
        x: event.clientX + document.body.scrollLeft,
        xcurb: pos[0],
        chr: event.target.chr,
        canvas: event.target,
    };
    document.body.addEventListener("mousemove", scfdoverview_zoomin_Mm, false);
    document.body.addEventListener("mouseup", scfdoverview_zoomin_Mu, false);
}
function scfdoverview_zoomin_Mm(event) {
    var currx = event.clientX + document.body.scrollLeft;
    var n = gflag.navigator;
    if (currx > n.x) {
        if (currx < n.xcurb + n.canvas.width) {
            indicator.style.width = currx - n.x;
        }
    } else {
        if (currx >= n.xcurb) {
            indicator.style.width = n.x - currx;
            indicator.style.left = currx;
        }
    }
}
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

function scfd_invokeconfigure() {
// invoke scaffold configure UI
    if (gflag.menu.bbj.juxtaposition.type != RM_genome) {
        print2console('Customizing scaffold sequences is only possible under genome mode, please quit juxtaposition/GeneSetView first.', 2);
        return;
    }
    menu.relocate.scfd_foo.style.display = 'none';
    menu.relocate.scfd_bar.style.display = 'block';
    var ov = gflag.menu.bbj.genome.scaffold.overview;
    for (var i = 0; i < ov.holder.firstChild.childNodes.length; i++) {
        // rows containing chromosome canvas contain two cell
        // need to escape ov.newtr which contain 1 cell
        var tr = ov.holder.firstChild.childNodes[i];
        if (tr.childNodes.length == 2) {
            var lst = tr.firstChild.childNodes;
            lst[0].style.display = 'none';
            lst[1].style.display = lst[2].style.display = 'inline';
        }
    }
    if (ov.newtr) {
        ov.newtr.style.display = 'table-row';
        ov.newtr.firstChild.firstChild.style.display = 'block';
        ov.newtr.firstChild.childNodes[1].style.display = 'none';
    }
}
function scfd_cancelconfigure() {
// called by pushing button
    gflag.menu.bbj.genome.scfd_cancelconfigure();
}

Genome.prototype.scfd_cancelconfigure = function () {
// cancel scaffold configure UI and reset everything
    menu.relocate.scfd_foo.style.display = 'block';
    menu.relocate.scfd_bar.style.display = 'none';
    var ov = gflag.menu.bbj.genome.scaffold.overview;
    var tbody = ov.holder.firstChild;
    for (var i = 0; i < ov.trlst.length; i++) {
        var tr = ov.trlst[i];
        tr.style.backgroundColor = 'transparent';
        tbody.appendChild(tr);
        var lst = tr.firstChild.childNodes;
        lst[0].style.display = 'block';
        lst[1].style.display = lst[2].style.display = 'none';
    }
    if (ov.newtr) {
        tbody.appendChild(ov.newtr);
        ov.newtr.style.display = 'none';
    }
};
function scfd_movebutt_md(event) {
// must not use scaffold.current to determine idx
    event.preventDefault();
    var chr = event.target.parentNode.parentNode.chr;
    var lst = gflag.menu.bbj.genome.scaffold.overview.holder.firstChild.childNodes;
    for (var i = 0; i < lst.length; i++) {
        if (lst[i].chr == chr) break;
    }
    event.target.className = 'header_g';
    gflag.menu.bbj.genome.scaffold.move = {
        target: event.target,
        idx: i,
        total: lst.length,
        y: event.clientY
    };
    document.body.addEventListener('mousemove', scfd_movebutt_mm, false);
    document.body.addEventListener('mouseup', scfd_movebutt_mu, false);
}
function scfd_movebutt_mm(event) {
    var m = gflag.menu.bbj.genome.scaffold.move;
    var tbody = gflag.menu.bbj.genome.scaffold.overview.holder.firstChild;
    if (event.clientY < m.y) {
        if (m.idx == 0) return;
        if (m.y - event.clientY >= 20) {
            tbody.appendChild(tbody.childNodes[m.idx]);
            var lst = [];
            for (var i = m.idx - 1; i < m.total - 1; i++) lst.push(tbody.childNodes[i]);
            for (var i = 0; i < lst.length; i++) tbody.appendChild(lst[i]);
            m.idx--;
            m.y = event.clientY;
        }
    } else if (event.clientY > m.y) {
        if (m.idx == m.total - 1) return;
        if (event.clientY - m.y >= 20) {
            tbody.appendChild(tbody.childNodes[m.idx + 1]);
            var lst = [];
            for (var i = m.idx; i < m.total - 1; i++) lst.push(tbody.childNodes[i]);
            for (var i = 0; i < lst.length; i++) tbody.appendChild(lst[i]);
            m.idx++;
            m.y = event.clientY;
        }
    }
}
function scfd_movebutt_mu(event) {
    document.body.removeEventListener('mousemove', scfd_movebutt_mm, false);
    document.body.removeEventListener('mouseup', scfd_movebutt_mu, false);
    gflag.menu.bbj.genome.scaffold.move.target.className = 'header_b';
}
function scfd_hidebutt_click(event) {
    var tr = event.target.parentNode.parentNode;
    tr.style.backgroundColor = tr.style.backgroundColor == 'transparent' ? '#858585' : 'transparent';
}
function scfd_updateconfigure() {
    var newlst = [];
    var bbj = gflag.menu.bbj;
    var trlst = bbj.genome.scaffold.overview.holder.firstChild.childNodes;
    for (var i = 0; i < trlst.length; i++) {
        if (trlst[i].style.backgroundColor == 'transparent')
            newlst.push(trlst[i].chr);
    }
    newlst = newlst.concat(bbj.genome.scaffold.toadd);
    bbj.genome.scaffold.toadd = [];
    if (stringLstIsIdentical(newlst, bbj.genome.scaffold.current)) {
        scfd_cancelconfigure();
        return;
    }
    // now determine dsp
    var dspParam = '';
    if (bbj.dspBoundary.vstartr == bbj.dspBoundary.vstopr && thinginlist(bbj.regionLst[bbj.dspBoundary.vstartr][0], newlst)) {
        // very well, currently only showing single region and that region is still in use
        dspParam = '&' + bbj.displayedRegionParam();
    } else {
        var preservedRegions = [];
        var oldlookregion = [];
        for (i = bbj.dspBoundary.vstartr; i <= bbj.dspBoundary.vstopr; i++)
            oldlookregion.push(bbj.regionLst[i][0]);
        for (i = 0; i < newlst.length; i++) {
            if (thinginlist(newlst[i], oldlookregion))
                preservedRegions.push(newlst[i]);
        }
        var dspSeq = null;
        if (preservedRegions.length > 0) {
            dspSeq = preservedRegions[0];
        } else {
            dspSeq = newlst[0];
        }
        // just use first sequence but need to make sure not to display too long region
        var totalLength = 0;
        for (i = 0; i < newlst.length; i++)
            totalLength += bbj.genome.scaffold.len[newlst[i]];
        var allowed = parseInt(totalLength / 3);
        if (allowed <= 80) {
            print2console("Sorry cannot carry out this operation, please try again by including more scaffold sequences", 2);
            return;
        }
        allowed = allowed > bbj.genome.scaffold.len[dspSeq] ? bbj.genome.scaffold.len[dspSeq] : allowed;
        dspParam = '&runmode=' + RM_genome + '&startChr=' + dspSeq + '&startCoord=0&stopChr=' + dspSeq + '&stopCoord=' + (allowed > 10000 ? 10000 : allowed);
    }
    bbj.genome.scaffold.current = newlst;
    bbj.genome.scfdoverview_makepanel();
    scfd_cancelconfigure();
    // make some new param strings
    var tmp = [];
    for (i = 0; i < newlst.length; i++) {
        tmp.push(newlst[i]);
        tmp.push(bbj.genome.scaffold.len[newlst[i]]);
    }
    bbj.ajaxX('scaffoldUpdate=on&scaffoldNames=' + tmp.join(',') + ',&scaffoldCount=' + newlst.length + dspParam);
}

function lnkgrp_seq_mo(event) {
// from inside menu, mouse over a seq item
    var bbj = gflag.menu.bbj;
    var dom = event.target;
    if (!dom.className) {
        dom = dom.parentNode;
    }
    var n = dom.n; // this seq name
    picasays.innerHTML = '<b>' + n + '</b> ' + bbj.genome.scaffold.len[n] + ' bp, ' + dom.strand + '<br>Distance: ' + dom.cM + ' cM';
    pica_go(event.clientX, event.clientY);
// highlight this seq on linkage map
    var o = bbj.genome.linkagegroup;
    o.lg2holder[bbj.genome.scaffold.tolnkgrp[n]].appendChild(o.shadow);
    o.shadow.style.left = o.sf * dom.cM - 2;
}

function lnkgrp_seq_click(event) {
    var bbj = gflag.menu.bbj;
    var dom = event.target;
    if (!dom.className) {
        dom = dom.parentNode;
    }
    var n = dom.n;
    bbj.cgiJump2coord(n + ':0-' + bbj.genome.scaffold.len[n]);
    menu_hide();
}

function lnkgrp_div_md(event) {
// drag on linkage group bar and select a bunch of seq to show
    if (event.button != 0) return;
    event.preventDefault();
    var dom = event.target;
    while (!dom.lgname) {
        dom = dom.parentNode;
    }
    var bbj = gflag.menu.bbj;
    var pos = absolutePosition(dom);
    indicator.style.left = event.clientX + document.body.scrollLeft;
    indicator.style.top = pos[1];
    indicator.style.width = 1;
    indicator.style.height = dom.clientHeight;
    gflag.c18 = {
        domwidth: dom.clientWidth,
        x: event.clientX + document.body.scrollLeft,
        lgname: dom.lgname,
        xcurb: pos[0]
    };
    document.body.addEventListener('mousemove', lnkgrp_div_mm, false);
    document.body.addEventListener('mouseup', lnkgrp_div_mu, false);
}
function lnkgrp_div_mm(event) {
    var currx = event.clientX + document.body.scrollLeft;
    var n = gflag.c18;
    indicator.style.display = 'block';
    if (currx > n.x) {
        if (currx < n.xcurb + n.domwidth) {
            indicator.style.width = currx - n.x;
        }
    } else {
        if (currx >= n.xcurb) {
            indicator.style.width = n.x - currx;
            indicator.style.left = currx;
        }
    }
}
function lnkgrp_div_mu(event) {
    document.body.removeEventListener('mousemove', lnkgrp_div_mm, false);
    document.body.removeEventListener('mouseup', lnkgrp_div_mu, false);
    indicator.style.display = 'none';
    var n = gflag.c18;
    var x = parseInt(indicator.style.left) - n.xcurb;
    var w = parseInt(indicator.style.width);
    var bbj = gflag.menu.bbj;
    var i = parseInt(x / bbj.genome.linkagegroup.lg2piecewidth[n.lgname]);
    var j = parseInt((x + w) / bbj.genome.linkagegroup.lg2piecewidth[n.lgname]);
    var lst = bbj.genome.linkagegroup.hash[n.lgname];
    if (i < lst.length && j < lst.length) {
        menu_hide();
        gflag.menu.bbj.cloak();
        gflag.menu.bbj.ajaxX(gflag.menu.bbj.runmode_param() + '&jump=on&jumppos2=' +
        lst[i].n + ',0,' + lst[j].n + ',' +
        gflag.menu.bbj.genome.scaffold.len[lst[j].n]);
    }
}

/*** __scaffold__ ends ***/