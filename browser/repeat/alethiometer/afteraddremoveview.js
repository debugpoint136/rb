/**
 * __view__ lst
 * @param add {boolean}
 */

function afteraddremoveview(add)
{
// arg: boolean
    var s=document.getElementById('viewcount');
    var count= parseInt(s.innerHTML)+(add?1:-1);
    s.innerHTML=count;
    var holder=pane.childNodes[5];
    if(count>15) {
        holder.style.height=400;
        holder.style.overflowY='scroll';
    } else {
        holder.style.height='auto';
        holder.style.overflowY='auto';
    }
}