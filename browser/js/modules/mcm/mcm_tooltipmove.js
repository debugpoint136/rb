/**
 * show pica over mcm track canvas
 * @param event
 */

function mcm_tooltipmove(event) {
// show pica over mcm track canvas
    var bbj = gflag.browser;
    var tk = bbj.findTrack(event.target.tkname, event.target.cotton);
    var pos = absolutePosition(event.target);
// mcm.lst idx
    var mcidx = parseInt((event.clientX + document.body.scrollLeft - pos[0]) / tkAttrColumnWidth);
    var m = tk.attrlst[mcidx];
    if (m == undefined) {
        pica.style.display = 'none';
        return;
    }
    pica.style.display = 'block';
    var voc = gflag.mdlst[bbj.mcm.lst[mcidx][1]];
    var plst = [];
    for (var x in voc.c2p[m]) {
        plst.push(x);
    }
    picasays.innerHTML = (m in voc.idx2attr ? voc.idx2attr[m] : m) +
        (m in voc.idx2desc ? '<div style="color:white;font-size:80%;">' + voc.idx2desc[m] + '</div>' : '') +
        '<div style="margin-top:5px;color:white;font-size:80%;">parent: ' +
        plst.join(', ') + '</div>';
    pica_go(event.clientX, event.clientY);
}