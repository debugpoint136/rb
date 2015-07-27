/**
 * ===BASE===// scaffold // scfd_invokeconfigure.js
 * @param 
 */

function scfd_invokeconfigure() {
// invoke scaffold configure UI
    if (gflag.menu.bbj.juxtaposition.type != RM_genome) {
        print2console('Customizing scaffold sequences is only possible under genome mode, please quit juxtaposition/GeneSetView first.', 2);
        return;
    }
    menu.relocate.scfd_foo.style.display = 'none';
    menu.relocate.scfd_bar.style.display = 'block';
    var ov = gflag.menu.bbj.genome.scaffold.overview;
    for (var i = 0; i < ov.holder.firstChild.childNodes.length; i++) {
        // rows containing chromosome canvas contain two cell
        // need to escape ov.newtr which contain 1 cell
        var tr = ov.holder.firstChild.childNodes[i];
        if (tr.childNodes.length == 2) {
            var lst = tr.firstChild.childNodes;
            lst[0].style.display = 'none';
            lst[1].style.display = lst[2].style.display = 'inline';
        }
    }
    if (ov.newtr) {
        ov.newtr.style.display = 'table-row';
        ov.newtr.firstChild.firstChild.style.display = 'block';
        ov.newtr.firstChild.childNodes[1].style.display = 'none';
    }
}
