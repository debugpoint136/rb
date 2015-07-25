Browser.prototype.bbjparamfillto_x = function (pa) {
    var vr = this.getDspStat();
    if (this.is_gsv()) {
        this.gsv_savelst();
        pa.gsvparam = {list: this.genesetview.savelst, viewrange: vr};
        delete pa.coord_rawstring;
    } else {
        pa.coord_rawstring = vr.join(',');
        var j = this.juxtaposition;
        if (j.type == RM_jux_n || j.type == RM_jux_c) {
            pa.juxtapose_rawstring = j.what;
            if (j.type == RM_jux_c) {
                pa.juxtaposecustom = true;
            }
            delete pa.run_gsv;
        }
    }
};