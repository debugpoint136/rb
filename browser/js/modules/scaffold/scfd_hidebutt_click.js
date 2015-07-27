/**
 * ===BASE===// scaffold // scfd_hidebutt_click.js
 * @param 
 */

function scfd_hidebutt_click(event) {
    var tr = event.target.parentNode.parentNode;
    tr.style.backgroundColor = tr.style.backgroundColor == 'transparent' ? '#858585' : 'transparent';
}
