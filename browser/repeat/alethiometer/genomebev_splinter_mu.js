/**
 * __splinter__
 */

function genomebev_splinter_mu()
{
    var z=gflag.zoomin;
    z.inuse=false;
    var startcoord=Math.max(0, parseInt((parseInt(indicator.style.left)-z.borderleft)/apps.gg.sf));
    var stopcoord=Math.min(browser.genome.scaffold.len[z.chrom], startcoord+parseInt(parseInt(indicator.style.width)/apps.gg.sf));
    indicator.style.display='none';
    document.body.removeEventListener('mousemove', genomebev_splinter_mm,false);
    document.body.removeEventListener('mouseup', genomebev_splinter_mu,false);

    var chr_holder=apps.gg.view[z.viewkey].bev.chr2canvas[z.chrom].parentNode;

    /* FIXME duplicating code with sukn splintering, in .ajaxX()
     but with custom settings, might stay duplicated
     */
    var tag=Math.random().toString();
    var sdiv=dom_create('div',chr_holder);
    sdiv.style.display='table';
    sdiv.id='splinter_'+tag;
    var d=dom_create('div',sdiv);
    d.style.border='solid 1px '+colorCentral.foreground_faint_3;
    var chip=new Browser();
    chip.hmSpan=800;
    chip.leftColumnWidth=0;
    chip.browser_makeDoms({
            header:{
                fontsize:'normal',
                fontcolor:colorCentral.foreground_faint_7,
                padding:'2px 0px 4px 0px',
                zoomout:[[2,2]],
                resolution:true,
                utils:{
                    print:__splinter_svg,
                    link:__splinter_fly,
                    bbjconfig:true,
                    'delete':__splinter_delete,
                },
            },
            centralholder:d,
            ghm_ruler:true,
            hmdivbg:'transparent'}
    );
    chip.genome=browser.genome;
    chip.runmode_set2default();
    chip.facet=
        chip.cfacet=null;
    chip.applyHmspan2holders();
//chip.ideogram.canvas.splinterTag= chip.rulercanvas.splinterTag=
    chip.splinterTag=tag;
    chip.splinterCoord=null;
//chip.trunk=browser;
    chip.trunk=null;
    browser.splinters[tag]=chip;

    /* tracks */

// add basic decors
    var _tklst = [];
    _tklst.push({name:defaultGeneTrack, ft:FT_anno_n, mode:M_full});
    _tklst.push({name:defaultRepeatEnsembleTrack, ft:FT_cat_n, mode:M_show});
    var vobj=apps.gg.view[gflag.zoomin.viewkey];

    /* always add the subfam track
     beware if subfam name contains slash, it must be replaced with _
     e.g. ALR/Alpha, BSR/Beta
     */
    var si=id2subfam[vobj.subfamid];
    _tklst.push({name:si.cls+si.fam+si.name.replace('/','_'), ft:FT_bed_n, mode:M_full});

    /* in case of type 2, need to show experimental tracks
     */
    if(vobj.type==2) {
        var thisgeoid=vobj.geoid;
        var lku={}; // make a lookup table to tell input/treat of tracks
        chip.ajax_phrase='&rpbr_splinter=on'; // to indicate its special identity
        var gi=id2geo[thisgeoid];
        for(var i=0; i<gi.treatment.length; i++) {
            _tklst.push({name:gi.treatment[i],ft:FT_bedgraph_n, mode:M_show});
            lku[gi.treatment[i]]=true;
        }
        if(gi.input!=null) {
            for(i=0; i<gi.input.length; i++) {
                _tklst.push({name:gi.input[i],ft:FT_bedgraph_n, mode:M_show});
                lku[gi.input[i]]=false;
            }
        }
        for(i=0; i<vobj.tklst.length; i++) {
            gi=id2geo[vobj.tklst[i].geoid];
            for(var j=0; j<gi.treatment.length; j++) {
                _tklst.push({name:gi.treatment[j],ft:FT_bedgraph_n,mode:M_show});
                lku[gi.treatment[j]]=true;
            }
            if(gi.input!=null) {
                for(j=0; j<gi.input.length;j++) {
                    _tklst.push({name:gi.input[j],ft:FT_bedgraph_n,mode:M_show});
                    lku[gi.input[j]]=false;
                }
            }
        }
        vobj.__tkistreatment=lku;
    }
    chip.viewobj=vobj;

    chip.ajax('addtracks=on&dbName='+basedb+
                '&runmode='         +RM_genome+
                '&jump=on&jumppos=' +z.chrom+
                ':'+startcoord+'-'  +stopcoord+trackParam(_tklst),
                function(data){
                    chip.alethiometer_splinter_build(data);
                });
}