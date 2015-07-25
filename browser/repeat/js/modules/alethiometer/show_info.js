/**
 * @param event
 */

function show_info(event)
{
    menu_shutup();
    menu.linkholder.style.display='block';
    var p=absolutePosition(event.target);
    menu_show(0,p[0]-200,40);
}