/**
 * Created by dpuru on 2/27/15.
 */

var genome = {}; // key: genome name (dbName), val: Genome object

function Genome(param) {
// page components must be ready
    this.init_genome_param = param; // need to keep it, some components will only be made after loading genome data
    this.hmtk = {};
    this.pending_custtkhash = {};
    this.temporal_ymd = null; // temporal data, at day-precision

    this.mdselect = {};
    var d = document.createElement('div');
    this.mdselect.main = d;
    if (param.custom_track) {
        this.custtk = {
            names: [],
        };

        // submission ui
        var d = document.createElement('div'); // overal wrapper
        d.style.position = 'relative';
        this.custtk.main = d;
        // launch buttons
        var d2 = dom_create('div', d, 'display:block;position:absolute;left:0px;top:0px;width:800px;');
        dom_create('div', d2, 'margin:15px 0px;color:white;').innerHTML = 'Tracks need to be hosted on a web server that is accessible by this browser server.';
        this.custtk.buttdiv = d2;
        var d3 = dom_create('div', d2);
        d3.className = 'largebutt';
        d3.addEventListener('click', function () {
            custtkpanel_show(FT_bedgraph_c);
        }, false);
        d3.innerHTML = 'bedGraph<div style="color:inherit;font-weight:normal;font-size:70%;">quantitative data</div>';

        d3 = dom_create('div', d2);
        d3.className = 'largebutt';
        d3.addEventListener('click', function () {
            custtkpanel_show(FT_bigwighmtk_c);
        }, false);
        d3.innerHTML = 'bigWig';

        d3 = dom_create('div', d2);
        d3.className = 'largebutt';
        d3.addEventListener('click', function () {
            custtkpanel_show(FT_cat_c);
        }, false);
        d3.innerHTML = 'Categorical';

        dom_create('br', d2);

        d3 = dom_create('div', d2);
        d3.className = 'largebutt';
        d3.addEventListener('click', function () {
            custtkpanel_show(FT_anno_c);
        }, false);
        d3.innerHTML = 'Hammock<div style="color:inherit;font-weight:normal;font-size:70%;">annotation data</div>';
        d3 = dom_create('div', d2);
        d3.className = 'largebutt';
        d3.addEventListener('click', function () {
            custtkpanel_show(FT_weaver_c);
        }, false);
        d3.innerHTML = 'Genomealign<div style="color:inherit;font-weight:normal;font-size:70%;">Genome alignment</div>';

        d3 = dom_create('div', d2);
        d3.className = 'largebutt';
        d3.addEventListener('click', function () {
            custtkpanel_show(FT_lr_c);
        }, false);
        d3.innerHTML = 'Interaction<div style="color:inherit;font-weight:normal;font-size:70%;">pairwise interaction</div>';

        d3 = dom_create('div', d2);
        d3.className = 'largebutt';
        d3.addEventListener('click', function () {
            custtkpanel_show(FT_bed_c);
        }, false);
        d3.innerHTML = 'BED';

        d3 = dom_create('div', d2);
        d3.className = 'largebutt';
        d3.addEventListener('click', function () {
            custtkpanel_show(FT_bam_c);
        }, false);
        d3.innerHTML = 'BAM';
        dom_create('br', d2);
        d3 = dom_create('div', d2, 'color:rgb(81,118,96);');
        d3.className = 'largebutt';
        d3.addEventListener('click', function () {
            custtkpanel_show(FT_huburl);
        }, false);
        var butt = dom_create('input', d2, 'display:none');
        butt.type = 'file';
        butt.addEventListener('change', jsonhub_choosefile, false);
        d3.innerHTML = 'Datahub<div style="color:inherit;font-weight:normal;">by URL link</div>';
        d3 = dom_create('div', d2, 'color:rgb(81,118,96);');
        d3.className = 'largebutt';
        d3.addEventListener('click', jsonhub_upload, false);
        d3.innerHTML = 'Datahub<div style="color:inherit;font-weight:normal;">by upload</div>';
        dom_create('div', d2, 'margin:15px 0px;color:white;').innerHTML = 'Got text files instead? <span class=clb3 onclick="toggle7_2();toggle27()">Upload them from your computer.</span>' +
        '<br><br>To submit <a href=' + FT2noteurl[FT_cm_c] + ' target=_blank>methylC</a> or <a href=' + FT2noteurl[FT_matplot] + ' target=_blank>matplot</a> track, use Datahub.';
        // submission ui
        d2 = dom_create('div', d, 'position:absolute;display:none;');
        this.custtk.ui_submit = d2;
        this.custtk.ui_bedgraph = this.custtk_makeui(FT_bedgraph_c, d2);
        this.custtk.ui_hammock = this.custtk_makeui(FT_anno_c, d2);
        this.custtk.ui_weaver = this.custtk_makeui(FT_weaver_c, d2);
        this.custtk.ui_bed = this.custtk_makeui(FT_bed_c, d2);
        this.custtk.ui_lr = this.custtk_makeui(FT_lr_c, d2);
        this.custtk.ui_bigwig = this.custtk_makeui(FT_bigwighmtk_c, d2);
        this.custtk.ui_cat = this.custtk_makeui(FT_cat_c, d2);
        this.custcate_idnum_change(5);
        this.custtk.ui_bam = this.custtk_makeui(FT_bam_c, d2);
        this.custtk.ui_hub = this.custtk_makeui(FT_huburl, d2);
    }

    this.scaffold = {};
    this.defaultStuff = {};

    /*** bird's eye view
     track canvas's height will be .qtc.height, with no padding
     but will have 4px top margin

     "data" points to a hash of tracks
     key: track name
     value: {}
     'data': the data vector, addressed by chr name
     'tr': <tr> in bev_dataregistry
     'min', 'max': threshold values
     'minspan', 'maxspan': place to write threshold values in <tr>
     'canvas':{'chr1':<canvas>,...}
     "ongoing" indicates the track that's been computed
     could be undefined, to indicate that all vectors are under focus...
     "pressedChr" the chr name that is used for zoom in
     'scfd' is a partial replicate of global object scaffold
     ***/
    this.bev = {};
    return this;
}

