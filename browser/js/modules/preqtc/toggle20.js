/**
 * ===BASE===// preqtc // toggle20.js
 * @param 
 */

function toggle20(event) {
// native decor, show/hide children tk by clicking on arrow in
    var hook = event.target;
    var bait = event.target.parentNode.parentNode.nextSibling;
    if (bait.style.display == "none") {
        bait.style.display = "table-row";
        hook.style.transform =
            hook.style.mozTransform =
                hook.style.webkitTransform = 'rotate(-90deg)';
    } else {
        bait.style.display = "none";
        hook.style.transform =
            hook.style.mozTransform =
                hook.style.webkitTransform = 'rotate(90deg)';
    }
}


