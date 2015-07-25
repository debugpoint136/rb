/**
 * clicking on a tab
 * @param event
 */

function tab_click(event)
{
// clicking on a tab
    var w=event.target.which;
    var t=apps.gg.view[event.target.key].tabs;
    t.info[0].disabled=w==1;
    t.cons[0].disabled=w==2;
    t.bev[0].disabled=w==3;
    t.info[1].style.display=w==1?'block':'none';
    t.cons[1].style.display=w==2?'block':'none';
    t.bev[1].style.display=w==3?'block':'none';
}