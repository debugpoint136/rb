/**
 * zoomout called by pushing button : zoom
 */

function zoomout() {
// called by pushing button <zoom>
    col_runtime=[];
    for(var i=0; i<col_runtime_all.length; i++)
        col_runtime.push(col_runtime_all[i]);
    cellwidth=cellwidth_zoomout;
    gflag.zoomin.atfinest=false;
    document.getElementById('zoomoutbutt').style.display='none';
    // reset movable horizontal position
    pica.x=
        browser.move.styleLeft=
            browser.hmdiv.style.left=
                colheader_holder.style.left=0;
    drawBigmap(true);
}