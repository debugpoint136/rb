/**
 * @param event
 */

function slidingtableMU(event)
{
    event.preventDefault();
    document.body.removeEventListener('mousemove', slidingtableMM, false);
    document.body.removeEventListener('mouseup', slidingtableMU, false);
}