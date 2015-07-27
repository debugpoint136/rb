/**
 * ===BASE===// svg // get_genome_info.js
 * @param 
 */

function get_genome_info(event) {
// from menu option, menu already shown
    var t = event.target;
    while (t.tagName != 'DIV') t = t.parentNode;
    gflag.menu.bbj.ajax('getgenomeinfo=on&dbName=' + t.genome, function (data) {
        show_genome_info(data);
    });
}
