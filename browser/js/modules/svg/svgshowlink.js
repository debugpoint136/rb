/**
 * ===BASE===// svg // svgshowlink.js
 * @param 
 */

function svgshowlink(key) {
    apps.svg.submitbutt.disabled = false;
    if (!key) {
        print2console('Sorry please try again.', 2);
        return;
    }
    apps.svg.urlspan.innerHTML = '<a href=t/' + key + ' target=_blank>Link to the svg file</a>';
}


