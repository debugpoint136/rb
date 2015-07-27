/**
 * ===BASE===// baseFunc // browser_table_mover.js
 * @param 
 */

function browser_table_mover(event) {
    /* must not use onmouseover=function(){gflag.browser=bbj;}
     since that will make splinters unreachable
     */
    var d = event.target;
    while (!d.ismaintable) d = d.parentNode;
    gflag.browser = d.bbj;
}

