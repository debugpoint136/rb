/**
 * ===BASE===// facet // toggle32.js
 * @param 
 */

function toggle32(event) {
    /* called by clicking on <span> within <li>
     for facet, one criterion state
     <li> should have <ul> as its next sibling
     */
    var li = event.target;
    while (li.tagName != 'LI') {
        li = li.parentNode;
    }
    var span = li.firstChild.firstChild;
    var ul = li.nextSibling;
    if (ul.tagName != 'UL') {
        fatalError('toggle32: could not find UL as next sibling');
    }
    var hidden = ul.style.display == 'none';
    var term = li.term;
    var p2c = gflag.mdlst[li.idx].p2c;
    if (hidden) {
        for (var cterm in p2c[term]) {
            apps.hmtk.bbj.trackselectionoption_onecriteria(cterm, li.idx, ul);
        }
        ul.style.display = "block";
        span.innerHTML = '&#8863;';
    } else {
        stripChild(ul, 0);
        ul.style.display = "none";
        span.innerHTML = '&#8862;';
    }
}

