/**
 * __splinter__
 * show splinter tracks in sukn
 */

function __splinter_fly(event)
{
    /* show splinter tracks in sukn
     */
    var bbj=gflag.browser;
    var jlst=[];
    var nativedecor=[];
    var subfambed=null;
    for(var i=0; i<bbj.tklst.length; i++) {
        var t=bbj.tklst[i];
        if(t.ft==FT_bedgraph_n) {
            jlst.push({type:'bedgraph',name:t.name,label:t.label,url:url_genomebedgraph+t.name+'.gz',qtc:t.qtc,mode:mode2str[t.mode]});
        } else if(t.name in browser.genome.decorInfo) {
            nativedecor.push({name:t.name,mode:mode2str[t.mode]});
        } else {
            // is infact subfam bed
            jlst.push({type:'bed',name:t.name,label:t.label,url:url_subfambed+t.name+'.gz',qtc:t.qtc,mode:mode2str[t.mode]});
        }
    }
    if(nativedecor.length>0) {
        jlst.push({type:'native_track',list:nativedecor});
    }
    var t=bbj.getDspStat();
    jlst.push({type:'coordinate_override',coord:t[0]+':'+t[1]+'-'+(t[0]==t[2]?t[3]:bbj.genome.scaffold.len[t[0]])});
    ajaxPost('json\n'+JSON.stringify(jlst),
                function(key){
                    bbj.alethiometer_splinter_link(key,event.target);
                });
}