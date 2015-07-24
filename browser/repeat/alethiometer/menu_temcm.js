/**
 * menu_temcm - right click on a subfam
 * @param event
 */

function menu_temcm(event)
{
// right click on a subfam
    menu_shutup();
    menu.c201.style.display=
        menu.c203.style.display='block';
    menu_show(0, event.clientX, event.clientY);
    var x= colheader_getlanding(event.clientX);
    gflag.menu.subfamid=col_runtime[x];
    document.getElementById('cmo3_says').innerHTML=id2subfam[gflag.menu.subfamid].name;
    var c= colheader_holder.childNodes[x];
    var pos=absolutePosition(c);
    placeIndicator3(pos[0],pos[1],c.width,c.height);
    return false;
}