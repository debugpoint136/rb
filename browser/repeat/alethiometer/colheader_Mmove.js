/**
 * colheader_Mmove -  mouse over a column header, highlight and show tooltip
 * @param event
 */

function colheader_Mmove(event)
{
// mouse over a column header, highlight and show tooltip
// dont do it when zoomin in
    if(gflag.zoomin.inuse) return;
    var x=colheader_getlanding(event.clientX);
    if(x==-1) return;
    colheader_holder.childNodes[pica.x].style.backgroundColor='transparent';
// highlight current column
    colheader_holder.childNodes[x].style.backgroundColor=colorCentral.hl;
    pica.x=x;
    picasays.innerHTML=htmltext_subfaminfo(col_runtime[x],true);
    pica_go(event.clientX-10,absolutePosition(colheader_holder)[1]+colheader_holder.clientHeight-document.body.scrollTop-10);
}