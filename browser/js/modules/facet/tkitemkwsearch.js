/**
 * ===BASE===// facet // tkitemkwsearch.js
 * @param 
 */

function tkitemkwsearch() {
    var bbj = gflag.menu.bbj;
    var ip = menu.c47.input;
    if (ip.value.length == 0) {
        print2console('Please enter name to search', 2);
        return;
    }
    stripChild(menu.c47.table, 0);
    bbj.ajax('searchtable=' + gflag.menu.tklst[0].name + '&text=' + ip.value + '&dbName=' + bbj.genome.name, function (data) {
        bbj.tkitemkwsearch_cb(data);
    });
}