Genome.prototype.jsonGenome = function (data) {
    /* establish genome components with json data
     */
    this.name = data.dbname;
    this.hasGene = data.hasGene;
    this.noblastdb = data.noblastdb ? true : false;

    for (var i = 0; i < gflag.mdlst.length; i++) {
        var v = gflag.mdlst[i];
        if (v.tag == literal_imd) {
            v.c2p[this.name] = {};
            v.c2p[this.name][literal_imd_genome] = 1;
            if (!(literal_imd_genome in v.p2c)) v.p2c[literal_imd_genome] = {};
            v.p2c[literal_imd_genome][this.name] = 1;
            stripChild(v.mainul, 0);
            for (var rt in v.root) {
                make_mdtree_recursive(rt, v, i, v.mainul);
            }
            break;
        }
    }


    if (data.yearlyMonthlyLength) {
        this.temporal_ymd = {};
        for (var i = 0; i < data.yearlyMonthlyLength.length; i++) {
            var t = data.yearlyMonthlyLength[i];
            if (t[0] in this.temporal_ymd) {
                this.temporal_ymd[t[0]][t[1]] = t[2];
            } else {
                var a = {};
                a[t[1]] = t[2];
                this.temporal_ymd[t[0]] = a;
            }
        }
    }

    this.defaultStuff = {
        coord: data.defaultPosition,
        gsvlst: data.defaultGenelist,
        custtk: {},
        initmatplot: data.initmatplot,
        runmode: data.runmode,
        decor: [],
    };
    if (data.defaultDecor) {
        this.defaultStuff.decor = data.defaultDecor.split(',');
    }

    if (this.custtk) {
        var v = data.defaultCustomtracks;
        if (v) {
            this.defaultStuff.custtk = v;
            if (!(FT_bam_c in v)) this.custtk.ui_bam.examplebutt.style.display = 'none';
            if (!(FT_bed_c in v)) this.custtk.ui_bed.examplebutt.style.display = 'none';
            if (!(FT_bedgraph_c in v)) this.custtk.ui_bedgraph.examplebutt.style.display = 'none';
            if (!(FT_bigwighmtk_c in v)) this.custtk.ui_bigwig.examplebutt.style.display = 'none';
            if (!(FT_cat_c in v)) this.custtk.ui_cat.examplebutt.style.display = 'none';
            if (!(FT_anno_c in v)) this.custtk.ui_hammock.examplebutt.style.display = 'none';
            if (!(FT_huburl in v)) this.custtk.ui_hub.examplebutt.style.display = 'none';
            if (!(FT_lr_c in v)) this.custtk.ui_lr.examplebutt.style.display = 'none';
            if (FT_weaver_c in v) {
                var g = this;
                for (var qn in v[FT_weaver_c]) {
                    dom_create('div',
                        this.custtk.ui_weaver.weavertkholder,
                        'display:inline-block;margin:10px;',
                        {t: qn, c: 'clb', clc: weaver_custtk_example(g, qn, v[FT_weaver_c][qn])});
                }
            }
        }
    }

    if (data.keggSpeciesCode) {
        this.keggSpeciesCode = data.keggSpeciesCode;
    }
    if (this.init_genome_param.gsm) {
        this.make_gsm_ui();
    }

    /* some tracks are associated with specific regions
     assume these tracks are all assay datasets
     */
    if ('track2Regions' in data) {
        for (var n in data.track2Regions) {
            var tk = this.hmtk[n];
            if (tk != undefined) {
                var o = data.track2Regions[n];
                tk.regions = [o[0], o[1].split(',')];
            }
        }
    }

    this.decorInfo = {};
    if (data.decorJson) {
        for (var n in data.decorJson) {
            decorJson_parse(data.decorJson[n], this.decorInfo);
        }
    }
    this.searchgenetknames = [];
    for (var tkn in this.decorInfo) {
        var tk = this.decorInfo[tkn];
        if (!tk.filetype) {
            print2console('filetype missing for track ' + tkn, 2);
            delete this.decorInfo[tkn];
            continue;
        }
        var n = tk.filetype.toLowerCase();
        tk.ft = FT2native.indexOf(n);
        if (tk.ft == -1) {
            tk.ft = FT2verbal.indexOf(n);
        }
        if (tk.ft == -1) {
            print2console('Wrong file type for ' + tkn + ': ' + n, 2);
            delete this.decorInfo[tkn];
            continue;
        }
        delete tk.filetype;

        parseHubtrack(tk);

        if (tk.ft == FT_weaver_c) {
            if (!tk.querygenome) {
                print2console('Missing querygenome for ' + tkn, 2);
                delete this.decorInfo[tkn];
                continue;
            }
            tk.cotton = tk.querygenome;
            delete tk.querygenome;
        }
        if (tk.categories) {
            tk.cateInfo = tk.categories;
            delete tk.categories;
        }
        if (tk.isgene && tk.dbsearch) {
            this.searchgenetknames.push(tk.name);
        }
    }
    this.tablist_decor = document.createElement('div');
    this.tablist_decor.style.margin = 10;
    dom_maketree(data.decorJson, this.tablist_decor, decorTrackcell_make);

    this.cytoband = {};
    if ('cytoband' in data) {
        for (var i = 0; i < data.cytoband.length; i++) {
            if (data.cytoband[i][0] in this.cytoband)
                this.cytoband[data.cytoband[i][0]].push(data.cytoband[i].slice(1, 5));
            else
                this.cytoband[data.cytoband[i][0]] = [data.cytoband[i].slice(1, 5)];
        }
    }

    /* scaffold
     */
    this.scaffold = {p2c: {}, c2p: {}, len: {}, current: [], toadd: [], move: {}};
    for (var i = 0; i < data.scaffoldInfo.length; i++) {
        var lst = data.scaffoldInfo[i];
        this.scaffold.c2p[lst[1]] = lst[0];
        if (!(lst[0] in this.scaffold.p2c)) {
            this.scaffold.p2c[lst[0]] = {};
        }
        this.scaffold.p2c[lst[0]][lst[1]] = 1;
        if (lst[2] > 0) {
            // child is sequence
            this.scaffold.len[lst[1]] = lst[2];
        }
    }
    this.scaffold.current = [];
    var lst = data.defaultScaffold.split(',');
    for (i = 0; i < lst.length; i++) {
        if (lst[i].length > 0) {
            if (lst[i] in this.scaffold.len) {
                this.scaffold.current.push(lst[i]);
            } else {
                print2console('Invalid scaffold sequence name: ' + lst[i], 2);
            }
        }
    }
    var t = document.createElement('table');
    t.cellSpacing = 0;
    t.cellPadding = 2;
    this.scaffold.overview = {
        holder: t,
        maxw: 800,
        trlst: [],
        pwidth: {},
        barheight: 14,
    };

    /* linkage group
     */
    if (data.linkagegroup) {
        var hash = {};
        var order = [];
        var glen = {}; // 'len' of each group: biggest genetic distance
        var s2g = {}; // seq 2 group
        for (var i = 0; i < data.linkagegroup.length; i++) {
            var t = data.linkagegroup[i];
            // seq, grp, dist, width, strand
            if (t[1] in hash) {
                hash[t[1]].push({n: t[0], d: t[2], w: t[3], s: t[4]});
                if (t[2] > glen[t[1]]) {
                    glen[t[1]] = t[2];
                }
            } else {
                order.push(t[1]);
                glen[t[1]] = t[2];
                hash[t[1]] = [{n: t[0], d: t[2], w: t[3], s: t[4]}];
            }
            s2g[t[0]] = t[1];
        }
        this.linkagegroup = {
            hash: hash,
            totalnum: data.linkagegroup.length,
            maxw: Math.max(800, document.body.clientWidth - 400),
            order: order,
            len: glen,
            c_for: 'rgb(0,102,0)',
            c_rev: 'rgb(255,102,0)',
            c_un: '#a8a8a8',
            h_top: 4,
            h_link: 40,
            h_bottom: 10,
        };
        this.scaffold.tolnkgrp = s2g;
    }

// make scaffold panel after parsing linkage group
    this.scfdoverview_makepanel();

    /* public hubs */
    this.publichub = {holder: document.createElement('div'), lst: []};
//this.publichub.holder.style.marginBottom=20;
    this.publichub.holder.style.width = 1200;
    if (data.publichub && data.publichub.length > 0) {
        for (var i = 0; i < data.publichub.length; i++) {
            var hub = data.publichub[i];
            var childholder = this.publichub_makehandle(hub, this.publichub.holder);
            if (hub.hublist) {
                for (var j = 0; j < hub.hublist.length; j++) {
                    this.publichub_makehandle(hub.hublist[j], childholder);
                }
            }
        }
    } else {
        this.publichub.holder.className = 'alertmsg';
        this.publichub.holder.style.color = 'white';
        this.publichub.holder.innerHTML = 'There are no public track hubs available for this genome.';
    }


    /* prepare bev panel, can't do this in Genome, requires scfd info
     */
    if (apps.bev) {
        this.bev.main = document.createElement('div');
        var d = make_headertable(this.bev.main);
        d._h.style.textAlign = 'left';
        var t = dom_addrowbutt(d._h, [
                {text: 'Add track', pad: true, call: bev_addtrack_invoketkselect},
                {text: 'Add gene set', pad: true, call: bev_showgeneset},
                {text: '&#9881; Configure', pad: true, call: bev_config},
                {text: 'Screenshot', pad: true, call: bev_svg}],
            'margin:0px 20px;',
            colorCentral.background_faint_5);
        this.bev.main.svgbutt = t.firstChild.firstChild.childNodes[3];
        this.bev.main.svgbutt.addEventListener('mousedown', bev_svgbutt_md, false);
        this.bev.main.svgsays = dom_addtext(d._h);
        var d2 = dom_create('div', d._c, 'height:600px;overflow-y:scroll;');
        this.bev.viewtable = dom_create('table', d2);
        this.bev.chrlst = [];
        var lst = this.scaffold.current;
        for (var i = 0; i < lst.length; i++) {
            /* each ele:
             0. chr name
             1. canvas size, spnum
             2. ideogram <canvas>
             3. <td> to hold track canvas
             */
            this.bev.chrlst.push([lst[i], 0, null]);
        }
        this.bev.config = {
            maxpxwidth: document.body.clientWidth - 300,
            chrbarheight: 14,
            chrbarminheight: 6, // <= this number chrbar will be hidden
        };
        menu.c40.says.innerHTML = this.bev.config.maxpxwidth;
        this.bev.tklst = [];
        this.bev_prepare();
        this.bev_draw();
    }
};


