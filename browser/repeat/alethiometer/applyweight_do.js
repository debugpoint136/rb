/**
 * @param event
 */

function applyweight_do(event)
{
    if(apply_weight) {
        apply_weight=false;
        event.target.innerHTML='Apply weight';
    } else {
        apply_weight=true;
        event.target.innerHTML='Remove weight';
    }
    drawBigmap(true);
}