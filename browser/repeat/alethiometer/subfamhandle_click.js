/**
 * subfamhandle_click - clicking on a file handle, show info and options
 * @param event
 */

function subfamhandle_click(event)
{
    /* clicking on a file handle, show info and options
     */
    var t=event.target;
    while(t.tagName!='TABLE') t=t.parentNode;
    menu_shutup();
    menu_show(0, event.clientX, event.clientY);
    var w=menu.infowrapper;
    w.style.display='block';
    w.innerHTML=htmltext_subfaminfo(t.subfamid,false);
}