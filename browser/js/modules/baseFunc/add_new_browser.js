/**
 * ===BASE===// baseFunc // add_new_browser.js
 * @param 
 */

function add_new_browser(param) {
    /* add new browser, in addition to existing *main* one
     FIXME func comes from sukn
     */
// dspstat now shows genome name
    gflag.dspstat_showgenomename = true;
    for (var h in horcrux) {
        var b = horcrux[h];
        if (!b.splinterTag) {
            /* b is trunk
             in case of adding multiple new bbjs from golden, the bbj might be uninitiated
             so need to escape them
             */
            if (b.regionLst.length == 0) continue;
            b.updateDspstat();
        }
    }
    var hh = document.getElementById('additional_genomes_div');
    var border = dom_create('div', hh, 'margin-top:15px;margin-bottom:10px;border-top:solid 1px #a8a8a8;border-bottom:solid 1px white;background-color:#ccc;height:4px;');
    var mholder = dom_create('div', hh);
    var bbj = new Browser();
    bbj.leftColumnWidth = param.leftColumnWidth;
    bbj.hmSpan = param.hmSpan;
    bbj.browser_makeDoms({
        centralholder: mholder,
        mintkheight: 10,
        header: {
            padding: '0px 0px 10px 0px',
            fontsize: 'normal',
            zoomout: [['&#8531;', 0.3], [1, 1], [5, 5]],
            dspstat: {allowupdate: true},
            resolution: true,
            utils: {track: true, apps: true, bbjconfig: true, delete: sukn_bbj_delete},
        },
        navigator: true,
        navigator_ruler: true,
        hmdivbg: 'white',
        ghm_scale: true,
        ghm_ruler: true,
        tkheader: true,
        mcm: true,
        gsselect: true,
        gsv: true,
        gsv_geneplot: true,
        facet: true,
    });
    bbj.hmdiv.style.backgroundColor = 'white';
    if (param.stickynote) {
        bbj.ideogram.canvas.oncontextmenu = menu_coordnote;
    }
    bbj.mcm.holder.attop = true; // tells if holder be placed on top or bottom of mcm
    bbj.applyHmspan2holders();
// TODO make genomeparam configurable
    bbj.loadgenome_initbrowser({
        dbname: param.genome,
        browserparam: param.browserparam,
        genomeparam: {gsm: true, custom_track: true},
    });
}

