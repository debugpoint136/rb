/**
 * a checkbox for each term, no matter child or parent <br>
 * @param term
 * @param mdobj
 * @param idx
 * @param holder
 */

function make_mdtree_recursive(term, mdobj, idx, holder) {
    var li = dom_create('li', holder);
// a checkbox for each term, no matter child or parent
    var cb = dom_create('input', li);
    cb.type = 'checkbox';
    cb.term = term;
    cb.mdidx = idx;
    cb.onchange = mdCheckboxchange;
    mdobj.checkbox[term] = cb;
    if (term in mdobj.p2c) {
        // not leaf
        var s = dom_addtext(li, '<span>&#8862;</span> ' + term, null, 'clb');
        s.onclick = mdshowhide;
        var ul2 = dom_create('ul', holder, 'display:none;');
        for (var cterm in mdobj.p2c[term]) {
            make_mdtree_recursive(cterm, mdobj, idx, ul2);
        }
    } else {
        // is leaf
        dom_addtext(li,
            (term in mdobj.idx2attr ? mdobj.idx2attr[term] : term) +
            (term in mdobj.idx2desc ? '<div style="font-size:70%;opacity:.7;">' + mdobj.idx2desc[term] + '</div>' : '')
        );
    }
}