/**
 * ===BASE===// facet // facet_dimension_show.js
 * @param 
 */

function facet_dimension_show(event) {
    var s = event.target;
    menu_blank();
    var table = dom_create('table', menu.c32, 'margin:10px;border-top:solid 1px #ededed;');
    table.cellPadding = 5;
// root terms from all md objects
    var bbj = apps.hmtk.bbj;
    for (var i = 0; i < gflag.mdlst.length; i++) {
        var v = gflag.mdlst[i];
        for (var t in v.root) {
            // equal to itself?
            if (s.isrow && i == bbj.facet.dim1.mdidx && t == bbj.facet.dim1.term) continue;
            if (!s.isrow && i == bbj.facet.dim2.mdidx && t == bbj.facet.dim2.term) continue;
            if (!s.isrow) {
                // escape dim1 term
                if (i == bbj.facet.dim1.mdidx && t == bbj.facet.dim1.term) continue;
            }
            var tr = table.insertRow(-1);
            var td = tr.insertCell(0);
            dom_addtext(td, t, null, 'mdt_box').onclick = facet_choosedim_closure(bbj, i, t, s.isrow);
            td = tr.insertCell(1);
            td.style.fontSize = '70%';
            td.style.opacity = .7;
            if (v.tag == literal_imd) {
                td.innerHTML = 'internal';
            } else if (v.source) {
                td.innerHTML = 'private<br>' + v.source;
            } else if (v.sourceurl) {
                td.innerHTML = 'shared<br>' + v.sourceurl;
            }
        }
    }
    if (!s.isrow && bbj.facet.dim2.term != null) {
        menu.c4.style.display = 'block';
    }
    menu_show_beneathdom(s.isrow ? 4 : 5, s);
}

