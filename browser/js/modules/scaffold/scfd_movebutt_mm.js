/**
 * ===BASE===// scaffold // scfd_movebutt_mm.js
 * @param 
 */

function scfd_movebutt_mm(event) {
    var m = gflag.menu.bbj.genome.scaffold.move;
    var tbody = gflag.menu.bbj.genome.scaffold.overview.holder.firstChild;
    if (event.clientY < m.y) {
        if (m.idx == 0) return;
        if (m.y - event.clientY >= 20) {
            tbody.appendChild(tbody.childNodes[m.idx]);
            var lst = [];
            for (var i = m.idx - 1; i < m.total - 1; i++) lst.push(tbody.childNodes[i]);
            for (var i = 0; i < lst.length; i++) tbody.appendChild(lst[i]);
            m.idx--;
            m.y = event.clientY;
        }
    } else if (event.clientY > m.y) {
        if (m.idx == m.total - 1) return;
        if (event.clientY - m.y >= 20) {
            tbody.appendChild(tbody.childNodes[m.idx + 1]);
            var lst = [];
            for (var i = m.idx; i < m.total - 1; i++) lst.push(tbody.childNodes[i]);
            for (var i = 0; i < lst.length; i++) tbody.appendChild(lst[i]);
            m.idx++;
            m.y = event.clientY;
        }
    }
}
