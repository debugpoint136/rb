/**
 *
 */

function subfamtrackparam(sid)
{
    var lst2=[];
    var lst=apps.gg.chrlst;
    for(var i=0; i<lst.length; i++) {
        lst2.push(lst[i]);
        lst2.push(browser.genome.scaffold.len[lst[i]]);
    }
    var s=id2subfam[sid];
    return '&rpbrDbname='+infodb+'&dbName='+basedb+'&rpbr_class='+s.cls+'&rpbr_family='+s.fam+'&rpbr_subfam='+s.name.replace('/','_')+'&chrlst='+lst2.join(',');
}