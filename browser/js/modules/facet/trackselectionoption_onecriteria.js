/**
 * ===BASE===// facet // trackselectionoption_onecriteria.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.trackselectionoption_onecriteria = function (term, idx, ul) {
// one criterion, initial
    var voc = gflag.mdlst[idx];
    var isLeaf = !(term in voc.p2c);
// count tracks annotated to this term
    var tkset = {};
    this.mdgettrack(term, idx, tkset);
    var num = this.tracksetTwonumbers(tkset);
    var li = dom_create('li', ul);
    if (isLeaf) {
        dom_addtext(li, ((term in voc.idx2attr) ? voc.idx2attr[term] : term) + '&nbsp;');
    } else {
        li.idx = idx;
        li.term = term;
        var s = dom_addtext(li, '<span>&#8862;</span> ' + term + '&nbsp;', null, 'clb');
        s.addEventListener('click', toggle32, false);
    }
    if (num[0] == 0) {
        dom_addtext(li, 'n/a', colorCentral.foreground_faint_3);
    } else {
        var d = dom_create('div', li, 'display:inline-block;');
        d.className = 'tscell';
        d.term1 = term;
        d.idx = idx;
        d.addEventListener('click', facet_clickcell, false);
        d.title = 'click to show tracks';
        d.innerHTML =
            ((num[1] == 0) ? '<span>0</span>' : '<span class=r>' + num[1] + '</span>') +
            '<span>/</span>' +
            '<span class=g>' + num[0] + '</span>';
    }
    if (!isLeaf) {
        dom_create('ul', ul).style.display = 'none';
    }
};

