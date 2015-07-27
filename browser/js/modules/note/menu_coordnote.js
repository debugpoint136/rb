/**
 * Created by dpuru on 2/27/15.
 */
/*** __note__ ***/

function menu_coordnote(event) {
// right click on main panel ideogram canvas, show option related to coordnote
    if (!menu.stickynote) return;
    menu_shutup();
    var n = menu.stickynote;
    n.style.display = 'block';
    if (event.target.tagName == 'IMG') {
        // clicked on note
        n.firstChild.style.display =
            n.childNodes[1].style.display = 'none';
        n.childNodes[2].style.display = 'block';
        menu_show(0, event.clientX, event.clientY);
        var pos = absolutePosition(event.target);
        placeIndicator3(pos[0], pos[1], event.target.clientWidth, event.target.clientHeight);
        gflag.note = {
            bbj: gflag.browser,
            chrom: event.target.chrom,
            coord: event.target.coord,
            update: true,
        };
    } else {
        n.firstChild.style.display = 'block';
        n.childNodes[1].style.display =
            n.childNodes[2].style.display = 'none';
        menu_show(0, event.clientX, event.clientY);
        var pos = absolutePosition(event.target);
        var x = event.clientX + document.body.scrollLeft;
        placeIndicator3(x, pos[1], 1, event.target.height);
        var bbj = gflag.browser;
        pos = absolutePosition(bbj.hmdiv.parentNode);
        var rr = bbj.sx2rcoord(x - pos[0] - bbj.move.styleLeft);
        if (!rr) return false;
        gflag.note = {
            bbj: (bbj.splinterTag != null ? bbj.trunk : bbj),
            chrom: bbj.regionLst[rr.rid][0],
            coord: rr.coord,
            update: false,
        };
    }
    return false;
}

