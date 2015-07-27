/*** __cloak__ ***/
function invisible_shield(dom) {
    var pos = absolutePosition(dom);
    if (pos[0] + pos[1] < 0) return;
// means div2 is visible
    invisibleBlanket.style.display = 'block';
    invisibleBlanket.style.left = pos[0];
    invisibleBlanket.style.top = pos[1];
    invisibleBlanket.style.width = dom.clientWidth;
    invisibleBlanket.style.height = dom.clientHeight;
}
