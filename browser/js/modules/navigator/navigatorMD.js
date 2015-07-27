/**
 * ===BASE===// navigator // navigatorMD.js
 * @param 
 */

function navigatorMD(event) {
    /* both on trunk and spliter
     */
    if (event.button != 0) return; // only process left click
    event.preventDefault();
    var pos = absolutePosition(event.target);
    indicator.style.display = "block";
    indicator.style.left = event.clientX + document.body.scrollLeft;
    indicator.style.top = pos[1];
    indicator.style.width = 1;
    indicator.style.height = event.target.clientHeight;
    gflag.navigator = {
        bbj: gflag.browser,
        canvas: event.target,
        x: event.clientX + document.body.scrollLeft,
        xcurb: pos[0]
    };
    document.body.addEventListener("mousemove", navigatorM, false);
    document.body.addEventListener("mouseup", navigatorMU, false);
}
