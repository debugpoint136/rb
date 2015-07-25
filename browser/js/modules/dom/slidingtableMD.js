/**
 * generic moving panel
 * @param event
 */

function slidingtableMD(event)
{
    /* generic moving panel */
    if(event.button != 0) return;
    var d= event.target;
    while(!d.slidingtable) {d=d.parentNode;}
    event.preventDefault();
    gflag.slidingtable={d:d.slidingtable,oldx:event.clientX,oldy:event.clientY};
    document.body.addEventListener('mousemove', slidingtableMM, false);
    document.body.addEventListener('mouseup', slidingtableMU, false);
}
