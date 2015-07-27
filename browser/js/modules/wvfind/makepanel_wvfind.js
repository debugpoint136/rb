/**
 * ===BASE===// wvfind // makepanel_wvfind.js
 * @param 
 */

function makepanel_wvfind(p) {
    var d = make_controlpanel(p);
    apps.wvfind = {
        main: d,
        tklst: [],
        goldengenomes: {hg19: 1, mm9: 1},
        tracks: {},
    };
    var ht = make_headertable(d.__contentdiv);
    var d2 = ht._h;
    d2.style.textAlign = '';
    apps.wvfind.gsbutt = dom_addbutt(d2, '', wvfind_showgeneset);
    apps.wvfind.gssays = dom_create('div', d2, 'display:inline;padding:0px 15px;', {t: 'no gene set chosen'});
    dom_addtext(d2, 'Compare with&nbsp;');
    apps.wvfind.querynames = dom_addtext(d2, '');
    apps.wvfind.submitbutt = dom_addbutt(d2, 'Find orthologs', wvfind_apprun);
    /*
     dom_addtext(d2,'&nbsp;&nbsp;View');
     apps.wvfind.view_h=dom_addbutt(d2,'horizontal',wvfind_view_toggle);
     apps.wvfind.view_v=dom_addbutt(d2,'vertical',wvfind_view_toggle);
     apps.wvfind.view_v.disabled=true;
     dom_addtext(d2,'&nbsp;&nbsp;');
     var b=dom_addbutt(d2,'Add track',wvfind_track_genomemenu);
     b.style.display='none';
     apps.wvfind.trackbutt=b;
     */
    var b = dom_addbutt(d2, 'Export', wvfind_export);
    b.style.display = 'none';
    apps.wvfind.textbutt = b;
    var b = dom_addbutt(d2, 'Compare epigenomes', wvfind_2golden);
    b.style.display = 'none';
    apps.wvfind.goldenbutt = b;
    apps.wvfind.error = dom_create('div', ht._c, 'display:none;', {
        c: 'alertmsg',
        t: 'No orthologs found for this gene/region set.'
    });
    var d3 = dom_create('div', ht._c, 'width:750px;height:400px;overflow:scroll;resize:both;');
    apps.wvfind.table = dom_create('table', d3);
}

