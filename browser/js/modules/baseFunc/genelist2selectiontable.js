/**
 * ===BASE===// baseFunc // genelist2selectiontable.js
 * @param 
 */

function genelist2selectiontable(genelst, table, callback) {
    stripChild(table, 0);
    var total = 0;
    for (var i = 0; i < genelst.length; i++) {
        total += genelst[i].lst.length;
    }
    var showlimit = 30;
    var showcount = Math.min(total, showlimit);
    if (showcount < total) {
        var tr = table.insertRow(0);
        var td = tr.insertCell(0);
        td.colSpan = 4;
        td.align = 'center';
        td.innerHTML = 'Showing first ' + showlimit + ' genes, ' + (total - showcount) + ' not shown';
    }
// hardcoded genename, put xeno genes to bottom
    var L1 = [], L2 = [];
    for (var i = 0; i < genelst.length; i++) {
        for (var j = 0; j < genelst[i].lst.length; j++) {
            var g = genelst[i].lst[j];
            if (g.type && g.type.toLowerCase() == 'xenorefgene') {
                L2.push(g);
            } else {
                L1.push(g);
            }
        }
    }
    genelst = L1.concat(L2);
// see if genes are in same chr, if so, use better graphic
    var chr = genelst[0].c;
    var insamechr = true;
    for (var i = 1; i < showcount; i++) {
        if (genelst[i].c != chr) {
            insamechr = false;
            break;
        }
    }

    var w = 200, h = 11; // canvas size
    if (insamechr) {
        // get left/right most coord
        var start = genelst[0].a, stop = genelst[0].b;
        for (i = 1; i < showcount; i++) {
            start = Math.min(start, genelst[i].a);
            stop = Math.max(stop, genelst[i].b);
        }
        var sf = w / (stop - start);
        // first row is header
        var tr = table.insertRow(-1);
        var td = tr.insertCell(0);
        td.align = 'center';
        td.innerHTML = chr;
        var td = tr.insertCell(-1);
        var c = dom_create('canvas', td);
        c.width = w;
        c.height = 10;
        var ctx = c.getContext('2d');
        ctx.fillStyle = colorCentral.foreground;
        ctx.fillRect(0, 0, 1, 10);
        ctx.fillRect(w - 1, 0, 1, 10);
        ctx.fillRect(0, 9, w, 1);
        ctx.fillText(start, 3, 8);
        var w2 = ctx.measureText(stop.toString()).width;
        ctx.fillText(stop, w - w2 - 3, 8);
        tr.insertCell(-1);
        tr.insertCell(-1);
        for (i = 0; i < showcount; i++) {
            var g = genelst[i];
            var tr = table.insertRow(-1);
            tr.className = 'clb_o';
            tr.onclick = callback(g);
            tr.addEventListener('click', callback, false);
            tr.idx = i;
            var td = tr.insertCell(0);
            td.align = 'right';
            td.innerHTML = g.type;
            td = tr.insertCell(-1);
            var c = dom_create('canvas', td);
            c.width = w;
            c.height = h;
            var ctx = c.getContext('2d');
            plotGene(ctx, '#956584', 'white',
                {start: g.a, stop: g.b, strand: g.strand, struct: g.struct},
                (g.a - start) * sf,
                0,
                sf * (g.b - g.a),
                h,
                g.a, g.b, false);
            td = tr.insertCell(-1);
            td.innerHTML = g.a + '-' + g.b;
            if (g.desc) {
                td = tr.insertCell(-1);
                td.style.fontSize = 10;
                td.innerHTML = g.desc.length > 100 ? (g.desc.substr(0, 100) + '...') : g.desc;
            }
        }
    } else {
        // get max width of these genes for plotting
        var maxbp = 0;
        for (var i = 0; i < showcount; i++) {
            maxbp = Math.max(maxbp, genelst[i].b - genelst[i].a);
        }
        var sf = w / maxbp;
        for (i = 0; i < showcount; i++) {
            var g = genelst[i];
            var tr = table.insertRow(-1);
            tr.className = 'clb_o';
            tr.onclick = callback(g);
            tr.idx = i;
            var td = tr.insertCell(0);
            td.align = 'right';
            td.innerHTML = g.type;
            td = tr.insertCell(-1);
            var c = dom_create('canvas', td);
            c.width = w;
            c.height = h;
            var ctx = c.getContext('2d');
            plotGene(ctx, '#956584', 'white',
                {start: g.a, stop: g.b, strand: g.strand, struct: g.struct},
                0, 0, sf * (g.b - g.a), h, g.a, g.b, false);
            td = tr.insertCell(-1);
            td.innerHTML = g.c + ':' + g.a + '-' + g.b;
            if (g.desc) {
                td = tr.insertCell(-1);
                td.innerHTML = g.desc.length > 100 ? (g.desc.substr(0, 100) + '...') : g.desc;
            }
        }
    }
}

