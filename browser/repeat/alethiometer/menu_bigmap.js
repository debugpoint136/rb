/**
 * menu_bigmap - right click on bigmap, show wiggle data for the track/subfam combination
 * @param event
 */

function menu_bigmap(event)
{
    /* right click on bigmap, show wiggle data for the track/subfam combination
     */
    var tkobj=browser.findTrack(event.target.tkname);
    var geoid=tkobj.geoid;
// the subfam
    var x= colheader_getlanding(event.clientX);
    var subfamid=col_runtime[x];
    menu_shutup();
    menu.c1.style.display='block';
    menu.c1.innerHTML='<table style="margin-left:15px;white-space:nowrap;">'+
        '<tr><td class=tph>experiment</td><td>'+id2geo[geoid].label+'</td></tr>'+
        '<tr><td class=tph>TE subfamily</td><td>'+id2subfam[subfamid].name+'</td></tr>'+
        '<tr><td class=tph>genome copy #</td><td>'+id2subfam[subfamid].copycount+'</td></tr>'+
        '<tr><td class=tph>has consensus?</td><td>'+
        (id2subfam[subfamid].consensuslen==0?'no':'yes')+
        '</td></tr></table>';
    menu.c200.style.display='block';

    gflag.menu.subfamid=subfamid;
    gflag.menu.geoid=geoid;
    gflag.menu.pointdata=tkobj.data[subfamid];

// highlight
    var pos1=absolutePosition(tkobj.header);
    var pos2=absolutePosition(colheader_holder.childNodes[x]);
    indicator7.style.display='block';
    indicator7.style.left=pos1[0];
    indicator7.style.top=pos2[1];
    indicator7.style.width=pos2[0]-pos1[0]+cellwidth;
    indicator7.style.height=pos1[1]-pos2[1]+cellheight;

    menu_show(0,event.clientX,event.clientY);
    return false;
}