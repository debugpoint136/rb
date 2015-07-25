/**
 * @param event
 */

function slidingtableMM(event)
{
    var d = gflag.slidingtable.d;
    d.hscroll.style.left = parseInt(d.hscroll.style.left) + event.clientX - gflag.slidingtable.oldx;
    d.vscroll.style.top = parseInt(d.vscroll.style.top) + event.clientY - gflag.slidingtable.oldy;
    d.scroll.style.left = parseInt(d.scroll.style.left) + event.clientX - gflag.slidingtable.oldx;
    d.scroll.style.top = parseInt(d.scroll.style.top) + event.clientY - gflag.slidingtable.oldy;
    gflag.slidingtable.oldx = event.clientX;
    gflag.slidingtable.oldy = event.clientY;
    /* to help with escaping click event on d
     click callback on d will test gflag.slidingtable.d.moved
     if true, set to false and quit
     else, it is a real click
     */
    d.moved=true;
}