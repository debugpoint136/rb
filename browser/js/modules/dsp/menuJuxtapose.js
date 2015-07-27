/**
 * ===BASE===// dsp // menuJuxtapose.js
 * @param 
 */

function menuJuxtapose() {
    var bbj = gflag.menu.bbj;
    var tk = gflag.menu.tklst[0];
    if (tk.ft != FT_bed_n && tk.ft != FT_bed_c && tk.ft != FT_anno_n && tk.ft != FT_anno_c) {
        print2console('tk ft not supported', 2);
        return;
    }
    var c = 0;
    for (var i = 0; i < tk.data.length; i++) {
        c += tk.data[i].length;
    }
    if (c >= 150) {
        print2console('Cannot run juxtaposition, too many items in the view range. Try zoom in.', 2);
        menu_hide();
        return;
    }
    if (isCustom(tk.ft)) {
        bbj.juxtaposition.type = RM_jux_c;
        bbj.juxtaposition.what = tk.url;
        bbj.juxtaposition.note = 'custom bed track';
    } else {
        bbj.juxtaposition.type = RM_jux_n;
        bbj.juxtaposition.what = tk.name;
        bbj.juxtaposition.note = tk.label;
    }
    bbj.cloak();
    print2console("juxtaposing " + bbj.juxtaposition.note + "...", 0);
    var param = bbj.displayedRegionParam() + "&changeGF=on";
    bbj.ajaxX(param);
    menu_hide();
    var synclst = null;
    if (gflag.syncviewrange) {
        synclst = gflag.syncviewrange.lst;
    }
    if (synclst) {
        var j = bbj.juxtaposition;
        for (var i = 0; i < synclst.length; i++) {
            synclst[i].juxtaposition = {type: j.type, what: j.what, note: j.note};
            synclst[i].ajaxX(param);
        }
    }
}


