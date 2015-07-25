/**
 * clicking on a file handle, show info and options
 * @param event
 */
function geohandle_click(event)
{
    /* clicking on a file handle, show info and options
     */
    var t=event.target;
    while(t.tagName!='TABLE') t=t.parentNode;
    menu_getExperimentInfo(t.geoid, event.clientX, event.clientY);
}
