/**
 * ===BASE===// jump // jumpgene_keyup.js
 * @param 
 */

function jumpgene_keyup(event) {
    if (event.keyCode == 13) {
        menuJump();
        menu2_hide();
        return;
    }
    if (event.keyCode == 27) return;
    menu.relocate.jumplstholder.style.display = 'none';
    var ss = event.target.value;
    if (ss.length <= 1) {
        menu2_hide();
        return;
    }
    var bbj = gflag.menu.bbj;
    bbj.ajax('findgenebypartialname=on&dbName=' + bbj.genome.name + '&query=' + ss +
        '&searchgenetknames=' + bbj.genome.searchgenetknames.join(','),
        function (data) {
            bbj.jumpgene_keyup_cb(data, ss);
        });
}
