/**
 * ===BASE===// tks // decorgrp_click.js
 * @param 
 */

function decorgrp_click(event) {
    /* clicking decor group tab in tkspanel
     event.target is <div> that tab, will switch decor child panels
     try to evade use of global_browser
     */
// turn off all grp tabs
    var lst = event.target.parentNode.childNodes;
    for (var i = 0; i < lst.length; i++) {
        lst[i].style.backgroundColor = '';
    }
// turn off all children panels
    lst = event.target.parentNode.parentNode.nextSibling.childNodes;
    for (i = 0; i < lst.length; i++)
        lst[i].style.display = 'none';
// turn on the one clicked
    event.target.style.backgroundColor = colorCentral.magenta2;
    var grp = event.target.getAttribute('grpname');
    for (i = 0; i < lst.length; i++) {
        if (lst[i].getAttribute('grpname') == grp) {
            lst[i].style.display = 'block';
            return;
        }
    }
}


