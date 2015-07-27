/**
 * ===BASE===// menu // menuConfig.js
 * @param 
 */

function menuConfig() {
    menu_shutup();
    var m = gflag.menu;
    var bbj = m.bbj;
    if (m.context == 1) {
        // single track from main browser panel
        menu.c53.style.display = 'block';
        menu.c53.checkbox.checked = false;
        var tk = m.tklst[0];
        // bg applies to everyone
        menu.c44.style.display = 'block';
        if (tk.qtc.bg) {
            menu.c44.checkbox.checked = true;
            menu.c44.color.style.display = 'block';
            menu.c44.color.style.backgroundColor = tk.qtc.bg;
        } else {
            menu.c44.checkbox.checked = false;
            menu.c44.color.style.display = 'none';
        }
        config_dispatcher(tk);
    } else if (m.context == 2) {
        /* right click on mcm block for tracks in ghm, confusing as any tracks can be here
         or multi-selection
         */
        menu.c53.checkbox.checked = false;
        if (m.tklst.length == 1) {
            m.context = 1;
            menuConfig();
        } else {
            menu.c44.style.display = 'block'; // tk bg
            menu.c44.checkbox.checked = false;
            menu.c44.color.style.display = 'none';
            var ft = {};
            var den = [];
            var nft = FT_nottk, count = 0; // most abundant tk
            // will only show config table of one ft, so need to prioritize
            for (var i = 0; i < m.tklst.length; i++) {
                var t = m.tklst[i];
                if (t.mode == M_den) {
                    den.push(i);
                } else {
                    if (t.ft in ft) {
                        ft[t.ft].push(i);
                    } else {
                        ft[t.ft] = [i];
                    }
                    var c = ft[t.ft].length;
                    if (c > count) {
                        count = c;
                        nft = t.ft;
                    }
                }
            }
            if (den.length > count) {
                // density mode tk wins
                config_density(m.tklst[den[0]])
            } else {
                if (nft == FT_cat_c || nft == FT_cat_n) {
                    // but do not show cat config as each tk has its own cateInfo
                    menu.c14.style.display = menu.c44.style.display = 'block';
                    menu.c44.checkbox.checked = false;
                    menu.c44.color.style.display = 'none';
                } else {
                    config_dispatcher(m.tklst[ft[nft][0]]);
                }
            }
            menu.c14.unify.style.display = 'table-cell';
        }
    } else {
        fatalError("unknown menu context id");
    }
    placePanel(menu, parseInt(menu.style.left), parseInt(menu.style.top));
}


