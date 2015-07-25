/**
 * bigmap_move_Mu
 * @param event
 */

function bigmap_move_Mu(event)
{
    document.body.removeEventListener('mousemove',bigmap_move_Mm,false);
    document.body.removeEventListener('mouseup',bigmap_move_Mu,false);
}