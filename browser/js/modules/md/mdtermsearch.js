/**
 *
 */

function mdtermsearch() {
    var d = menu.c56;
    if (d.input.value.length == 0) return;
    if (d.input.value.length == 1) {
        print2console('Can\'t search by just one letter', 2);
        return;
    }
    var re = words2mdterm([d.input.value]);
    if (re.length == 0) {
        print2console('No hits', 2);
        return;
    }
    if (d.mdidxlimit != undefined) {
        var lst = [];
        for (var i = 0; i < re.length; i++) {
            if (re[i][1] == d.mdidxlimit) {
                lst.push(re[i]);
            }
        }
        re = lst;
    }
// group terms by vocabulary
    var mdidx2term = [];
    for (var i = 0; i < gflag.mdlst.length; i++) {
        mdidx2term.push([])
    }
    for (var i = 0; i < re.length; i++) {
        mdidx2term[re[i][1]].push(re[i][0]);
    }
    d.table.style.display = 'block';
    stripChild(d.table, 0);
// first show terms from shared voc
    var hasprivate = false;
    for (var i = 1; i < mdidx2term.length; i++) {
        if (mdidx2term[i].length == 0) {
            continue;
        }
        var md = gflag.mdlst[i];
        if (md.sourceurl) {
            var tr = d.table.insertRow(-1);
            var td = tr.insertCell(0);
            td.colSpan = 3;
            td.style.fontSize = '70%';
            td.innerHTML = 'following terms are from this shared vocabulary<br><a href=' + md.sourceurl + ' target=_blank>' + md.sourceurl + '</span>';
            for (var j = 0; j < mdidx2term[i].length; j++) {
                var tr = d.table.insertRow(-1);
                var td = tr.insertCell(0);
                var tid = mdidx2term[i][j];
                var tn = null;
                if (tid in md.idx2attr) {
                    td.innerHTML = 'id: ' + tid;
                }
                td = tr.insertCell(1);
                mdterm_print(td, tid, md);
                if (menu.c56.hit_handler) {
                    td = tr.insertCell(2);
                    dom_addtext(td, 'use &#187;', null, 'clb').onclick = menu.c56.hit_handler([tid, i]);
                }
            }
        } else {
            hasprivate = true;
        }
    }
    if (hasprivate) {
        var tr = d.table.insertRow(-1);
        var td = tr.insertCell(0);
        td.colSpan = 3;
        td.style.fontSize = '70%';
        td.innerHTML = 'following terms are from private vocabularies';
        for (var i = 1; i < mdidx2term.length; i++) {
            if (mdidx2term[i].length == 0) {
                continue;
            }
            var md = gflag.mdlst[i];
            if (!md.sourceurl) {
                for (var j = 0; j < mdidx2term[i].length; j++) {
                    var tr = d.table.insertRow(-1);
                    var td = tr.insertCell(0);
                    var tid = mdidx2term[i][j];
                    var tn = null;
                    if (tid in md.idx2attr) {
                        td.innerHTML = 'id: ' + tid;
                    }
                    td = tr.insertCell(1);
                    mdterm_print(td, tid, md);
                    if (menu.c56.hit_handler) {
                        td = tr.insertCell(2);
                        dom_addtext(td, 'use &#187;', null, 'clb').onclick = menu.c56.hit_handler([tid, i]);
                    }
                }
            }
        }
    }
}

/*** __md__ over ***/