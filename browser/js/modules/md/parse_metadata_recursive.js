/**
 * @param pterm - parent term, null for root
 * @param cterm - child term, must not be null
 * @param voc - vocabulary obj at the level of cterm, may be null
 * @param obj - ele in genome.mdlst
 */

function parse_metadata_recursive(pterm, cterm, voc, obj) {

    if (pterm != null) {
        // c2p
        if (cterm == pterm) {
            var msg = 'Metadata term "' + cterm + '" is removed as it cannot be both parent and child';
            print2console(msg, 2);
            alertbox_addmsg({text: msg});
            return;
        }
        if (cterm in obj.c2p) {
            obj.c2p[cterm][pterm] = 1;
        } else {
            var x = {};
            x[pterm] = 1;
            obj.c2p[cterm] = x;
        }
        // p2c
        if (pterm in obj.p2c) {
            obj.p2c[pterm][cterm] = 1;
        } else {
            var x = {};
            x[cterm] = 1;
            obj.p2c[pterm] = x;
        }
    }
    if (voc == null) return;
    if (Array.isArray(voc)) {
        // voc is list of leaf terms
        for (var i = 0; i < voc.length; i++) {
            if (voc[i] == cterm) {
                var msg = 'Metadata term "' + voc[i] + '" is removed as it cannot be both parent and attribute';
                print2console(msg, 2);
                alertbox_addmsg({text: msg});
                continue;
            }
            parse_metadata_recursive(cterm, voc[i], null, obj);
        }
    } else {
        // voc is still an hash
        for (var cc in voc) {
            parse_metadata_recursive(cterm, cc, voc[cc], obj);
        }
    }
}