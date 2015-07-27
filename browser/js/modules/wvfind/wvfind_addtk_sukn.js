/**
 * ===BASE===// wvfind // wvfind_addtk_sukn.js
 * @param 
 */

function wvfind_addtk_sukn(event) {
    event.target.className = 'tkentry_inactive';
    var tk = event.target.tkobj;
    var targetbbj = tk.cotton ? apps.wvfind.bbj.weaver.q[tk.cotton] : apps.wvfind.bbj;
    var gn = tk.cotton ? tk.cotton : apps.wvfind.bbj.genome.name;
    if (gn in apps.wvfind.tracks && tk.name in apps.wvfind.tracks[gn]) {
        return;
    }
    targetbbj.wvfind_addtk(tk, apps.wvfind);
}
