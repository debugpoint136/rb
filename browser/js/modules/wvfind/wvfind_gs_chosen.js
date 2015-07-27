/**
 * ===BASE===// wvfind // wvfind_gs_chosen.js
 * @param 
 */

function wvfind_gs_chosen(idx) {
    var e = apps.wvfind.bbj.genome.geneset.lst[idx];
    apps.wvfind.geneset = e;
    stripChild(apps.wvfind.gssays, 0);
    dom_addtkentry(3, apps.wvfind.gssays, false, null, e.name);
//apps.wvfind.gssays.innerHTML=e.name+' ('+e.lst.length+' items)';
}
