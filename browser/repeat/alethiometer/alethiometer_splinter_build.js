/**
 * @param data
 */

Browser.prototype.alethiometer_splinter_build=function(data)
{
    this.jsonDsp(data);
    this.jsonTrackdata(data);
    /* now that track display objects are made, need to update its properties
     - change label
     - change default rendering style
     */
    var gi=id2geo[this.viewobj.geoid];
    for(var i=0; i<this.tklst.length; i++) {
        var tk=this.tklst[i];
        if(tk.ft==FT_bed_n || tk.ft==FT_anno_n) {
            // a bed track
            if(tk.name in browser.genome.decorInfo) {
                /* this is a native bed decor
                 assume it is a gene, need to light up its bedcolor
                 */
                tk.qtc.bedcolor=geneTrackColor;
            } else {
                /* this is a subfam track!!
                 which are not formally registered
                 */
                qtc_paramCopy(defaultQtcStyle.ft1, tk.qtc);
                tk.qtc.isrmsk=true;
                tk.label=id2subfam[this.viewobj.subfamid].name;
            }
            tk.qtc.textcolor=colorCentral.foreground;
            tk.qtc.fontsize='8pt';
        } else if(tk.ft==FT_bedgraph_n) {
            // experimental assay tracks
            tk.qtc.height=40;
            if(this.viewobj.__tkistreatment[tk.name]) {
                // a treatment track
                qtc_paramCopy(qtc_treat_u, tk.qtc);
                tk.label=(gi.input==null?'':'treatment: ')+tk.name;
            } else {
                // then it must be input
                qtc_paramCopy(qtc_input_u, tk.qtc);
                tk.label='input: '+tk.name;
            }
        }
        tk.canvas.splinterTag=this.splinterTag;
        tk.canvas.removeEventListener('mouseout',track_Mout,false);
        tk.canvas.addEventListener('mouseout',pica_hide,false);
    }
    this.drawRuler_browser(false);
    this.drawTrack_browser_all();
    this.drawIdeogram_browser(false);
};
