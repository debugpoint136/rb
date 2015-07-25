/**
 * Clicking on a file handle, show info and options
 * @param event
 */

function filehandle_click(event)
{
    /* clicking on a file handle, show info and options
     */
    var t=event.target;
    while(t.tagName!='TABLE') t=t.parentNode;
    gflag.menu.x=event.clientX;
    gflag.menu.y=event.clientY;
    get_file_info(t.tkname);
}