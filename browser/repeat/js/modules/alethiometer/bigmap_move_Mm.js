/**
 * bigmap_move_Mm
 * @param event
 */

function bigmap_move_Mm(event)
{
    event.preventDefault();
    if(event.clientX!=gflag.move.x) {
        browser.move.styleLeft=
            browser.hmdiv.style.left=
                colheader_holder.style.left=parseInt(browser.hmdiv.style.left)+event.clientX-gflag.move.x;
        gflag.move.x=event.clientX;
    }
    if(event.clientY!=gflag.move.y) {
        browser.hmdiv.style.top=
            browser.mcm.tkholder.style.top=
                browser.hmheaderdiv.style.top=parseInt(browser.hmdiv.style.top)+event.clientY-gflag.move.y;
        gflag.move.y=event.clientY;
    }
}