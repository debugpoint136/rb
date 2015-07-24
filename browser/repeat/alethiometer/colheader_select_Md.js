/**
 * colheader_select_Md
 * @param {string} event - mouse down on col header holder to zoom in and show a subset
 */

function colheader_select_Md(event)
{
    /* mouse down on col header holder to zoom in and show a subset
     to make things simple and life easier
     there's only one level of zoomin
     at zoomin level, each cell will be blown to 10px width
     gflag.zoomin.atfinest tells whether is currently at zoom-in level
     */
// check x position, detect whether pressed on actual header but not blank
    if(event.button!=0) return;
    var xidx=colheader_getlanding(event.clientX);
    if(xidx==-1) return;
    event.preventDefault();
    var pos=absolutePosition(colheader_holder.parentNode);
    gflag.zoomin.x=event.clientX;
    gflag.zoomin.x0=event.clientX; // original x
    gflag.zoomin.borderleft=Math.max(parseInt(colheader_holder.style.left)+pos[0],pos[0]);
    gflag.zoomin.borderright=pos[0]+Math.min(colheader_holder.parentNode.clientWidth,
            colheader_holder.clientWidth+parseInt(colheader_holder.style.left));
    gflag.zoomin.inuse=true;
    indicator.style.display='block';
    indicator.style.width=1;
    indicator.style.height=colheader_holder.clientHeight+1;
    indicator.style.left=event.clientX;
    indicator.style.top=pos[1]-1;
    indicator.firstChild.style.backgroundColor=
        indicator.style.borderColor= gflag.zoomin.atfinest?'red':'blue';
    document.body.addEventListener('mousemove',colheader_select_Mm,false);
    document.body.addEventListener('mouseup',colheader_select_Mu,false);
}