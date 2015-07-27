/**
 * ===BASE===// scaffold // scfdoverview_zoomin_Md.js
 * @param 
 */

function scfdoverview_zoomin_Md(event) {
// press down
    if (event.button != 0) return; // only process left click
    event.preventDefault();
    var pos = absolutePosition(event.target);
    indicator.style.display = "block";
    indicator.style.left = event.clientX + document.body.scrollLeft;
    indicator.style.top = pos[1];
    indicator.style.width = 0;
    indicator.style.height = event.target.clientHeight;
    gflag.navigator = {
        bbj: gflag.menu.bbj,
        x: event.clientX + document.body.scrollLeft,
        xcurb: pos[0],
        chr: event.target.chr,
        canvas: event.target,
    };
    document.body.addEventListener("mousemove", scfdoverview_zoomin_Mm, false);
    document.body.addEventListener("mouseup", scfdoverview_zoomin_Mu, false);
}
