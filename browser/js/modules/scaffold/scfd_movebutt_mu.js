/**
 * ===BASE===// scaffold // scfd_movebutt_mu.js
 * @param 
 */

function scfd_movebutt_mu(event) {
    document.body.removeEventListener('mousemove', scfd_movebutt_mm, false);
    document.body.removeEventListener('mouseup', scfd_movebutt_mu, false);
    gflag.menu.bbj.genome.scaffold.move.target.className = 'header_b';
}
