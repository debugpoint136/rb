/**
 * ===BASE===// baseFunc // browser_makeDoms.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.browser_makeDoms = function (param) {
    /* leftColumnWidth must be set prior to this
     */
    this.minTkheight = param.mintkheight ? param.mintkheight : 10;
    if (param.centralholder) {
        // cottonbbj has no visible main
        param.centralholder.style.position = 'relative';
        stripChild(param.centralholder, 0);
    }
    var o_test = false;
    var table = dom_create('table', param.centralholder, param.mainstyle);
    table.cellPadding = table.cellSpacing = 0;

    var bbj = this;
    /* must not use onmouseover=function(){gflag.browser=bbj;}
     since that will make splinters unreachable
     */
    table.ismaintable = true;
    table.onmouseover = browser_table_mover;
    table.horcrux = this.horcrux;
    table.bbj = this;
    this.main = table;
    /***** row 1 ******/
    var tr = table.insertRow(0);
    var td = tr.insertCell(0); // 1
    td.colSpan = 4; // for the splinter holder
    if (param.header) {
        this.header = {};
        td.vAlign = 'top';
        td.align = 'center';
        td.style.color = param.header.fontcolor ? param.header.fontcolor : colorCentral.foreground_faint_5;
        td.style.whiteSpace = 'nowrap';
        td.style.fontSize = param.header.fontsize;
        if (param.header.bg) td.style.backgroundColor = param.header.bg;
        if (param.header.height) td.style.height = param.header.height;
        if (param.header.padding) td.style.padding = param.header.padding;

        // navigation buttons
        var dspbutt = null;
        if (param.header.dspstat) {
            var u = param.header.dspstat.allowupdate;
            dspbutt = {
                text: '<span style="background-color:#545454;color:white;padding:5px;">LOADING...</span>',
                attr: {allowupdate: u},
                call: function (e) {
                    bbj.clicknavibutt({d: e.target});
                }
            };
            if (!u) {
                // no updating butt
                dspbutt.text = 'position';
            }
        }
        var buttlst = [];
        if (dspbutt) {
            buttlst.push(dspbutt);
        }
        buttlst.push({text: '&#10010;', pad: true, call: browser_zoomin, attr: {fold: 2, title: 'zoom in 1 fold'}});
        for (var i = 0; i < param.header.zoomout.length; i++) {
            var v = param.header.zoomout[i];
            buttlst.push({
                text: '&#9473;' + (param.header.zoomout.length == 1 ? '' : v[0]), pad: true,
                call: browser_zoomout,
                attr: {fold: v[1], title: 'zoom out ' + v[1] + ' fold'}
            });
        }
        buttlst.push({
            text: '&#9664;', call: browser_pan,
            attr: {direction: 'l', fold: 1, title: 'pan left'}
        });
        buttlst.push({
            text: '&#9654;', call: browser_pan,
            attr: {direction: 'r', fold: 1, title: 'pan right'}
        });
        this.header_naviholder = dom_addrowbutt(td, buttlst, undefined, colorCentral.background_faint_5);
        if (!this.trunk) {
            this.header_naviholder.style.zoom = 1.2;
        }
        if (dspbutt) {
            var b = this.header_naviholder.firstChild.firstChild.firstChild;
            this.header_dspstat = b;
            if (param.header.dspstat.tinyfont) {
                b.style.fontSize = param.header.dspstat.tinyfont;
            }
        }

        if (param.header.resolution) {
            var s = dom_addtext(td);
            this.header_resolution = s;
            s.style.margin = '0px 10px';
        }

        if (param.header.utils) {
            var blst = [];
            if (param.header.utils.track) {
                blst.push({text: 'Tracks', pad: true, call: grandaddtracks,});
                if (param.header.utils.track.no_publichub) {
                    this.header.no_publichub = true;
                }
                if (param.header.utils.track.no_custtk) {
                    this.header.no_custtk = true;
                }
                if (param.header.utils.track.no_number) {
                    this.header.no_number = true;
                }
            }
            if (param.header.utils.apps) {
                blst.push({text: 'Apps', pad: true, call: launchappPanel});
            }
            if (param.header.utils.print) {
                blst.push({text: '&#9113;', pad: true, call: param.header.utils.print});
            }
            if (param.header.utils.link) {
                blst.push({text: '&#8689;', pad: true, call: param.header.utils.link});
            }
            if (param.header.utils.bbjconfig) {
                blst.push({text: '&#9881;', pad: true, call: menu_bbjconfig_show});
            }
            if (param.header.utils.delete) {
                blst.push({text: '&#10005;', pad: true, call: param.header.utils.delete});
            }
            this.header_utilsholder = dom_addrowbutt(td, blst, 'margin-left:20px;', colorCentral.background_faint_5);
            if (!this.trunk) {
                this.header_utilsholder.style.zoom = 1.2;
            }
        }
    }
    /***** row 2 ******/
    tr = table.insertRow(-1);
    td = tr.insertCell(0); // 2-1
    if (o_test) td.innerHTML = 2;
    td = tr.insertCell(-1); // 2-2,3
    td.colSpan = 2;
    if (param.navigator) {
        var c = dom_create('canvas', td);
        c.className = 'opaque5';
        c.width = this.hmSpan;
        c.height = 0;
        this.navigator.canvas = c;
        this.navigator.show_ruler = param.navigator_ruler;
        c.addEventListener('mousemove', navigator_tooltip, false);
        c.addEventListener('mouseout', pica_hide, false);
        c.addEventListener('mousedown', navigatorMD, false);
    } else {
        this.navigator = null;
    }
    td = tr.insertCell(-1); // 2-4
    /***** row 3 ******/
    tr = table.insertRow(-1);
    td = tr.insertCell(0); // 3-1
    if (o_test) td.innerHTML = 3;
    td = tr.insertCell(1); // 3-2
    td.vAlign = 'bottom';
    if (param.ghm_scale) {
        var d = dom_create('div', td);
        d.style.height = browser_scalebar_height;
        d.style.position = 'relative';
        this.scalebar.holder = d;
        var d2 = dom_create('div', d);
        d2.style.position = 'absolute';
        d2.style.bottom = 0;
        d2.style.left = 352;
        d2.style.cursor = 'default';
        d2.innerHTML = '80mpg';
        d2.addEventListener('mousedown', scalebarSliderMD, false);
        this.scalebar.says = d2;
        var c = dom_create('canvas', d);
        c.style.display = 'block';
        c.style.position = 'absolute';
        c.style.left = 400;
        c.style.bottom = 0;
        c.width = 20;
        c.height = 16;
        c.addEventListener('mousedown', scalebarSliderMD, false);
        c.addEventListener('mouseover', scalebarMover, false);
        c.addEventListener('mouseout', scalebarMout, false);
        this.scalebar.slider = c;
        {
            var ctx = c.getContext('2d');
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 3, 1, c.height - 5);
            ctx.fillRect(0, 8, c.width, 1);
        }
        c = dom_create('canvas', d);
        c.style.display = 'block';
        c.style.position = 'absolute';
        c.style.bottom = 0;
        c.style.left = 413;
        c.width = 20;
        c.height = 16;
        c.addEventListener('mousedown', scalebarArrowMD, false);
        c.addEventListener('mouseover', scalebarMover, false);
        c.addEventListener('mouseout', scalebarMout, false);
        this.scalebar.arrow = c;
        this.drawScalebarSlider();
        this.scalebararrowStroke();
    } else {
        this.scalebar = null;
    }
    if (param.ghm_ruler) {
        var d = dom_create('div', td);
        d.className = 'scholder';
        d.style.height = 20;
        var c = dom_create('canvas', d);
        c.height = 0;
        c.width = this.hmSpan;
        c.style.position = 'absolute';
        c.onmousedown = zoomin_MD;
        c.onmousemove = browser_ruler_mover;
        c.onmouseout = pica_hide;
        this.rulercanvas = c;
    } else {
        this.rulercanvas = null;
    }
    td = tr.insertCell(-1); // 3-3 the splinter holder!!
    td.rowSpan = 7;
    td.vAlign = 'top';
    if (!param.no_splinters) {
        var stb = dom_create('table', td);
        stb.cellSpacing = stb.cellPadding = 0;
        stb.insertRow(0);
        this.splinterHolder = stb;
    }
    td = tr.insertCell(-1); // 3-4
    if (param.mcm) {
        td.vAlign = 'bottom';
        this.mcm.headerholder_top = dom_create('div', td, 'position:relative');
    }
    /***** row 4 ******/
    tr = table.insertRow(-1);
    td = tr.insertCell(0); // 4-1
    if (o_test) td.innerHTML = 4;
    if (param.tkheader) {
        td.vAlign = 'top';
        this.hmheaderdiv = td;
    } else {
        this.hmheaderdiv = null;
    }
    td = tr.insertCell(-1); // 4-2
    td.vAlign = 'top';
    var d = dom_create('div', td);
    d.className = 'scholder';
    var d2 = dom_create('div', d);
    d2.style.position = 'absolute';
    d2.style.backgroundColor = param.hmdivbg;
    d2.addEventListener('mousedown', viewboxMD, false);
    d.appendChild(d2);
    this.hmdiv = d2;
