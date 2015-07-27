/**
 * ===BASE===// scaffold // scfd_movebutt_md.js
 * @param 
 */

function scfd_movebutt_md(event) {
// must not use scaffold.current to determine idx
    event.preventDefault();
    var chr = event.target.parentNode.parentNode.chr;
    var lst = gflag.menu.bbj.genome.scaffold.overview.holder.firstChild.childNodes;
    for (var i = 0; i < lst.length; i++) {
        if (lst[i].chr == chr) break;
    }
    event.target.className = 'header_g';
    gflag.menu.bbj.genome.scaffold.move = {
        target: event.target,
        idx: i,
        total: lst.length,
        y: event.clientY
    };
    document.body.addEventListener('mousemove', scfd_movebutt_mm, false);
    document.body.addEventListener('mouseup', scfd_movebutt_mu, false);
}
