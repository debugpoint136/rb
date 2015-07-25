/**
 * __track_Mmove - show data of the point under the cursor, must tell if this track is from a splinter
 * @param event
 */

function __track_Mmove(event)
{
    /* show data of the point under the cursor
     must tell if this track is from a splinter
     */
    var tkobj=browser.findTrack(event.target.tkname);
    var x=colheader_getlanding(event.clientX);
    if(x==-1) return;
    tkobj.header.style.backgroundColor=colorCentral.hl;
// clear hl of previous column header
    colheader_holder.childNodes[pica.x].style.backgroundColor='transparent';
// highlight current column
    colheader_holder.childNodes[x].style.backgroundColor=colorCentral.hl;
    pica.x=x;
//pica_go((event.clientX>document.body.clientWidth-300)?event.clientX-300:event.clientX, (event.clientY>document.body.clientHeight-200)?event.clientY-200:event.clientY);
    pica_go(event.clientX,event.clientY);
    var v=tkobj.data[col_runtime[x]][useRatioIdx];
    picasays.innerHTML='<table style="margin:5px;white-space:nowrap;"><tr><td colspan=2 style="font-size:16px;color:white;">'+
        htmltext_bigmapcell(v,tkobj.maxv,tkobj.minv)+
        '</td></tr>'+
        '<tr><td class=tph>experiment</td>'+
        '<td style="font-size:12px">'+tkobj.label+'</td></tr>'+
        '<tr><td class=tph>TE subfamily</td>'+
        '<td style="font-size:12px">'+id2subfam[col_runtime[x]].name+'</td></tr>'+
        '<tr><td class=tph>max</td>'+
        '<td style="font-size:12px">'+tkobj.maxv+'</td></tr>'+
        '<tr><td class=tph>min</td>'+
        '<td style="font-size:12px">'+tkobj.minv+'</td></tr>'+
        '</table>';
}