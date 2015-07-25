/**
 * colheader_select_Mu
 * @param event
 */

function colheader_select_Mu(event)
{
    document.body.removeEventListener('mousemove',colheader_select_Mm,false);
    document.body.removeEventListener('mouseup',colheader_select_Mu,false);
    gflag.zoomin.inuse=false;
    var w=parseInt(indicator.style.width);
    if(!gflag.zoomin.atfinest && w>cellwidth*5) {
        // carry out zoom in, find all subfams covered by indicator
        // offset of indicator relative to subfam holder
        var x=colheader_getlanding(parseInt(indicator.style.left));
        var newlst=[];
        for(var i=Math.max(x,0); i<=Math.min(x+parseInt(w/cellwidth),col_runtime.length-1); i++)
            newlst.push(col_runtime[i]);
        col_runtime=newlst;
        cellwidth=10;
        gflag.zoomin.atfinest=true;
        document.getElementById('zoomoutbutt').style.display='inline-block';
        // reset movable horizontal position
        pica.x=
            browser.move.styleLeft=
                browser.hmdiv.style.left=
                    colheader_holder.style.left=0;
        drawBigmap(false);
    }
    indicator.style.display='none';
}