/**
 * called by clicking menu option
 * @param event
 */

function scatterplot_dotclick_2(event)
{
// called by clicking menu option
    var t=apps.scp.data[event.target.idx];
    menu_shutup();
    var m=menu.c32;
    stripChild(m,0);
    menu_addoption(null,'Highlight '+id2subfam[t.subfamid].name+' in main panel',scatterplot_clickmenu_2,menu.c32);
    m.subfamid=t.subfamid;
    m.style.display='block';
    menu_show(0,event.clientX,event.clientY);
}