// there's no 4-3
    td = tr.insertCell(-1); // 4-4
    if (param.mcm) {
        this.mcm.tkholder = td;
        var t = dom_create('table');
        t.horcrux = this.horcrux;
        t.addEventListener('mouseover', mcmheader_mover, false);
        this.mcm.holder = t;
        t.cellPadding = t.cellSpacing = 0;
        t.insertRow(0);
        if (!param.mcmfixposition) {
            t.style.position = 'absolute';
            t.style.left = 0;
            t.attop = true;
        }
    } else {
        this.mcm = null;
    }
    /***** row 5 ******/
    tr = table.insertRow(-1);
    td = tr.insertCell(0); // 5-1
    if (o_test) td.innerHTML = 5;
    td.align = 'center';
    td.vAlign = 'top';
    var c = dom_create('canvas', td);
//c.width= td.style.width=this.leftColumnWidth;
    c.height = 12;
    c.style.marginTop = 2;
    c.style.display = 'none';
    this.basepairlegendcanvas = c;
    td = tr.insertCell(-1); // 5-2
    td.vAlign = 'top';
    d = dom_create('div', td);
    d.className = 'scholder';
    d.style.marginBottom = 2;
    td.appendChild(d);
    var d2 = dom_create('div', d);
    d2.style.position = 'absolute';
    var d3 = dom_create('div', d2);
    d3.style.position = 'relative';
    c = dom_create('canvas', d3);
    c.style.marginBottom = 3;
    c.width = this.hmSpan;
    c.height = 20;
    c.onmousedown = zoomin_MD;
    c.onmousemove = browser_ruler_mover;
    c.onmouseout = pica_hide;
    this.ideogram.canvas = c;
    td = tr.insertCell(-1); // 5-4
    td.rowSpan = 4;
    if (this.mcm) {
        td.vAlign = 'top';
        this.mcm.headerholder_bottom = dom_create('div', td, 'position:relative');
    }
    /***** row 6 not in use ******/
    tr = table.insertRow(-1);
    td = tr.insertCell(0); // 6-1
    if (o_test) td.innerHTML = 6;
    c = dom_create('canvas', td);
    c.style.display = 'none';
    this.htest.header = c;
    td = tr.insertCell(-1); // 6-2
    d = dom_create('div', td);
    d.className = 'scholder';
    d.style.display = 'none';
    this.htest.holder = d;
    c = dom_create('canvas', d);
    c.style.position = 'absolute';
    this.htest.canvas = c;
    /***** row 7 not in use ******/
    tr = table.insertRow(-1);
    td = tr.insertCell(0); // 7-1
    if (o_test) td.innerHTML = 7;
    c = dom_create('canvas', td);
    c.style.display = 'none';
    this.pwc.header = c;
    td = tr.insertCell(-1); // 7-2
    d = dom_create('div', td);
    d.className = 'scholder';
    d.style.display = 'none';
    this.pwc.holder = d;
    td.appendChild(d);
    c = dom_create('canvas', d);
    c.style.position = 'absolute';
    this.pwc.canvas = c;
    /***** row 8 ******/
    tr = table.insertRow(-1);
    td = tr.insertCell(0); // 8-1
    if (o_test) td.innerHTML = 8;
    if (param.tkheader) {
        td.vAlign = 'top';
        this.decorheaderdiv = td;
    } else {
        this.decorheaderdiv = null;
    }
    td = tr.insertCell(-1); // 8-2
    td.vAlign = 'top';
    d = dom_create('div', td);
    d.className = 'scholder';
    d2 = dom_create('div', d);
    d2.style.position = 'absolute';
    d2.addEventListener('mousedown', viewboxMD, false);
    this.decordiv = d2;

    this.shield = dom_create('div', param.centralholder, 'position:absolute;top:0px;left:0px;');

    if (param.facet) {
        this.facet = {
            main: dom_create('div', null, 'display:none;padding-top:25px;'),
            dim1: {mdidx: null, term: null},
            dim2: {mdidx: null, term: null},
            rowlst: [],
            collst: [],
            rowlst_td: [],
            collst_td: [],
            pending: {}, // a hash of tk names
        };
        // outmost div, no border
        var d = dom_create('div', this.facet.main, 'display:table;margin:0px 20px 20px 0px;');
        // actual holder
        var d2 = dom_create('div', d, 'background-color:' + colorCentral.background_faint_7);
        var d3 = dom_create('div', d2, 'margin-bottom:15px;padding:10px 20px;background-color:' + colorCentral.foreground_faint_1 + ';border-bottom:solid 1px ' + colorCentral.foreground_faint_3);
        dom_addtext(d3, 'Row ');
        var s = dom_addtext(d3, '', null, 'mdt_box');
        s.isrow = true;
        this.facet.dim1.dom = s;
        s.onclick = facet_dimension_show;
        s.style.marginRight = 20;
        dom_addtext(d3, 'Column ');
        var s = dom_addtext(d3, '', null, 'mdt_box');
        s.isrow = false;
        this.facet.dim2.dom = s;
        s.onclick = facet_dimension_show;
        this.facet.swapbutt = dom_create('div', d3, 'display:none;margin-left:20px;', {
            t: '&#8646;',
            c: 'mdt_box',
            clc: function () {
                bbj.facet_swap();
            },
            title: 'swap row/column'
        });

        var d5 = dom_create('div', d2, 'margin:0px 15px;');
        this.facet.div1 = d5;
        d5 = dom_create('table', d2, 'margin:0px 15px;');
        this.facet.div2 = d5;
        d5.cellSpacing = 3;
        d5.cellPadding = 1;
        var s = dom_create('div', d2, 'margin-left:15px;');
        s.className = 'button_warning';
        s.style.display = 'inline-block';
        s.innerHTML = 'Remove all';
        s.onclick = facet_removeall;
    } else {
        this.facet = null;
    }

    if (param.gsv) {
        this.genesetview = {
            flanking: {},
            ideogram_stroke: '#1F3D7A',
            ideogram_fill5: '#85E094', // 5' upstream
            ideogram_fill3: '#E39F91', // 3' downstream
            minichr_filla: '#a3a3a3',
            minichr_fillb: '#c96',
            minichr_text: 'white',
            box_stroke: colorCentral.foreground_faint_5,
            lst: [], // item region [name, chr, start, stop, plotlen], this is ALL of them not merely in dsp
            lstsf: 0, // scaling factor from bplen to plot len
            lstholder: null, // item list holder table
        };
    } else {
        this.genesetview = null;
    }
};


