/**
 * ===BASE===// wvfind // wvfind_track_genomemenu.js
 * @param 
 */

function wvfind_track_genomemenu(event) {
    menu_blank();
    menu_addoption(null, 'Add ' + apps.wvfind.bbj.genome.name + ' track', wvfind_choosetk_closure(apps.wvfind.bbj.genome.name), menu.c32);
    for (var i = 0; i < apps.wvfind.queries.length; i++) {
        var n = apps.wvfind.queries[i][0];
        menu_addoption(null, 'Add ' + n + ' track', wvfind_choosetk_closure(n), menu.c32);
    }
    menu_show_beneathdom(0, event.target);
}
