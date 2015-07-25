/**
 * __view__ lst
 * @param event
 */

function show_viewlst(event)
{
    pane.style.display='block';
    pane.childNodes[2].style.display=
        pane.childNodes[1].style.display=
            pane.childNodes[4].style.display=
                pane.childNodes[3].style.display='none';
    pane.childNodes[5].style.display='block';
    stripChild(pane.says,0);
    placePanel(pane, event.clientX-pane.clientWidth/2,parseInt(pane.style.top));
}