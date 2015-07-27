/**
 * ===BASE===// scaffold // scfd_cancelconfigure.js
 * @param 
 */

function scfd_cancelconfigure() {
// called by pushing button
    gflag.menu.bbj.genome.scfd_cancelconfigure();
}

/**
 * ===BASE===// scaffold // scfd_cancelconfigure.js
 * @param __Genome.prototype__
 * @param 
 */

Genome.prototype.scfd_cancelconfigure = function () {
// cancel scaffold configure UI and reset everything
    menu.relocate.scfd_foo.style.display = 'block';
    menu.relocate.scfd_bar.style.display = 'none';
    var ov = gflag.menu.bbj.genome.scaffold.overview;
    var tbody = ov.holder.firstChild;
    for (var i = 0; i < ov.trlst.length; i++) {
        var tr = ov.trlst[i];
        tr.style.backgroundColor = 'transparent';
        tbody.appendChild(tr);
        var lst = tr.firstChild.childNodes;
        lst[0].style.display = 'block';
        lst[1].style.display = lst[2].style.display = 'none';
    }
    if (ov.newtr) {
        tbody.appendChild(ov.newtr);
        ov.newtr.style.display = 'none';
    }
};
