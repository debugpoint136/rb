/**
 * Column header - get landing page
 * @param    {number} xpos - xpos is absolute page offset
 * @return   Math.min(parseInt((x-parseInt(colheader_holder.style.left))/cellwidth), col_runtime.length-1)<br><br><br>
 */

function colheader_getlanding(xpos)
{
// xpos is absolute page offset
    var pos=absolutePosition(colheader_holder.parentNode);
    var x=xpos-pos[0];
    var left=parseInt(colheader_holder.style.left);
    if(x<=left) {
        // beyond the left edge
        return -1;
    }
    var right=colheader_holder.clientWidth+left;
    if(x>=right) {
        // beyond the right edge
        return -1;
    }
    return Math.min(parseInt((x-parseInt(colheader_holder.style.left))/cellwidth), col_runtime.length-1);
}