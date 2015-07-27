/**
 * ===BASE===// facet // tkkwsearch.js
 * @param 
 */

function tkkwsearch() {
    /* search all tracks
     cgi does sql query
     */
    var bbj = gflag.menu.bbj;
    var ip = menu.grandadd.kwinput;
    if (ip.value.length == 0) {
        print2console('Please enter keyword to search', 2);
        return;
    }
    if (ip.value.indexOf(',') != -1) {
        print2console('Comma not allowed for keywords', 2);
        return;
    }
    var lst = ip.value.split(' AND ');
    var lst2 = [];
    for (var i = 0; i < lst.length; i++) {
        if (lst[i].length > 0) {
            if (lst[i].search(/\S/) != -1) {
                var b = lst[i].replace(/\s/g, '');
                if (b.length == 1) {
                    print2console('Keyword can\'t be just one character', 2);
                    return;
                }
                lst2.push(lst[i]);
            }
        }
    }
    if (lst2.length == 0) {
        print2console('No valid keyword', 2);
        return;
    }
    for (i = 0; i < lst2.length; i++) {
        lst2[i] = lst[i].toLowerCase();
    }
// list of kws ready

    var hitlst = []; // names

// search for decor by label
    for (var tk in bbj.genome.decorInfo) {
        var s = bbj.genome.decorInfo[tk].label.toLowerCase();
        var allmatch = true;
        for (var i = 0; i < lst2.length; i++) {
            if (s.indexOf(lst2[i]) == -1) {
                allmatch = false;
            }
        }
        if (allmatch) {
            hitlst.push(tk);
        }
    }

// search for md terms
    var mdterms = words2mdterm(lst2); // ele: [term, mdidx]

// search hmtk, both by kw and md
    for (var tkn in bbj.genome.hmtk) {
        var o = bbj.genome.hmtk[tkn];
        // label
        var str = o.label.toLowerCase();
        var allmatch = true;
        for (var i = 0; i < lst2.length; i++) {
            if (str.indexOf(lst2[i]) == -1) {
                allmatch = false;
            }
        }
        if (allmatch) {
            hitlst.push(tkn);
            continue;
        }
        // details
        if (o.details) {
            var allmatch = true;
            for (var i = 0; i < lst2.length; i++) {
                var thismatch = false;
                for (var x in o.details) {
                    var str = o.details[x].toLowerCase();
                    if (str.indexOf(lst2[i]) != -1) {
                        thismatch = true;
                        break;
                    }
                }
                if (!thismatch) {
                    allmatch = false;
                }
            }
            if (allmatch) {
                hitlst.push(tkn);
                continue;
            }
        }
        // geo, only look at 1st kw
        if (o.geolst) {
            var match = false;
            for (var i = 0; i < o.geolst.length; i++) {
                if (o.geolst[i].toLowerCase() == lst2[0]) {
                    hitlst.push(tkn);
                    match = true;
                    break;
                }
            }
            if (match) continue;
        }
        // by md
        if (mdterms.length > 0) {
            for (i = 0; i < mdterms.length; i++) {
                var mdidx = mdterms[i][1];
                var tt = mdterms[i][0];
                if (o.md[mdidx] && (tt in o.md[mdidx])) {
                    hitlst.push(tkn);
                    break;
                }
            }
        }
    }
    if (hitlst.length == 0) {
        print2console('No tracks found', 2);
        return;
    }
    print2console('Found ' + hitlst.length + ' track' + (hitlst.length == 1 ? '' : 's'), 1);
    apps.hmtk.bbj = bbj;
    bbj.showhmtkchoice({lst: hitlst, context: 23});
}


/*** __facet__ for tracks ***/

