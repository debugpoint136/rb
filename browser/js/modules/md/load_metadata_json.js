/**
 * @param raw
 */

function load_metadata_json(raw) {
    var obj = {
        c2p: {},
        p2c: {},
        root: {},
        checkbox: {},
        idx2attr: {},
        idx2desc: {},
        idx2color: {},
    };
    gflag.mdlst.push(obj);
    var idx = gflag.mdlst.length - 1;

    for (var term in raw.vocabulary) {
        parse_metadata_recursive(null, term, raw.vocabulary[term], obj);
        obj.root[term] = 1;
    }
    if (raw.tag) {
        obj.tag = raw.tag;
    }
    if (raw.sourceurl) {
        obj.sourceurl = raw.sourceurl;
    } else {
        // no source url, not a shared md
        if (raw.source) obj.source = raw.source;
        obj.original = raw; // for stringify
    }
    if (raw.terms) {
        for (var t in raw.terms) {
            var v = raw.terms[t];
            if (Array.isArray(v)) {
                if (v.length == 0) {
                    print2console('Empty array for term definition (' + t + ')', 2);
                    v = ['unidentified_' + t];
                }
                obj.idx2attr[t] = v[0];
                if (v[1]) {
                    obj.idx2desc[t] = v[1];
                }
                if (v[2]) {
                    obj.idx2color[t] = v[2];
                }
            }
        }
    }
// for showing in c31
    var d = document.createElement('div');
    d.style.margin = 10;
    obj.main = d;
    var ul = dom_create('ul', d, 'padding:5px 10px;margin:0px;');
    if (obj.color) {
        ul.style.borderTop = 'solid 2px ' + obj.color;
        ul.style.backgroundColor = lightencolor(colorstr2int(obj.color), 0.9);
    }
    obj.mainul = ul;
    for (var rt in obj.root) {
        make_mdtree_recursive(rt, obj, idx, ul);
    }
    return idx;
}