/**
 * ===BASE===// render // page_makeDoms.js
 * @param 
 */

function page_makeDoms(param) {
    if (gflag.__pageMakeDom_called) return;
    gflag.__pageMakeDom_called = true;

// internal md
    if (getmdidx_internal() == -1) {
        var ft = [
            FT2verbal[FT_bed_c],
            FT2verbal[FT_bedgraph_c],
            FT2verbal[FT_bigwighmtk_c],
            FT2verbal[FT_anno_c],
            FT2verbal[FT_bam_c],
            FT2verbal[FT_lr_c],
            FT2verbal[FT_cat_c],
            FT2verbal[FT_matplot],
            FT2verbal[FT_weaver_c],
            FT2verbal[FT_cm_c],
            FT2verbal[FT_ld_c]
        ];
        var gn = [];
        for (var n in genome) gn.push(n);
        var v = {
            vocabulary: {'Track type': ft,},
            tag: literal_imd,
        };
        v.vocabulary[literal_imd_genome] = gn;
        load_metadata_json(v);
    }

    /* prepare colors */
    var s = colorstr2int(colorCentral.foreground).join(',');
    colorCentral.foreground_faint_1 = 'rgba(' + s + ',0.1)';
    colorCentral.foreground_faint_2 = 'rgba(' + s + ',0.2)';
    colorCentral.foreground_faint_3 = 'rgba(' + s + ',0.3)';
    colorCentral.foreground_faint_5 = 'rgba(' + s + ',0.5)';
    colorCentral.foreground_faint_7 = 'rgba(' + s + ',0.7)';
    s = colorstr2int(colorCentral.background).join(',');
    colorCentral.background_faint_1 = 'rgba(' + s + ',0.1)';
    colorCentral.background_faint_3 = 'rgba(' + s + ',0.3)';
    colorCentral.background_faint_5 = 'rgba(' + s + ',0.5)';
    colorCentral.background_faint_7 = 'rgba(' + s + ',0.7)';
    colorCentral.background_faint_9 = 'rgba(' + s + ',0.9)';
// make copy of long color lst for restoring after user messed up mcm
    var lst = [];
    for (var i = 0; i < colorCentral.longlst.length; i++) {
        lst.push(colorCentral.longlst[i]);
    }
    colorCentral.longlst_bk = lst;

    if (param.highlight_color) {
        colorCentral.hl = param.highlight_color;
    } else {
        colorCentral.hl = colorCentral.foreground_faint_1;
    }

    var f = {};
    f[FT_bed_n] = f[FT_bed_c] = f[FT_bedgraph_c] = f[FT_bedgraph_n] = f[FT_qdecor_n] = f[FT_cat_n] = f[FT_cat_c] = f[FT_bigwighmtk_c] = f[FT_bigwighmtk_n] = f[FT_anno_n] = f[FT_anno_c] = 1;
    ftfilter_ordinary = f;
    f = {};
    f[FT_bedgraph_c] = f[FT_bedgraph_n] = f[FT_qdecor_n] = f[FT_bigwighmtk_c] = f[FT_bigwighmtk_n] = 1;
    ftfilter_numerical = f;


    indicator2 = document.createElement('div');
    document.body.appendChild(indicator2);
    indicator2.style.position = 'absolute';
    indicator2.style.border = '1px dashed #80a6ff';
    indicator2.style.zIndex = 102;
    var t = document.createElement('table');
    t.style.backgroundColor = 'blue';
    t.style.opacity = 0.16;
    t.style.width = t.style.height = '100%';
    td = t.insertRow(0).insertCell(0);
    td.align = 'center';
    td.vAlign = 'middle';
    td.style.color = 'white';
    td.style.fontSize = '30px';
    indicator2.appendChild(t);
    indicator2.veil = t;
    var c1 = document.createElement('canvas');
    c1.width = c1.height = 30;
    c1.style.position = 'absolute';
    c1.style.left = '-30px';
    c1.style.opacity = .5;
    indicator2.appendChild(c1);
    indicator2.leftarrow = c1;
    var c2 = document.createElement('canvas');
    c2.width = c2.height = 30;
    c2.style.position = 'absolute';
    c2.style.right = '-30px';
    c2.style.opacity = .5;
    indicator2.appendChild(c2);
    indicator2.rightarrow = c2;
    {
        var ctx = c1.getContext("2d");
        var lg = ctx.createLinearGradient(0, 0, 0, c1.height);
        lg.addColorStop(0, "#aaf");
        lg.addColorStop(1, "#003");
        ctx.fillStyle = lg;
        ctx.beginPath();
        var ychi = 7;
        var w = c1.width;
        ctx.moveTo(0, ychi);
        ctx.lineTo(w / 2, ychi);
        ctx.lineTo(w / 2, 0);
        ctx.lineTo(w, w / 2);
        ctx.lineTo(w / 2, w);
        ctx.lineTo(w / 2, w - ychi);
        ctx.lineTo(0, w - ychi);
        ctx.lineTo(0, w - ychi);
        ctx.fill();
        ctx = c2.getContext("2d");
        lg = ctx.createLinearGradient(0, 0, 0, c2.height);
        lg.addColorStop(0, "#aaf");
        lg.addColorStop(1, "#003");
        ctx.fillStyle = lg;
        ctx.moveTo(0, w / 2);
        ctx.lineTo(w / 2, 0);
        ctx.lineTo(w / 2, ychi);
        ctx.lineTo(w, ychi);
        ctx.lineTo(w, w - ychi);
        ctx.lineTo(w / 2, w - ychi);
        ctx.lineTo(w / 2, w);
        ctx.lineTo(0, w / 2);
        ctx.fill();
    }

    indicator = document.createElement('div');
    indicator.style.position = 'absolute';
    document.body.appendChild(indicator);
    indicator.style.border = '1px solid #80A6FF';
    indicator.style.zIndex = 104;
    d = document.createElement('div');
    d.style.backgroundColor = 'blue';
    d.style.opacity = 0.1;
    d.style.width = d.style.height = '100%';
    indicator.appendChild(d);

    invisibleBlanket = document.createElement('div');
    document.body.appendChild(invisibleBlanket);
    invisibleBlanket.style.position = 'absolute';
    invisibleBlanket.style.zIndex = 101;

    indicator3 = document.createElement('div');
    document.body.appendChild(indicator3);
    indicator3.style.position = 'absolute';
    indicator3.style.zIndex = 102;
    d = document.createElement('div');
    d.style.position = 'relative';
    indicator3.appendChild(d);
    d2 = dom_create('div', d);
    d2.style.position = 'absolute';
    d2.style.backgroundImage = 'url(' + (gflag.is_cors ? gflag.cors_host : '.') + '/images/border-anim-v.gif)';
    d2.style.backgroundPosition = '0% 0%';
    d2.style.backgroundRepeat = 'no-repeat repeat';
    d2 = dom_create('div', d);
    d2.style.position = 'absolute';
    d2.style.backgroundImage = 'url(' + (gflag.is_cors ? gflag.cors_host : '.') + '/images/border-anim-h.gif)';
    d2.style.backgroundPosition = '0% 0%';
    d2.style.backgroundRepeat = 'repeat no-repeat';
    d2 = dom_create('div', d);
    d2.style.position = 'absolute';
    d2.style.backgroundImage = 'url(' + (gflag.is_cors ? gflag.cors_host : '.') + '/images/border-anim-v.gif)';
    d2.style.backgroundPosition = '100% 0%';
    d2.style.backgroundRepeat = 'no-repeat repeat';
    d2 = dom_create('div', d);
    d2.style.position = 'absolute';
    d2.style.backgroundImage = 'url(' + (gflag.is_cors ? gflag.cors_host : '.') + '/images/border-anim-h.gif)';
    d2.style.backgroundPosition = '0% 100%';
    d2.style.backgroundRepeat = 'repeat no-repeat';

    indicator4 = dom_create('div');
    indicator4.style.position = 'absolute';
    indicator4.style.border = '1px solid ' + colorCentral.foreground;
    indicator4.style.zIndex = 102;

    indicator6 = document.createElement('div');
    indicator6.style.position = 'absolute';
    document.body.appendChild(indicator6);
    indicator6.style.border = '1px solid rgb(255,133,92)';
    indicator6.style.zIndex = 102;
    d = document.createElement('div');
    d.style.backgroundColor = '#f53d00';
    d.style.opacity = 0.1;
    d.style.width = d.style.height = '100%';
    indicator6.appendChild(d);

    indicator7 = document.createElement('div');
    document.body.appendChild(indicator7);
    indicator7.style.position = 'absolute';
    indicator7.style.borderStyle = 'solid';
    indicator7.style.borderWidth = '0px 1px 1px 0px';
    indicator7.style.borderColor = '#ccc';

    pagecloak = document.createElement('div');
    document.body.appendChild(pagecloak);
    pagecloak.style.position = 'absolute';
    pagecloak.style.left = pagecloak.style.top = 0;
    pagecloak.style.backgroundColor = 'rgb(151,154,121)';
    pagecloak.style.opacity = 0.9;
    pagecloak.style.zIndex = 99;

    waitcloak = dom_create('div');
    waitcloak.style.position = 'absolute';
    waitcloak.style.opacity = 0.5;
    waitcloak.style.zIndex = 200;
    dom_create('img', waitcloak).src = (gflag.is_cors ? gflag.cors_host : '') + '/images/loading.gif';

    /* __control__ panels
     panels that belong to the page and shared by all browser objs
     */
    if (param.cp_oneshot) {
        var d = make_controlpanel(param.cp_oneshot);
        d.__htextdiv.style.fontSize = '30px';
        apps.oneshot = {main: d};
        var m = dom_create('div', d.__contentdiv, 'margin:30px 0px;color:white');
        apps.oneshot.message = m;
        m.className = 'alertmsg';
        var h = make_headertable(d.__contentdiv);
        apps.oneshot.header = h._h;
        apps.oneshot.belly = h._c;
    }
    if (param.cp_session) {
        makepanel_session(param.cp_session);
    }
    if (param.cp_bev) {
        var d = make_controlpanel(param.cp_bev);
        apps.bev = {main: d};
    }
    if (param.cp_svg) {
        var d = make_controlpanel(param.cp_svg);
        apps.svg = {main: d};
        var hd = d.__contentdiv;
        hd.style.color = colorCentral.background;
        var p = dom_create('p', hd, 'color:inherit;line-height:1.5;');
        apps.svg.showtklabel = dom_addcheckbox(p, 'show track name', null);
        var bt = dom_addbutt(hd, 'Take screen shot', makesvg_browserpanel_pushbutt, 'margin-right:20px;');
        bt.addEventListener('mousedown', makesvg_clear, false);
        apps.svg.submitbutt = bt;
        apps.svg.urlspan = dom_addtext(hd, '');
        dom_create('p', hd, 'color:inherit').innerHTML = 'This generates an SVG file that can be printed to PDF format with your web browser';
    }
    if (param.cp_gsm) {
        makepanel_gsm(param.cp_gsm);
    }
    if (param.cp_fileupload) {
        makepanel_fileupload(param.cp_fileupload);
    }
    if (param.cp_scatter) {
        makepanel_scatter(param.cp_scatter);
    }
    if (param.cp_hmtk) {
        var d = make_controlpanel(param.cp_hmtk);
        var d2 = d.__contentdiv;
        var d3 = dom_create('div', d2, 'color:white;margin-top:20px;', {t: 'If not all custom tracks can be found here, <span class=clb3 onclick=facet2custtklst(event)>show the entire list</span>.'});
        apps.hmtk = {
            main: d,
            holder: dom_create('div', d2),
            custtk2lst: d3,
        };
        dom_create('div', d2, 'color:white;margin-top:20px;').innerHTML = 'To get additional tracks, <span class=clb3 onclick=facet2pubs()>load public track hubs</span>.';
    }
    if (param.cp_publichub) {
        var d = make_controlpanel(param.cp_publichub);
        apps.publichub = {main: d};
        var d2 = d.__contentdiv;
        apps.publichub.holder = dom_create('div', d2, 'margin:25px 0px 20px 0px;width:800px;');
        dom_create('div', d2, 'color:white;').innerHTML = 'After loading a hub, you can find the tracks in <span class=clb3 onclick=pubs2facet()>track table</span>.<br>' +
        'We welcome you to <a href="http://egg.wustl.edu/+" target=_blank>contact us</a> and publish your data as public track hubs.';
    }
    if (param.cp_custtk) {
        var d = make_controlpanel(param.cp_custtk);
        apps.custtk = {main: d};
    }
    if (param.cp_circlet) {
        var d = make_controlpanel(param.cp_circlet);
        d.style.paddingRight = 10;
        apps.circlet = {main: d};
        apps.circlet.hash = {};
        var d2 = d.__hbutt2.parentNode;
        apps.circlet.handleholder = d2;
        stripChild(d2, 0);
        d2.style.padding = '';
        apps.circlet.holder = dom_create('div', d.__contentdiv);
        gflag.applst.push({name: param.cp_circlet.htext, label: 'Chromosomes in a circle', toggle: toggle11});
    }
    if (param.cp_geneplot) {
        makepanel_geneplot(param.cp_geneplot);
    }
    if (param.cp_validhub) {
        makepanel_vh(param.cp_validhub);
    }
    if (param.cp_super) {
        makepanel_super(param.cp_super);
    }
    if (param.cp_pca) {
        var d = make_controlpanel(param.cp_pca);
        apps.pca = {main: d, width: param.cp_pca.width, height: param.cp_pca.height};
        var d2 = d.__contentdiv;
        var d3 = dom_create('div', d2, 'text-align:center;margin-bottom:10px;');
        var c = dom_addcheckbox(d3, 'Show sample names', param.cp_pca.showhidename_call);
        c.checked = true;
        apps.pca.showname = c;
        var table = dom_create('table', d2);
        var tr = table.insertRow(0);
        // 1-1
        var td = tr.insertCell(0);
        td.vAlign = 'middle';
        td.innerHTML = 'PC2';
        // 1-2
        td = tr.insertCell(-1);
        var c = dom_create('canvas', td);
        c.width = 40;
        c.height = param.cp_pca.height;
        apps.pca.pc2scale = c;
        // 1-3
        td = tr.insertCell(-1);
        var d = dom_create('div', td, 'position:relative;background-color:white;width:' + param.cp_pca.width + 'px;height:' + param.cp_pca.height + 'px;');
        apps.pca.dotholder = d;
        // 2-1
        tr = table.insertRow(1);
        td = tr.insertCell(0);
        // 2-2
        td = tr.insertCell(-1);
        // 2-3
        td = tr.insertCell(-1);
        td.align = 'center';
        c = dom_create('canvas', td, 'display:block;');
        c.width = param.cp_pca.width;
        c.height = 25;
        apps.pca.pc1scale = c;
        dom_addtext(td, 'PC1');
        var d3 = dom_create('table', d2, 'position:absolute;left:0px;top:0px;background-color:rgba(0,0,0,.1);color:rgba(255,255,255,0.5);font-size:300%;');
        td = d3.insertRow(0).insertCell(0);
        td.align = 'center';
        td.vAlign = 'middle';
        td.innerHTML = 'Running...';
        d3.says = td;
        apps.pca.busy = d3;
    }
    if (param.cp_navregion) {
        var d = make_controlpanel(param.cp_navregion);
        apps.navregion = {main: d};
        d.__contentdiv.style.marginTop = 5;
        var d2 = dom_create('div', d.__contentdiv, 'padding:5px;resize:both;height:50px;width:300px;overflow-y:scroll;');
        apps.navregion.holder = dom_create('div', d2);
        gflag.applst.push({name: param.cp_navregion.htext, label: 'Show regions from a list', toggle: toggle30});
    }
    if (param.cp_findortholog) {
        makepanel_wvfind(param.cp_findortholog);
        gflag.applst.push({
            name: param.cp_findortholog.htext,
            label: 'Find regions with highly similar sequence from another genome',
            toggle: toggle31_1
        });
    }


    /* end of __control__ panels */


    /* makemenu */

    menu = dom_create('div', null, 'color:#858585;border-style:solid;border-width:2px 1px;border-color:#4D9799 rgba(133,133,133,0.2) #994D96;background-color:white;position:absolute;z-index:103;box-shadow:2px 2px 2px ' + colorCentral.foreground_faint_3, {c: 'anim_height'});
    menu.id = 'menu';
    menu.onmouseover = menu_mover;
    menu.onmouseout = menu_mout;

    menu.c1 = dom_create('div', menu, 'color:' + colorCentral.foreground_faint_5 + ';font-weight:bold;text-align:center;padding:2px');

    /* some immediate controls, above Config (which is more controls..)
     */
    menu.c45 = dom_create('div', menu, 'padding:10px;line-height:2;');
    var d = dom_create('div', menu.c45);
    menu.c45.combine = dom_addcheckbox(d, 'Combine two strands', cmtk_combine_change);

    var d2 = dom_create('div', d, null, {c: 'menushadowbox'});
    dom_create('div', d2, 'font-size:70%;').innerHTML = 'Strand-specific CG data has been combined.';
    var cb = dom_addcheckbox(d2, 'Combine CHG', cmtk_combinechg_change);
    dom_create('div', d2, 'font-size:70%;width:220px;').innerHTML = 'When combining CHG, CAG/CTG will be combined, but not CCG/CGG. <a href=' + FT2noteurl[FT_cm_c] + '#Combining_strands target=_blank>Learn more.</a>.';
    menu.c45.combine_chg = {div: d2, checkbox: cb};

    menu.c45.combine_notshown = dom_create('div', menu.c45, 'color:' + colorCentral.foreground_faint_3, {t: 'Only one strand available'});

    menu.c45.scale = dom_addcheckbox(menu.c45, 'Scale bar height by read depth', cmtk_scale_change);
    d = dom_create('div', menu.c45);
    menu.c45.filter = {checkbox: dom_addcheckbox(d, 'Filter by read depth', cmtk_filter_change)};
    var d2 = dom_create('div', d, null, {c: 'menushadowbox'});
    menu.c45.filter.div = d2;
    dom_addtext(d2, 'Threshold:&nbsp;&nbsp;');
    menu.c45.filter.input = dom_inputnumber(d2, {value: 5, width: 30, call: cmtk_filter_kd});
    dom_addbutt(d2, 'Apply', cmtk_filter_change);
    menu.c45.table = dom_create('table', menu.c45);
    menu.c45.table.cellSpacing = 5;

    menu.tk2region_showlst = menu_addoption('&#9733;', '', menu_showtk2region, menu);
    dom_addtext(menu.tk2region_showlst);
// the actual region list holder, right next to menu option
    d = dom_create('div', menu);
    d.style.padding = 8;
    d.style.lineHeight = 1.8;

// track mode
    menu.c22 = dom_create('div', menu);
    menu.c22.packbutt = dom_addbutt(menu.c22, 'SHOW IN PACK MODE');
    menu.c22.packbutt.style.margin = '5px 10px';
    var lst = dom_addrowbutt(menu.c22, [
        {text: 'Heatmap', pad: true, call: menuDecorChangemode, attr: {mode: M_trihm}},
        {text: 'Arc', pad: true, call: menuDecorChangemode, attr: {mode: M_arc}},
        {text: 'Full', pad: true, call: menuDecorChangemode, attr: {mode: M_full}},
        {text: 'Thin', pad: true, call: menuDecorChangemode, attr: {mode: M_thin}},
        {text: 'Density', pad: true, call: menuDecorChangemode, attr: {mode: M_den}},
        {text: 'Barplot', pad: true, call: menuDecorChangemode, attr: {mode: M_bar}},
    ], 'margin:10px;color:#858585;').firstChild.firstChild.childNodes;
    menu.c10 = lst[0];
    menu.c11 = lst[1];
    menu.c7 = lst[2];
    menu.c6 = lst[3];
    menu.c8 = lst[4];
    menu.c60 = lst[5];

    menu.c47 = dom_create('div', menu, 'padding:10px;line-height:2;');
    menu.c47.table = dom_create('table', menu.c47);

    /* the Configure */
    menu.c5 = menu_addoption('&#9881;', 'Configure', menuConfig, menu);

    /* show below config when clicking on mcm */
    menu.c64 = menu_addoption('&#10004;', 'Apply matplot', matplot_menucreate, menu);
    menu.c65 = menu_addoption('&#10005;', 'Cancel matplot', matplot_menucancel, menu);

    menu.c12 = menu_addoption('&#9986;', 'Juxtapose', menuJuxtapose, menu);
    menu.c2 = menu_addoption(null, 'Undo juxtaposition', menuTurnoffJuxtapose, menu);
    if (param.cp_circlet)
        menu.c3 = menu_addoption('&#10047;', 'Circlet view', menu_circletview, menu);

    if (param.edit_metadata) { // not in use
        menu.c19 = menu_addoption('&#9998;', 'Edit metadata', menuCusttkmdedit, menu);
    }
    menu.c23 = menu_addoption('&#11021;', 'Flip', menuMcmflip, menu);
    menu.c25 = menu_addoption('&#10010;', 'Add metadata terms', menu_mcm_invokemds, menu);


    if (param.cp_gsm) { // gene set
        menu.c36 = dom_create('div', menu, 'margin:12px;width:230px;');
        dom_create('div', menu.c36, null, {c: 'header_gr ilcell', t: '&#9998; edit', clc: menu_showgeneset_edit});
    }

    menu.c54 = menu_addoption('&#10005;', 'Cancel multiple select', menu_multipleselect_cancel, menu);

    menu.facetm = dom_create('div', menu);
    menu_addoption(null, 'Select all', facet_term_selectall, menu.facetm);
    menu_addoption(null, 'Remove all', facet_term_removeall, menu.facetm);

    menu.c13 = dom_create('div', menu, 'padding:10px;color:#858585;');

    menu.font = dom_create('div', menu, 'margin:10px;white-space:nowrap;');
    var d = dom_create('div', menu.font, 'padding-bottom:7px;');
    dom_addtext(d, 'font family:');
    menu.font.family = dom_addselect(d, stc_fontfamily, [
        {text: 'sans-serif', value: 'sans-serif'}, {text: 'serif', value: 'serif'},
        {text: 'times', value: 'times'}, {text: 'arial', value: 'arial'},
        {text: 'courier', value: 'courier'}, {text: 'monospace', value: 'monospace'}]);
    menu.font.family.style.margin = '0px 10px';
    menu.font.bold = dom_addcheckbox(d, 'bold', stc_fontbold);
    dom_addtext(menu.font, 'size: ');
    dom_addrowbutt(menu.font, [{text: '+', pad: true, call: stc_fontsize, attr: {increase: 1}}, {
        text: '-',
        pad: true,
        call: stc_fontsize
    }], 'margin-right:10px;');
    menu.font.color = dom_addtext(menu.font, '&nbsp;&nbsp;color&nbsp;&nbsp;', 'white', 'coloroval');
    menu.font.color.addEventListener('click', stc_textcolor_initiator, false);

// TODO integrate into menu.c50
    menu.bed = dom_create('div', menu, 'margin:10px;');
    menu.bed.color = dom_addtext(menu.bed, '&nbsp;&nbsp;item color&nbsp;&nbsp;', 'white', 'coloroval');
    menu.bed.color.addEventListener('click', stc_bedcolor_initiator, false);

    menu.lr = dom_create('div', menu, 'margin:20px 10px 10px 10px;white-space:nowrap;');
    var d = dom_create('div', menu.lr, 'margin-bottom:20px;');
    menu.lr.autoscale = dom_addcheckbox(d, 'automatic score threshold', stc_longrange_autoscale);
// positive
    var d = dom_create('div', menu.lr);
    d.className = 'titlebox';
    var d2 = dom_create('div', d, 'margin:10px 0px 20px 0px;color:' + colorCentral.foreground_faint_3);
    dom_addtext(d2, '0', colorCentral.foreground_faint_5);
    menu.lr.pcolor = dom_create('canvas', d2, 'margin:0px 5px');
    menu.lr.pcolor.width = 80;
    menu.lr.pcolor.height = 15;
    menu.lr.pcolor.addEventListener('click', stc_longrange_pcolor_initiator, false);
    menu.lr.pcscoresays = dom_addtext(d2);
// color threshold
    d3 = dom_addtext(d2);
    menu.lr.pcscore = dom_inputnumber(d3, {call: stc_longrange_pcolorscore_KU});
    dom_addbutt(d3, 'set', stc_longrange_pcolorscore);
// filter threshold
    var d3 = dom_create('div', d2, 'margin-top:5px;');
    dom_addtext(d3, 'filter threshold ', '#858585');
    menu.lr.pfscore = dom_inputnumber(d3, {call: stc_longrange_pfilterscore_KU});
    dom_addbutt(d3, 'set', stc_longrange_pfilterscore);
    dom_create('div', d, 'background-color:white;').innerHTML = 'Positive score';
// negative
    d = dom_create('div', menu.lr);
    d.className = 'titlebox';
    d2 = dom_create('div', d, 'margin:10px 0px 20px 0px;color:' + colorCentral.foreground_faint_3);
    dom_addtext(d2, '0', colorCentral.foreground_faint_5);
    menu.lr.ncolor = dom_create('canvas', d2, 'margin:0px 5px;');
    menu.lr.ncolor.width = 80;
    menu.lr.ncolor.height = 15;
    menu.lr.ncolor.addEventListener('click', stc_longrange_ncolor_initiator, false);
    menu.lr.ncscoresays = dom_addtext(d2);
// color threshold
    d3 = dom_addtext(d2);
    menu.lr.ncscore = dom_inputnumber(d3, {call: stc_longrange_ncolorscore_KU});
    dom_addbutt(d3, 'set', stc_longrange_ncolorscore);
// filter threshold
    d3 = dom_create('div', d2, 'margin-top:5px;');
    dom_addtext(d3, 'filter threshold ', '#858585');
    menu.lr.nfscore = dom_inputnumber(d3, {call: stc_longrange_nfilterscore_KU});
    dom_addbutt(d3, 'set', stc_longrange_nfilterscore);
    dom_create('div', d, 'background-color:white;').innerHTML = 'Negative score';

    menu.bam = dom_create('div', menu, 'margin:10px;');
    menu.bam.f = dom_addtext(menu.bam, '&nbsp;forward&nbsp;', 'white', 'coloroval');
    menu.bam.f.addEventListener('click', stc_forwardcolor_initiator, false);
    dom_addtext(menu.bam, '&nbsp;');
    menu.bam.r = dom_addtext(menu.bam, '&nbsp;reverse&nbsp;', 'white', 'coloroval');
    menu.bam.r.addEventListener('click', stc_reversecolor_initiator, false);
    dom_addtext(menu.bam, '&nbsp;');
    menu.bam.m = dom_addtext(menu.bam, '&nbsp;mismatch&nbsp;', 'black', 'coloroval');
    menu.bam.m.addEventListener('click', stc_mismatchcolor_initiator, false);

    menu.c48 = dom_create('div', menu, 'padding:15px;border-top:solid 1px ' + colorCentral.foreground_faint_1);
    menu.c49 = dom_create('div', menu, 'padding:10px;border-top:solid 1px ' + colorCentral.foreground_faint_1);
    menu.c49.color = dom_create('span', menu.c49, 'display:block;margin:10px 20px;padding:3px 20px;');
    menu.c49.color.className = 'coloroval';
    menu.c49.color.innerHTML = 'track color';
    menu.c49.color.addEventListener('click', ldtk_color_initiator, false);
    var tt = dom_create('table', menu.c49);
    tt.cellSpacing = 5;
    var tr = tt.insertRow(0);
    tr.insertCell(0).innerHTML = 'tick size';
    var td = tr.insertCell(1);
    dom_addbutt(td, '&nbsp;+&nbsp;', ldtk_ticksize).change = 1;
    dom_addbutt(td, '&nbsp;-&nbsp;', ldtk_ticksize).change = -1;
    tr = tt.insertRow(1);
    tr.insertCell(0).innerHTML = 'link line height';
    var td = tr.insertCell(1);
    dom_addbutt(td, '&nbsp;+&nbsp;', ldtk_topheight).change = 10;
    dom_addbutt(td, '&nbsp;-&nbsp;', ldtk_topheight).change = -10;


    menu.c50 = dom_create('div', menu);
    var d = dom_create('div', menu.c50, 'margin:15px;white-space:nowrap;');
    var s = dom_addtext(d, '', null, 'coloroval');
    menu.c50.color1 = s;
    s.addEventListener('click', qtc_color1_initiator, false);
    s.style.padding = '2px 10px';
    s.style.marginRight = 20;
    s = dom_addtext(d, '', null, 'coloroval');
    menu.c50.color1_1 = s;
    s.style.padding = '2px 10px';
    s.addEventListener('click', qtc_color1_1_initiator, false);
    menu.c50.row2 = dom_create('div', menu.c50, 'margin:15px;white-space:nowrap;padding-top:10px;border-top:dashed 2px ' + colorCentral.foreground_faint_2);
    s = dom_addtext(menu.c50.row2, '', null, 'coloroval');
    menu.c50.color2 = s;
    s.style.padding = '2px 10px';
    s.addEventListener('click', qtc_color2_initiator, false);
    s.style.marginRight = 20;
    s = dom_addtext(menu.c50.row2, '', null, 'coloroval');
    menu.c50.color2_1 = s;
    s.style.padding = '2px 10px';
    s.addEventListener('click', qtc_color2_1_initiator, false);
// feel free to add more color cells

    menu.c51 = dom_create('div', menu, 'white-space:nowrap;padding:10px;border-top:solid 1px ' + colorCentral.foreground_faint_1);
    menu.c51.sharescale = dom_create('div', menu.c51, 'margin:5px 5px 15px 5px;padding:5px;background-color:rgba(255,204,51,.5);font-size:70%;text-align:center;', {t: 'This track shares Y scale with other tracks.'});
    dom_addtext(menu.c51, 'Y-axis scale&nbsp;');
    menu.c51.select = dom_addselect(menu.c51, toggle26, [
        {text: 'Automatic', value: scale_auto, selected: true},
        {text: 'Fixed', value: scale_fix},
        {text: 'Percentile', value: scale_percentile}
    ]);
// fixd scale
    var d = dom_create('div', menu.c51, 'display:none;', {c: 'menushadowbox'});
    menu.c51.fix = d;
    dom_addtext(d, 'min:&nbsp;');
    d.min = dom_inputnumber(d, {width: 50, value: 0, call: qtc_setfixscale_ku});
    dom_addtext(d, '&nbsp;&nbsp;max:&nbsp;');
    d.max = dom_inputnumber(d, {width: 50, value: 10, call: qtc_setfixscale_ku});
    dom_addbutt(d, 'apply', qtc_setfixscale);
// percentile threshold
    var d = dom_create('div', menu.c51, 'display:none;', {c: 'menushadowbox'});
    menu.c51.percentile = d;
    d.says = dom_addtext(d, '');
    dom_addrowbutt(d, [
        {text: '&#10010;', pad: true, call: qtc_percentile, attr: {change: 5}},
        {text: '&#9473;', pad: true, call: qtc_percentile, attr: {change: -5}},
        {text: '+', pad: true, call: qtc_percentile, attr: {change: 1}},
        {text: '-', pad: true, call: qtc_percentile, attr: {change: -1}},
    ], 'margin-left:10px;');

    menu.c59 = dom_create('div', menu, 'padding:10px;border-top:solid 1px ' + colorCentral.foreground_faint_1);
    dom_addtext(menu.c59, 'Summary method&nbsp;');
    menu.c59.select = dom_addselect(menu.c59, menu_qtksummary_select,
        [{value: summeth_mean, text: 'Average'},
            {value: summeth_max, text: 'Max'},
            {value: summeth_min, text: 'Min'},
            {value: summeth_sum, text: 'Total'}]);
    menu.c59.select.style.marginRight = 15;
    dom_addtext(menu.c59, '<a href=https://plus.google.com/117328025606874451908/posts/5Y7j6fB3Td3 target=_blank>&nbsp;?&nbsp;</a>');

    menu.c52 = dom_create('div', menu, 'padding:10px;border-top:solid 1px ' + colorCentral.foreground_faint_1);
    dom_addtext(menu.c52, 'Logarithm&nbsp;');
    menu.c52.select = dom_addselect(menu.c52, menu_log_select,
        [{value: log_no, text: 'No'},
            {value: log_2, text: 'log2'},
            {value: log_e, text: 'ln'},
            {value: log_10, text: 'log10'}]);

    menu.c14 = dom_create('div', menu, 'padding:10px;white-space:nowrap;border-top:solid 1px ' + colorCentral.foreground_faint_1);
    dom_addtext(menu.c14, 'Height&nbsp;&nbsp;');
    var t = dom_addrowbutt(menu.c14, [
        {text: '&#10010;', pad: true, call: menu_tkh_change, attr: {changetype: 1, amount: 5}},
        {text: '&#9473;', pad: true, call: menu_tkh_change, attr: {changetype: 1, amount: -5}},
        {text: '+', pad: true, call: menu_tkh_change, attr: {changetype: 1, amount: 1}},
        {text: '-', pad: true, call: menu_tkh_change, attr: {changetype: 1, amount: -1}},
        {text: 'Unify', call: menu_tkh_change, attr: {changetype: 2}},]);
    menu.c14.unify = t.firstChild.firstChild.childNodes[4];
    menu.c14.unify.style.backgroundColor = colorCentral.magenta7;
    menu.c14.unify.style.color = 'white';

    menu.c46 = dom_create('div', menu, 'padding:10px;border-top:solid 1px ' + colorCentral.foreground_faint_1);
    menu.c46.checkbox = dom_addcheckbox(menu.c46, 'Smooth window&nbsp;&nbsp;&nbsp;', menu_smoothwindow_checkbox);
    dom_addtext(menu.c46, '<a href=http://washugb.blogspot.com/2013/10/v26-3-of-3-smoothing-curves.html target=_blank>&nbsp;?&nbsp;</a>');
    var d = dom_create('div', menu.c46, 'display:none;', {c: 'menushadowbox'});
    menu.c46.div = d;
    menu.c46.says = dom_addtext(d);
    dom_addrowbutt(d, [{text: '&#10010;', pad: true, call: menu_smoothwindow_change, attr: {change: 2}},
            {text: '&#9473;', pad: true, call: menu_smoothwindow_change, attr: {change: -2}}],
        'margin-left:10px;');

    menu.c29 = dom_create('div', menu, 'padding:10px;border-top:solid 1px ' + colorCentral.foreground_faint_1);
    menu.c29.checkbox = dom_addcheckbox(menu.c29, 'Bar chart background&nbsp;&nbsp;&nbsp;', menu_barplotbg_change);
    dom_addtext(menu.c29, '<a href=http://wiki.wubrowse.org/Datahub#barplot_bg target=_blank>&nbsp;?&nbsp;</a>');
    menu.c29.color = dom_create('div', menu.c29, 'display:none;cursor:default;', {
        c: 'menushadowbox',
        clc: tk_barplotbg_initiator,
        t: 'choose color'
    });

    menu.c44 = dom_create('div', menu, 'padding:10px;border-top:solid 1px ' + colorCentral.foreground_faint_1);
    menu.c44.checkbox = dom_addcheckbox(menu.c44, 'Track background', menu_tkbg_change);
    menu.c44.color = dom_create('div', menu.c44, 'display:none;cursor:default;background-color:#e0e0e0;', {
        c: 'menushadowbox',
        clc: tk_bgcolor_initiator,
        t: 'choose color'
    });

    if (param.menu_curvenoarea) {
        menu.c66 = dom_create('div', menu, 'padding:10px;border-top:solid 1px ' + colorCentral.foreground_faint_1);
        menu.c66.checkbox = dom_addcheckbox(menu.c66, 'Curve only', menu_tkcurveonly_change);
    }


    menu.c53 = dom_create('div', menu, 'padding:10px;border-top:solid 1px ' + colorCentral.foreground_faint_1);
    menu.c53.checkbox = dom_addcheckbox(menu.c53, 'Apply to all tracks', toggle15);

    menu.c16 = menu_addoption('&#8505;', 'Information', menuGetonetrackdetails, menu);

    /* menu - select tk to add, small panel in menu */
    var d = dom_create('div', menu);
    menu.facettklstdiv = d;
    var d2 = dom_create('div', d, 'margin:10px');
    var d3 = dom_create('div', d2, 'overflow-y:scroll;resize:vertical;');
    var table = dom_create('table', d3);
    menu.facettklsttable = table;
    d2 = dom_create('div', d, 'margin:10px');
    menu.facettklstdiv.buttholder = d2;
    var d3 = dom_create('div', d2, 'display:inline-block;width:150px');
    var d4 = dom_create('div', d3);
    d4.className = 'bigsubmit';
    d.submit = d4;
    d4.count = 0;
    // d4.addEventListener('click',facet_tklst_addSelected,false); // dpuru : 07/08/2015 - changing this to repeat specific
    d4.addEventListener('click',facet_tklst_addSelected_repeat,false); // dpuru : added this
    d4.style.width = 120;
    dom_addbutt(d2, 'Select all', facet_tklst_toggleall).tofill = true;
    dom_addbutt(d2, 'Deselect all', facet_tklst_toggleall).tofill = false;
    menu.facetremovebutt = dom_addbutt(d2, 'remove all', facet_tklst_removeall);

    menu.c18 = dom_create('div', menu);
    menu.c18.style.padding = 8;
    var c = dom_create('canvas', menu.c18);
    c.width = 400;
    c.height = 40;
    menu.c18_canvas = c;
    c.onmousedown = c18_md;
    c.onmousemove = c18_m_pica;
    c.onmouseout = pica_hide;

    menu.relocate = dom_create('div', menu);
// div1
    menu.relocate.div1 = dom_create('div', menu.relocate);
    var tt = dom_create('table', menu.relocate.div1);
    tt.cellSpacing = 10;
    var tr = tt.insertRow(0);
    menu.relocate.coord = dom_inputtext(tr.insertCell(0), {ph: 'coordinate', size: 16, call: menuJump_keyup});
    menu.relocate.gene = dom_inputtext(tr.insertCell(-1), {ph: 'gene name', size: 12, call: jumpgene_keyup});
    dom_addbutt(tr.insertCell(-1), '&nbsp;Go&nbsp;', menuJump);
    dom_addbutt(tr.insertCell(-1), 'Clear', jump_clearinput);
    tr = tt.insertRow(1);
    menu.relocate.snptr = tr;
    tr.insertCell(0);
    menu.relocate.snp = dom_inputtext(tr.insertCell(-1), {ph: 'rs75669958', size: 12, call: jumpsnp_keyup});
    var td = tr.insertCell(-1);
    td.colSpan = 2;
    dom_addbutt(td, '&nbsp;Find SNP&nbsp;', menuJumpsnp);

    tt = dom_create('table', menu.relocate.div1);
    menu.relocate.jumplstholder = tt;
    tt.cellSpacing = 0;
    tt.cellPadding = 2;
    tt.style.fontSize = '12px';
    tt.style.color = '#545454';
    menu.c24 = menu_addoption(null, 'Zoom into a chromosome', toggle6, menu.relocate.div1);
    menu.c43 = menu_addoption(null, 'Show linkage group', toggle25, menu.relocate.div1);
// div2, list of chromosomes
    menu.relocate.div2 = dom_create('div', menu.relocate);
    d = dom_create('div', menu.relocate.div2);
    d.style.backgroundColor = '#ededed';
    var d2 = dom_create('div', d);
    d2.style.color = '#006699';
    d2.style.textAlign = 'center';
    menu.relocate.scfd_foo = d2;
//dom_addtext(d2,'go back','black','header_gr').addEventListener('click',toggle6,false);
    dom_addtext(d2, 'Select a location from one of the chromosomes').style.margin = '0px 20px';
    dom_addbutt(d2, 'Customize', scfd_invokeconfigure);
    d2 = dom_create('div', menu.relocate.div2);
    menu.relocate.scfd_bar = d2;
    d2.style.color = '#858585';
    d2.style.textAlign = 'center';
    dom_addtext(d2, 'drag ');
    dom_addtext(d2, 'chr', null, 'header_b');
    dom_addtext(d2, ' to rearrange &nbsp;&nbsp;');
    dom_addbutt(d2, 'Update', scfd_updateconfigure);
    dom_addbutt(d2, 'Cancel', scfd_cancelconfigure);
// div3, linkage group
    menu.relocate.div3 = dom_create('div', menu.relocate, 'display:none;padding:10px 20px');

    menu.scfd_holder = dom_create('div', menu.relocate.div2);
    menu.scfd_holder.style.margin = 10;

    menu.decorcatalog = dom_create('div', menu, 'color:inherit');

    menu.grandadd = dom_create('div', menu);
    d2 = dom_create('div', menu.grandadd);
    var d3 = dom_create('div', d2, 'padding:10px 18px;cursor:default;background-color:rgba(77,151,153,.2);color:' + colorCentral.foreground);
    menu.grandadd.says = d3;
    d3.className = 'opaque7';
    d3.addEventListener('click', toggle1_1, false);
    var d3 = dom_create('div', d2, 'padding:20px;');
    menu.grandadd.kwinput = dom_inputtext(d3, {size: 13, call: tkkwsearch_ku, ph: 'track name'});
    dom_addbutt(d3, 'Find', tkkwsearch);
    var s = dom_addtext(d3, '&nbsp;?&nbsp;');
    s.addEventListener('mouseover', kwsearch_tipover, false);
    s.addEventListener('mouseout', pica_hide, false);
    menu.grandadd.pubh = menu_addoption(null, '<span style="font-size:140%">P</span>UBLIC track hubs', toggle8_1, d2);
    menu_addoption(null, '<span style="font-size:140%">A</span>NNOTATION tracks', toggle13, d2);
    var d4 = menu_addoption(null, '<span style="font-size:140%">C</span>USTOM tracks ', toggle28, d2);
    menu.grandadd.custtkcount = dom_addtext(d4.firstChild, '');
    menu.grandadd.cust = d4;

    menu.c35 = dom_create('div', menu);
    d2 = dom_create('div', menu.c35, 'border:solid 1px ' + colorCentral.foreground_faint_1 + ';margin:15px;');
    var d3 = dom_create('div', d2, 'padding:10px 18px;cursor:default;background-color:' + colorCentral.foreground_faint_1 + ';color:' + colorCentral.foreground);
    menu.c35.says = d3;
    d3.className = 'opaque5';
    d3.addEventListener('click', toggle1_1, false);
    var d4 = dom_create('div', d2);
    menu.c35.opt = d4;
    menu_addoption(null, 'List of all', menu_custtk_showall, d4);
    var d4 = menu_addoption('&#10010;', 'Add new tracks', toggle7_1, d2);

    /* FIXME circlet plot will hold multiple lr track
     each track will have its own color set
     need to specify which track is being configured
     */
    menu.c26 = dom_create('div', menu);
    menu.c26.style.padding = 8;
    menu.c26.innerHTML = 'Graph size <button type=button change=15 onclick=hengeview_changeradius(event)>&#10010;</button> \
<button type=button change=-15 onclick=hengeview_changeradius(event)>&#9473;</button>\
<div style="height:7px;"></div>\
<label for=hengeview_z_1>Show scale?</label> <input id=hengeview_z_1 type=checkbox onchange=hengeview_showhidescale(event)>';

    menu.c28 = dom_create('div', menu);
    menu.c28.style.padding = 8;
    menu.c28.innerHTML = '<button type=button turnon=1 onclick=hengeview_regiontoggleall(event)>show all</button>\
<button type=button turnon=0 onclick=hengeview_regiontoggleall(event)>hide all</button>\
<table class=container id=hengeview_chrholder style="margin:5px;"><tbody></tbody></table>';

    menu.c27 = dom_create('div', menu);
    menu.c27.style.padding = 8;
    menu.c27.style.borderTop = 'solid 1px #ededed';
    menu.c27.innerHTML = '<label for=hengeview_z_2>Show cytoband?</label> <input id=hengeview_z_2 type=checkbox onchange=hengeview_togglecytoband(event)>\
<div style="height:7px;"></div>\
Chromosome bar size <button type=button change=1 onclick=hengeview_changechrbarsize(event)>&#10010;</button> \
<button type=button change=-1 onclick=hengeview_changechrbarsize(event)>&#9473;</button>';


    menu.apppanel = dom_create('div', menu);
    var d = dom_create('div', menu.apppanel, 'padding:18px;');
    menu.apppanel.kwinput = dom_inputtext(d, {size: 13, ph: 'app name', call: findApp});
    dom_addbutt(d, 'Find', findApp_butt).style.marginRight = 10;
    dom_addtext(d, 'All apps', 'gray', 'clb').onclick = showallapp;
    var d2 = dom_create('div', menu.apppanel, 'width:250px;padding:0px 0px 10px 10px;');
    menu.apppanel.sc_holder = d2;

    if (param.cp_custtk) {
        apps.custtk.shortcut = [];
        var fn = function () {
            custtk_shortcut(FT_bedgraph_c);
        };
        apps.custtk.shortcut[FT_bedgraph_c] = dom_create('div', d2, 'display:none;', {
            c: 'header_b ilcell',
            t: 'bedGraph',
            clc: fn
        });
        gflag.applst.push({name: 'BedGraph track', toggle: fn});
        fn = function () {
            custtk_shortcut(FT_bigwighmtk_c);
        };
        apps.custtk.shortcut[FT_bigwighmtk_c] = dom_create('div', d2, 'display:none;', {
            c: 'header_b ilcell',
            t: 'bigWig',
            clc: fn
        });
        gflag.applst.push({name: 'BigWig track', toggle: fn});
        fn = function () {
            custtk_shortcut(FT_cat_c);
        };
        apps.custtk.shortcut[FT_cat_c] = dom_create('div', d2, 'display:none;', {
            c: 'header_b ilcell',
            t: 'categorical',
            clc: fn
        });
        gflag.applst.push({name: 'Categorical track', toggle: fn});
        fn = function () {
            custtk_shortcut(FT_anno_c);
        };
        apps.custtk.shortcut[FT_anno_c] = dom_create('div', d2, 'display:none;', {
            c: 'header_b ilcell',
            t: 'hammock',
            clc: fn
        });
        gflag.applst.push({name: 'Hammock track', toggle: fn});
        fn = function () {
            custtk_shortcut(FT_weaver_c);
        };
        apps.custtk.shortcut[FT_weaver_c] = dom_create('div', d2, 'display:none;', {
            c: 'header_b ilcell',
            t: 'genomealign',
            clc: fn
        });
        gflag.applst.push({name: 'Genomealign track', toggle: fn});
        fn = function () {
            custtk_shortcut(FT_lr_c);
        };
        apps.custtk.shortcut[FT_lr_c] = dom_create('div', d2, 'display:none;', {
            c: 'header_b ilcell',
            t: 'interaction',
            clc: fn
        });
        gflag.applst.push({name: 'Long-range interaction', toggle: fn});
        fn = function () {
            custtk_shortcut(FT_bed_c);
        };
        apps.custtk.shortcut[FT_bed_c] = dom_create('div', d2, 'display:none;', {
            c: 'header_b ilcell',
            t: 'bed',
            clc: fn
        });
        gflag.applst.push({name: 'Bed track', toggle: fn});
        fn = function () {
            custtk_shortcut(FT_bam_c);
        };
        apps.custtk.shortcut[FT_bam_c] = dom_create('div', d2, 'display:none;', {
            c: 'header_b ilcell',
            t: 'BAM',
            clc: fn
        });
        gflag.applst.push({name: 'BAM track', toggle: fn});
        fn = function () {
            custtk_shortcut(FT_huburl);
        };
        apps.custtk.shortcut[FT_huburl] = dom_create('div', d2, 'display:none;', {
            c: 'header_b ilcell',
            t: 'datahub',
            clc: fn
        });
        gflag.applst.push({name: 'Datahub', toggle: fn});
        /*
         fn=function(){custtk_shortcut(FT_catmat);};
         apps.custtk.shortcut[FT_]=dom_create('div',d2,'display:none;',{c:'header_b ilcell',t:'',clc:fn});
         gflag.applst.push({name:'custom track: ',toggle:fn});
         */
    }

    d = dom_create('div', menu.apppanel);
    if (param.cp_fileupload) {
        apps.fud.shortcut = menu_appoption(d, '&#11014;', 'File upload', 'Upload data from text files', toggle27);
        gflag.applst.push({name: 'File upload', label: 'Upload data from text files', toggle: toggle27});
    }
    if (param.cp_gsm) {
        apps.gsm.shortcut = menu_appoption(d, '&#10034;', 'Gene & region set', 'Create and manage sets of genes/regions', toggle10);
        gflag.applst.push({name: 'Gene set', label: 'Create and manage sets of genes/regions', toggle: toggle10});
    }
    if (param.cp_bev) {
        apps.bev.shortcut = menu_appoption(d, '&#10038;', 'Genome snapshot', 'View track at whole-genome scale', toggle18);
        gflag.applst.push({name: 'Genome snapshot', label: 'View track at whole-genome scale', toggle: toggle18});
    }
    if (param.cp_scatter) {
        apps.scp.shortcut = menu_appoption(d, '&#8759;', 'Scatter plot', 'Compare two tracks over a gene set', toggle19);
        gflag.applst.push({
            name: 'Scatter plot',
            label: 'Compare two numerical tracks over a gene set',
            toggle: toggle19
        });
    }
    if (param.app_splinter) {
        menu_appoption(d, '&#9707;', 'Split panel', 'Create a secondary browser panel', function () {
            gflag.menu.bbj.splinter_issuetrigger('nocoord_fromapp');
            menu_hide();
        });
        gflag.applst.push({
            name: 'Split panel', label: 'Create a secondary browser panel', toggle: function () {
                gflag.menu.bbj.splinter_issuetrigger('nocoord_fromapp');
                menu_hide();
            }
        });
    }
    if (param.cp_session) {
        apps.session.shortcut = menu_appoption(d, '&#10084;', 'Session', 'Save and share contents', toggle12);
        gflag.applst.push({name: 'Session', label: 'Save and share contents', toggle: toggle12});
    }
    if (param.cp_svg) {
        apps.svg.shortcut = menu_appoption(d, '&#9113;', 'Screenshot', 'Make publication-quality image', svgpanelshow);
        gflag.applst.push({name: 'Screen shot', label: 'Make publication-quality image', toggle: svgpanelshow});
    }
    if (param.cp_geneplot) {
        apps.gplot.shortcut = dom_create('div', d2, 'display:none;', {
            c: 'header_b ilcell',
            t: 'gene plot',
            clc: toggle4
        });
        gflag.applst.push({name: 'Gene plot', label: 'Data distribution within a gene set', toggle: toggle4});
    }

    var d = dom_create('div', menu, 'margin:15px;');
    menu.apppanel.getseq = {main: d};
    dom_addtext(d, 'Paste coordinates here<br><span style="font-size:70%;opacity:.6;">One coordinate per line</span><br>');
    var ip = dom_create('textarea', d);
    ip.cols = 30;
    menu.apppanel.getseq.input = ip;
    var d2 = dom_create('div', d, 'margin-top:10px;');
    menu.apppanel.getseq.butt = dom_addbutt(d2, 'Submit', app_get_sequence);
    dom_addbutt(d2, 'Clear', function () {
        menu.apppanel.getseq.input.value = '';
    });
    menu.apppanel.getseq.shortcut = dom_create('div', menu.apppanel.sc_holder, 'display:none;', {
        c: 'header_b ilcell',
        t: 'get sequence',
        clc: toggle33
    });
    gflag.applst.push({name: 'Get sequence', toggle: toggle33});

    if (param.app_bbjconfig) {
        var d = dom_create('div', menu);
        menu.bbjconfig = d;
        var d2 = dom_create('div', d, 'margin:20px;white-space:nowrap;');

        var table = dom_create('table', d2, 'color:#858585;');
        var tr = table.insertRow(0);
        var td = tr.insertCell(0);
        td.style.paddingRight = 10;
        dom_create('div', td, 'font-size:90%;color:inherit;').innerHTML = 'Browser panel width';
        var d3 = dom_addrowbutt(td, [
            {text: '&#10010;', pad: true, call: menu_changehmspan, attr: {which: 1}},
            {text: '&#9473;', pad: true, call: menu_changehmspan, attr: {which: 2}},
            {text: '+', pad: true, call: menu_changehmspan, attr: {which: 3}},
            {text: '-', pad: true, call: menu_changehmspan, attr: {which: 4}},
            {text: 'Set', call: menu_hmspan_set},
        ], 'color:inherit;');
        d.setbutt = d3.firstChild.firstChild.childNodes[4];
        d.setbutt.style.backgroundColor = colorCentral.magenta7;
        d.setbutt.style.color = 'white';

        var nwcall = null; // callback to for change name width
        if (param.app_bbjconfig.changetknw) {
            nwcall = param.app_bbjconfig.changetknw.call;
            if (!nwcall) {
                print2console('No callback provided for app_bbjconfig.changetknw', 2);
            }
        }
        if (nwcall) {
            td = tr.insertCell(1);
            d.leftwidthdiv = td;
            dom_create('div', td, 'font-size:90%;').innerHTML = 'Track name width';
            dom_addrowbutt(td, [
                {text: '&#10010;', pad: true, call: nwcall, attr: {which: 1}},
                {text: '&#9473;', pad: true, call: nwcall, attr: {which: 2}},
                {text: '+', pad: true, call: nwcall, attr: {which: 3}},
                {text: '-', pad: true, call: nwcall, attr: {which: 4}},
            ]);
        }

        d2 = dom_create('div', d, 'margin:20px;');
        d.allow_packhide_tkdata = dom_addcheckbox(d2, 'Allow "pack and hide" for track items', toggle14);
        dom_create('div', d2, 'display:none;margin:10px;').innerHTML = 'Please use with caution! <a href=http://washugb.blogspot.com/2014/03/v33-2-of-2-hide-undesirable-items-from.html target=_blank>Learn more.</a>';
    }

    var d = dom_create('div', menu, 'margin:10px;width:220px;color:#858585;');
    menu.zoomoutalert = d;
    d.count = dom_addtext(d);
    dom_addtext(d, ' items have been loaded.');
    var d2 = dom_create('div', d, null, {c: 'button_warning', clc: risky_zoomout});
    dom_addtext(d2, 'Zoom out ');
    d.fold = dom_addtext(d2);
    d.fold.style.fontSize = '200%';
    dom_addtext(d2, ' fold');
    dom_addtext(d, 'Zoom out to such scale might take long time to load new items and might even halt your web browser.');
    dom_create('div', d, 'margin:10px;', {c: 'header_gr', t: 'Cancel', clc: menu_hide});

    var d = dom_create('div', menu, 'margin:10px;width:220px;color:#858585;');
    menu.changemodealert = d;
    dom_addtext(d, 'By changing mode, ');
    d.count = dom_addtext(d);
    dom_addtext(d, ' items will be loaded and rendered, which could slow down your system.');
    var d2 = dom_create('div', d, null, {c: 'button_warning', clc: risky_changemode});
    dom_addtext(d2, 'Change mode to ');
    d.mode = dom_addtext(d2);
    dom_create('div', d, 'margin:10px;', {c: 'header_gr', t: 'Cancel', clc: menu_hide});


    if (param.stickynote) {
        menu.stickynote = dom_create('div', menu);
        // c1
        menu_addoption('&#10010;', 'New note', coordnote_showinputpanel, menu.stickynote).doedit = false;
        // c2
        var x = dom_create('div', menu.stickynote);
        x.style.margin = 10;
        dom_addtext(x, 'At ');
        menu.stickynote.says = dom_addtext(x);
        dom_addtext(x, ':');
        var t = dom_create('textarea', x);
        t.style.display = 'block';
        t.rows = 5;
        t.cols = 20;
        menu.stickynote.textarea = t;
        dom_addbutt(x, 'Submit', coordnote_submit);
        // c3
        x = dom_create('div', menu.stickynote);
        menu_addoption('&#9998;', 'Edit', coordnote_showinputpanel, x).doedit = true;
        menu_addoption('&#10005;', 'Delete', coordnote_delete, x);
    }

    var t = dom_create('table', menu, 'margin:8px;color:' + colorCentral.foreground_faint_7 + ';white-space:nowrap;');
    menu.genemodellstholder = t;
    t.style.cellSpacing = 0;
    t.style.cellPadding = 2;

    /*
     menu.c9=menu_addoption('&#10140;','Change color',show_mcmColorConfig,menu);
     var d=dom_create('table',menu); // next sibling of c9
     d.style.margin=10;
     d.cellSpacing=10;
     */

    if (param.cp_circlet) {
        menu.c15 = menu_addoption(null, 'Graph', menu_hengeview_configrender, menu);
        menu.c17 = menu_addoption(null, 'Chromosomes & regions', menu_hengeview_configregions, menu);
        menu.c21 = menu_addoption(null, 'Zoom out 1 fold', menu_hengeview_zoomout, menu);
        apps.circlet.shortcut = dom_create('div', menu.apppanel.sc_holder, 'display:none;', {
            t: 'circlet view',
            c: 'header_b ilcell',
            clc: toggle11
        });
    }

// TODO
//menu.c30=menu_addoption('&#8767;','View as line plot',menu_2matplot,menu);

    var d = dom_create('div', menu, 'padding:10px;cursor:default;white-space:nowrap;opacity:.5;' +
    'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABZJREFUeNpi2r9//38gYGAEESAAEGAAasgJOgzOKCoAAAAASUVORK5CYII=)');
    menu.c55 = d;
    d.setAttribute('holderid', 'menu');
    d.addEventListener('mousedown', cpmoveMD, false);
    d.says = dom_addtext(d, null);

    menu.c31 = dom_create('div', menu);

    menu.c57 = menu_addoption(null, 'Search for terms', toggle34, menu);
    gflag.applst.push({name: 'Metadata term finder', label: 'Search for metadata terms by keyword', toggle: toggle34});
    menu.c57.shortcut = dom_create('div', menu.apppanel.sc_holder, 'display:none;', {
        c: 'header_b ilcell',
        t: 'find metadata terms',
        clc: toggle34
    });

    if (param.cp_navregion) {
        apps.navregion.shortcut = dom_create('div', menu.apppanel.sc_holder, 'display:none;', {
            c: 'header_b ilcell',
            t: 'navigate regions',
            clc: toggle30
        });
    }
    if (param.cp_findortholog) {
        apps.wvfind.shortcut = dom_create('div', menu.apppanel.sc_holder, 'display:none;', {
            c: 'header_b ilcell',
            t: 'find ortholog',
            clc: toggle31_1
        });
    }
    if (param.cp_validhub) {
        // the last shortcut
        apps.vh.shortcut = dom_create('div', menu.apppanel.sc_holder, 'display:none;', {
            c: 'header_b ilcell',
            t: 'validate hub & refresh cache',
            clc: toggle29
        });
        gflag.applst.push({name: 'Validate datahub', label: 'Validate datahub and refresh cache', toggle: toggle29});
    }

    menu.c32 = dom_create('div', menu);
    menu.c33 = menu_addoption(null, ' ', get_genome_info, menu);
    if (param.addnewgenome) {
        menu.c34 = menu_addoption(null, 'Add new genome <span style="font-size:60%">EXPERIMENTAL</span>', add_new_genome, menu);
    }

    var d = dom_create('div', menu, 'margin:10px;');
    menu.c56 = d;
    d.input = dom_inputtext(d, {size: 12, call: mdtermsearch_ku, ph: 'enter keyword'});
    dom_addbutt(d, 'Search', mdtermsearch);
    var d2 = dom_create('div', d, 'max-height:' + (parseInt(maxHeight_menu) - 100) + 'px;overflow-y:scroll;');
    d.table = dom_create('table', d2, 'margin-top:10px;');

    if (param.cp_gsm) {
        // send gene set to ...
        dom_create('div', menu.c36, null, {t: 'gene set view', c: 'header_b ilcell', clc: menu_gs2gsv});
        if (param.cp_navregion) {
            dom_create('div', menu.c36, null, {c: 'header_b ilcell', t: 'navigate', clc: menu_gs2navregion});
        }
        if (param.cp_scatter) {
            dom_create('div', menu.c36, null, {c: 'header_b ilcell', t: 'scatter plot', clc: menu_gs2scp});
        }
        if (param.cp_geneplot) {
            dom_create('div', menu.c36, null, {c: 'header_b ilcell', t: 'gene plot', clc: menu_gs2gplot});
        }
        menu.c36a = dom_create('div', menu.c36, null, {c: 'header_b ilcell', t: 'find orthologs', clc: menu_gs2wvfind});
        if (param.cp_super) {
            dom_create('div', menu.c36, null, {c: 'header_b ilcell', t: 'call super enhancer', clc: menu_gs2super});
        }
        if (param.cp_proteinview) {
            dom_create('div', menu.c36, null, {c: 'header_b ilcell', t: 'protein view', clc: menu_gs2protein});
        }
    }


// this should be at the bottom of the menu
    menu.c4 = menu_addoption('&#10005;', 'Remove', menuRemove, menu);
    menu.c4.firstChild.style.color = 'red';

    menu.c58 = menu_addoption('&#8634;', 'Refresh cache', menu_refreshcache, menu);

    if (param.cp_bev) {
        // bev panel config
        d = dom_create('div', menu, 'padding:10px');
        menu.c40 = d;
        dom_addtext(d, 'panel width: ');
        menu.c40.says = dom_addtext(d, '');
        dom_addtext(d, '&nbsp;pixels&nbsp;&nbsp;');
        var s = dom_addselect(d, bev_setchrmaxwidth, [
            {text: 'change', value: -1, selected: true},
            {text: '600 px', value: 600}, {text: '800 px', value: 800}, {
                text: '1000 px',
                value: 1000
            }, {text: '1200 px', value: 1200}, {text: '1400 px', value: 1400}, {
                text: '1600 px',
                value: 1600
            }, {text: '1800 px', value: 1800}, {text: '2000 px', value: 2000},
        ]);
        dom_create('br', d);
        dom_addtext(d, 'Set plot width of longest chromosome to selected value.<br>Width of other chromosomes will scale accordingly.<br>This determines track data resolution.', '#858585');
        dom_create('br', d);
        dom_create('br', d);
        dom_addtext(d, 'panel height ');
        dom_addbutt(d, '&#10010;', bev_changepanelheight).increase = true;
        dom_addbutt(d, '&#9473;', bev_changepanelheight).increase = false;
        dom_create('br', d);
        dom_create('br', d);
        dom_addtext(d, 'chromosome bar height ');
        dom_addbutt(d, ' + ', bev_changechrheight).increase = true;
        dom_addbutt(d, ' - ', bev_changechrheight).increase = false;
    }

    menu.c62 = menu_addoption('&#8645', '&nbsp;', weaver_flip, menu);
//menu.c63=menu_addoption('?','&nbsp;',weaver_queryjumpui,menu);
    menu.c61 = dom_create('div', menu, 'border-top:1px solid ' + colorCentral.foreground_faint_1);
    dom_create('div', menu.c61, 'display:inline-block;margin:10px 15px;padding:3px 5px;border:1px solid #858585;border-radius:5px;', {c: 'opaque5'});

    /* makemenu ends */


    bubble = dom_create('table', null, 'position:absolute;z-index:103;');
    bubble.cellSpacing = bubble.cellPadding = 0;
    bubble.onmouseover = bubbleMover;
    bubble.onmouseout = bubbleMout;
    var tr = bubble.insertRow(0);
    var td = tr.insertCell(0);
    var c = dom_create('canvas', td);
    c.width = c.height = 15;
    c.style.marginLeft = 4;
    {
        var ctx = c.getContext("2d");
        ctx.fillStyle = "#850063";
        ctx.beginPath();
        ctx.moveTo(0, 15);
        ctx.lineTo(8, 0);
        ctx.lineTo(15, 15);
        ctx.fill();
    }
    tr = bubble.insertRow(-1);
    td = tr.insertCell(0);
    td.className = 'bubbleCls';
    bubble.says = dom_create('div', td, 'color:white;font-size:12px;', {c: 'anim_height'});
    bubble.sayajax = dom_create('div', td, 'color:white;margin:10px;font-size:12px;', {c: 'anim_height'});


// pica is on top of menu
    pica = dom_create('div', document.body, 'position:fixed;border:1px solid white;z-index:103;');
    var d = dom_create('div', pica, 'position:relative;');
    dom_create('div', d, 'position:absolute;left:0px;top:0px;background-color:rgba(0,53,82,.8);width:100%;height:100%;');
    picasays = dom_create('div', d, 'position:relative;color:#e0e0e0;padding:3px;');


    menu.style.display =
        pica.style.display =
            bubble.style.display =
                indicator.style.display =
                    indicator2.style.display =
                        indicator3.style.display =
                            indicator4.style.display =
                                indicator6.style.display =
                                    indicator7.style.display =
                                        pagecloak.style.display =
                                            waitcloak.style.display =
                                                invisibleBlanket.style.display = 'none';


    palette = dom_create('div');
    palette.style.display = 'none';
    palette.style.position = 'fixed';
    palette.style.zIndex = 104;
    palette.addEventListener('mouseover', paletteMover, false);
    palette.addEventListener('mouseout', paletteMout, false);
    palette.innerHTML = '<div style="position:relative;width:l70px;height:100px;">\
<div style="position:absolute;left:0px;top:15px;background-color:black;opacity:0.7;width:170px;height:150px;border-top-left-radius:5px;border-top-right-radius:5px;-moz-border-radius-topleft:5px;-moz-border-radius-topright:5px;border-bottom:solid 1px #404040;"></div>\
<div style="position:absolute;left:0px;top:166px;background-color:black;opacity:0.6;width:170px;height:60px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;-moz-border-radius-bottomleft:5px;-moz-border-radius-bottomright:5px;"></div>\
<table style="position:absolute;left:0px;top:15px;width:170px;height:150px;"><tr><td align=center valign=middle style="width:270px:">\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#ff0000;">red</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#008000;">green</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#0000ff;;">blue</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#ffff00;color:#858585;">yellow</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#800000;">maroon</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#808000;">olive</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#ffa500;">orange</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#008080;">teal</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#ff00ff;">fuchsia</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#6a5acd;;">slateblue</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#4b0082;;">indigo</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#a52a2a;">brown</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#DC143C;">crimson</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#8A2BE2;;">bluevelvet</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#696969;">dimgray</div>\
</td></tr></table>\
<div style="position:absolute;left:20px;top:172px;">\
<div style="position:relative;width:110px;">\
<canvas id=palettegrove width=100 height=20 style="position:absolute;left:13px;top:18px;" onclick=palettegrove_click(event)></canvas>\
<canvas id=paletteslider width=26 height=26 style="position:absolute;left:50px;top:0px;cursor:pointer;" onmousedown=palettesliderMD(event)></canvas>\
</div>\
</div>\
</div>';
    palette.grove = document.getElementById('palettegrove');
    palette.slider = document.getElementById('paletteslider');
    /*
     var c = document.getElementById("palettepointer");
     var ctx = c.getContext("2d");
     ctx.fillStyle = "black";
     ctx.beginPath();
     ctx.moveTo(0, 15);
     ctx.lineTo(18,0);
     ctx.lineTo(35,15);
     ctx.fill();
     */
    var c = document.getElementById('paletteslider');
    ctx = c.getContext("2d");
    lg = ctx.createLinearGradient(0, 0, 0, 30);
    lg.addColorStop(0, "#c3c3c3");
    lg.addColorStop(1, "#707070");
    ctx.fillStyle = lg;
    ctx.moveTo(0, 0);
    ctx.lineTo(26, 0);
    ctx.lineTo(26, 13);
    ctx.lineTo(13, 23);
    ctx.lineTo(0, 13);
    ctx.lineTo(0, 0);
    ctx.fill();

    menu2 = document.createElement('div');
    document.body.appendChild(menu2);
    menu2.style.position = 'absolute';
    menu2.style.backgroundColor = '#ededed';
    menu2.style.zIndex = 104;
    menu2.addEventListener('mouseover', menu2_mover, false);
    menu2.addEventListener('mouseout', menu2_mout, false);

    glasspane = dom_create('canvas', null, 'position:absolute;z-index:101;display:none;');
    glasspane.ctx = glasspane.getContext('2d');
    smear1 = dom_create('canvas', null, 'position:absolute;z-index:101;display:none;');
    smear1.ctx = smear1.getContext('2d');
    smear2 = dom_create('canvas', null, 'position:absolute;z-index:101;display:none;');
    smear2.ctx = smear2.getContext('2d');

    alertbox = dom_create('div', document.body, 'position:fixed;top:0px;padding:5px 13px;z-index:101;cursor:default;display:none;');
    alertbox.innerHTML = 0;
    alertbox.messages = [];
    alertbox.addEventListener('click', alertbox_click, false);
    alertbox.title = 'Click to see messages';
}


