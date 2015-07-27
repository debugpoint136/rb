/**
 * ===BASE===// scaffold // scfdoverview_makepanel.js
 * @param __Genome.prototype__
 * @param 
 */

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

