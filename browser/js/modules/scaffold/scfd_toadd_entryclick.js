/**
 * ===BASE===// scaffold // scfd_toadd_entryclick.js
 * @param 
 */

function scfd_toadd_entryclick(event) {
// click an entry and add it to overview table, pending for submission
    var lst = gflag.menu.bbj.genome.scaffold.toadd;
    if (event.target.className == 'header_g') {
        lst.push(event.target.chr);
        event.target.className = 'header_b';
    } else {
        for (var i = 0; i < lst.length; i++) {
            if (lst[i] == event.target.chr) {
                lst.splice(i, 1);
                break;
            }
        }
        event.target.className = 'header_g';
    }
}

