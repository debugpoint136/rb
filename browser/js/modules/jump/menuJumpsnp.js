/**
 * ===BASE===// jump // menuJumpsnp.js
 * @param 
 */

function menuJumpsnp() {
    var ss = menu.relocate.snp.value;
    if (ss.length == 0) {
        print2console('Please enter SNP id.', 2);
        return;
    }
    var bbj = gflag.menu.bbj;
    stripChild(menu.c47.table, 0);
    bbj.ajax('searchtable=' + bbj.genome.snptable + '&dbName=' + bbj.genome.name + '&text=' + ss,
        function (data) {
            bbj.tkitemkwsearch_cb(data);
        });
}


