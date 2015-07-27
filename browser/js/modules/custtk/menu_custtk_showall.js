/**
 * ===BASE===// custtk // menu_custtk_showall.js
 * @param 
 */

function menu_custtk_showall() {
// called by "List of all" option in custtk menu
    var bbj = gflag.menu.bbj;
    if (bbj.genome.custtk.names.length == 0) {
        menu_hide();
        return;
    }
    var lst = [];
    for (var i = 0; i < bbj.genome.custtk.names.length; i++) {
        var n = bbj.genome.custtk.names[i];
        var tk = bbj.genome.hmtk[n];
        if (!tk) {
            print2console('this guy has gone missing!? ' + n, 2);
            continue;
        }
        if (tk.mastertk) {
            // this is a member tk
            continue;
        }
        if (tk.public) {
            // from public hub
            continue;
        }
        lst.push(n);
    }
    bbj.showhmtkchoice({lst: lst, delete: true, context: 22});
}