Genome.prototype.getcytoband4region2plot = function (chrom, start, stop, plotwidth) {
    /* given a query region, find cytoband data in it
     for each band returns [name, plot length (pixel), coloridx, athead(bool), attail(bool)]
     plotwidth: on screen width of this interval
     */
    if (!(chrom in this.cytoband)) return chrom;
    var sf = plotwidth / (stop - start);
    var result = [];
    var elen = this.scaffold.len[chrom];
    for (var i = 0; i < this.cytoband[chrom].length; i++) {
        var b = this.cytoband[chrom][i];
        if (Math.max(start, b[0]) < Math.min(stop, b[1])) {
            var thisstart = Math.max(start, b[0]);
            var thisstop = Math.min(stop, b[1]);
            result.push([b[3], (thisstop - thisstart) * sf, b[2], thisstart == 0, thisstop == elen]);
        }
    }
    return result;
};

function drawIdeogramSegment_simple(data, ctx, x, y, plotwidth, plotheight, tosvg) {
    /* only draws data within a region
     args:
     data: getcytoband4region2plot() output
     x/y: starting plot position on canvas, must be integer
     plotwidth: entire plotting width, only used to draw the blank rectangle
     */
    ctx.font = "bold 8pt Sans-serif";
    var mintextheight = 13;
    if (typeof(data) == 'string') {
        // no cytoband data
        var svgdata = [];
        ctx.strokeStyle = colorCentral.foreground;
        ctx.strokeRect(x, y + 0.5, plotwidth, plotheight);
        if (tosvg) svgdata.push({
            type: svgt_rect,
            x: x,
            y: y + .5,
            w: plotwidth,
            h: plotheight,
            stroke: ctx.strokeStyle
        });
        ctx.fillStyle = colorCentral.foreground;
        var s = data; // is chrom name
        var w = ctx.measureText(s).width;
        if (w <= plotwidth && plotheight >= mintextheight) {
            var y2 = y + 10 + (plotheight - mintextheight) / 2;
            ctx.fillText(s, x + (plotwidth - w) / 2, y2);
            if (tosvg) svgdata.push({type: svgt_text, x: x + (plotwidth - w) / 2, y: y2, text: s, bold: true});
        }
        return svgdata;
    }
    var svgdata = [];
    var previousIsCentromere = null;
    for (var i = 0; i < data.length; i++) {
        var band = data[i];
        if (band[2] >= 0) {
            ctx.fillStyle = 'rgb(' + cytoBandColor[band[2]] + ',' + cytoBandColor[band[2]] + ',' + cytoBandColor[band[2]] + ')';
            ctx.fillRect(x, y, band[1], plotheight);
            if (tosvg) svgdata.push({type: svgt_rect, x: x, y: y, w: band[1], h: plotheight, fill: ctx.fillStyle});
            ctx.strokeStyle = colorCentral.foreground;
            ctx.beginPath();
            ctx.moveTo(x, 0.5 + y);
            ctx.lineTo(x + band[1], 0.5 + y);
            ctx.moveTo(x, plotheight - 0.5 + y);
            ctx.lineTo(x + band[1], plotheight - 0.5 + y);
            ctx.stroke();
            if (tosvg) {
                svgdata.push({type: svgt_line, x1: x, y1: y + .5, x2: x + band[1], y2: y + .5});
                svgdata.push({
                    type: svgt_line,
                    x1: x,
                    y1: plotheight - 0.5 + y,
                    x2: x + band[1],
                    y2: plotheight - 0.5 + y
                });
            }
            var w = ctx.measureText(band[0]).width;
            if (w < band[1] && plotheight >= mintextheight) {
                ctx.fillStyle = 'rgb(' + cytoWordColor[band[2]] + ',' + cytoWordColor[band[2]] + ',' + cytoWordColor[band[2]] + ')';
                var y2 = y + 10 + (plotheight - mintextheight) / 2;
                ctx.fillText(band[0], x + (band[1] - w) / 2, y2);
                if (tosvg) svgdata.push({
                    type: svgt_text,
                    x: x + (band[1] - w) / 2,
                    y: y2,
                    text: band[0],
                    color: ctx.fillStyle,
                    bold: true
                });
            }
            if (previousIsCentromere == true) {
                ctx.fillStyle = colorCentral.foreground;
                ctx.fillRect(x, y, 1, plotheight);
                if (tosvg) svgdata.push({type: svgt_line, x1: x, y1: y, x2: x, y2: y + plotheight});
            }
            previousIsCentromere = false;
        } else {
            ctx.fillStyle = centromereColor;
            ctx.fillRect(x, 3 + y, band[1], plotheight - 5);
            if (tosvg) svgdata.push({
                type: svgt_rect,
                x: x,
                y: y + 3,
                w: band[1],
                h: plotheight - 5,
                fill: ctx.fillStyle
            });
            var w = ctx.measureText('centromere').width;
            if (w < band[1]) {
                ctx.fillStyle = 'white';
                ctx.fillText('centromere', x + (band[1] - w) / 2, 10 + y);
                if (tosvg) svgdata.push({
                    type: svgt_text,
                    x: x + (band[1] - w) / 2,
                    y: y + 10,
                    color: ctx.fillStyle,
                    text: 'centromere',
                    bold: true
                });
            }
            if (previousIsCentromere == false) {
                ctx.fillStyle = colorCentral.foreground;
                ctx.fillRect(x - 1, y, 1, plotheight);
                if (tosvg) svgdata.push({type: svgt_line, x1: x - 1, y1: y, x2: x - 1, y2: y + plotheight});
            }
            previousIsCentromere = true;
        }
        if (band[3]) {
            // enclose head
            ctx.fillStyle = colorCentral.foreground;
            ctx.fillRect(x, y, 1, plotheight);
            if (tosvg) svgdata.push({type: svgt_line, x1: x, y1: y, x2: x, y2: y + plotheight});
        }
        if (band[4]) {
            // enclose tail
            ctx.fillStyle = colorCentral.foreground;
            ctx.fillRect(x + band[1], y, 1, plotheight);
            if (tosvg) svgdata.push({type: svgt_line, x1: x + band[1], y1: y, x2: x + band[1], y2: y + plotheight});
        }
        x += band[1];
    }
    return svgdata;
}


/*** __genome__ ends ***/



