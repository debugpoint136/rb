/**
 * ===BASE===// wvfind // draw_stitch.js
 * @param 
 */

function draw_stitch(p) {
    var b1h = p.b1h ? p.b1h : (p.targetstruct ? 11 : 5),
        b2h = p.b2h ? p.b2h : (p.stitch.querygene ? 11 : 5),
        alnh = p.alnheight ? p.alnheight : 22;
    var c = dom_create('canvas', p.holder);
    c.width = p.width;
    c.height = b1h + b2h + alnh + (p.allstitches ? (p.allstitches.length - 1) * (b2h + 2) : 0);
    var sf = p.width / Math.max(p.stop - p.start, p.stitch.stop - p.stitch.start);
    var ctx = c.getContext('2d');
    var w = sf * (p.stop - p.start);
    if (p.targetstruct) {
        plotGene(ctx, p.targetcolor, 'white',
            {start: p.start, stop: p.stop, strand: p.strand, struct: p.targetstruct},
            0, 0, w, b1h,
            p.start, p.stop,
            false);
    } else {
        ctx.fillStyle = p.targetcolor;
        ctx.fillRect(0, 0, w, b1h);
    }
    var stcw = sf * (p.stitch.stop - p.stitch.start);
    ctx.fillStyle = p.querycolor;
    if (p.stitch.querygene) {
        ctx.fillRect(0, b1h + alnh + parseInt(b2h / 2), stcw, 1);
        plotGene(ctx, p.querycolor, 'white',
            p.stitch.querygene,
            0, b1h + alnh, stcw, b2h,
            p.stitch.start, p.stitch.stop,
            false);
    } else {
        ctx.fillRect(0, b1h + alnh, stcw, b2h)
    }
    ctx.fillStyle = '#858585';
    for (var i = 0; i < p.stitch.lst.length; i++) {
        var e = p.stitch.lst[i];
        var a1 = (e.targetstart - p.start) * sf,
            a2 = Math.max(a1 + 1, (e.targetstop - p.start) * sf),
            b1 = (e.querystart - p.stitch.start) * sf,
            b2 = Math.max(b1 + 1, (e.querystop - p.stitch.start) * sf);
        ctx.beginPath();
        ctx.moveTo(a1, b1h + 1);
        ctx.lineTo(a2, b1h + 1);
        var h2 = b1h + alnh - 1;
        if (e.strand == '+') {
            ctx.lineTo(b2, h2);
            ctx.lineTo(b1, h2);
        } else {
            ctx.lineTo(b1, h2);
            ctx.lineTo(b2, h2);
        }
        ctx.closePath();
        ctx.fill();
    }
    /*
     if(p.allstitches) {
     ctx.fillStyle=p.querycolor;
     for(var i=1; i<p.allstitches.length; i++) {
     var e=p.allstitches[i];
     ctx.fillRect(0,b2h+alnh+(i-1)*(b1h+b2h),sf*(e.stop-e.start),b2h)
     }
     }
     */
}

