/**
 * bigmap_move_Md
 * @param event
 */

function bigmap_move_Md(event)
{
    if(event.button!=0) return;
    event.preventDefault();
    gflag.move={x:event.clientX,y:event.clientY};
    document.body.addEventListener('mousemove',bigmap_move_Mm,false);
    document.body.addEventListener('mouseup',bigmap_move_Mu,false);
}