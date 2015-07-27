/**
 * Created by dpuru on 2/27/15.
 */

function bubbleShow(x, y) {
    bubble.style.display = "block";
    bubble.style.left = x - 13;
    bubble.style.top = y;
    document.body.addEventListener("mousedown", bubbleHide, false);
    bubble.sayajax.style.display = 'none';
    setTimeout('bubble.says.style.maxHeight="800px";', 1);
}
