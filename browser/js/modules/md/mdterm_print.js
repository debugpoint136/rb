/**
 * @param d - holder
 * @param term - term id or name
 * @param voc - md voc
 */

function mdterm_print(d, term, voc) {

    var d3 = dom_create('div', d);
    d3.className = 'mdt_box';
    if (voc.color) {
        d3.style.borderTop = 'solid 2px ' + voc.color;
    }
    d3.voc = voc;
    d3.innerHTML = term in voc.idx2attr ? voc.idx2attr[term] : term;
    d3.title = term in voc.idx2desc ? voc.idx2desc[term] : term;
    d3.term = term;
    d3.onclick = function (event) {
        mdt_box_click(event.target, term, voc);
    };
}