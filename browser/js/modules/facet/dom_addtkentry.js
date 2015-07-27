/**
 * ===BASE===// facet // dom_addtkentry.js
 * @param 
 */

function dom_addtkentry(domtype, holder, shown, obj, showname, callback, charlimit) {
    /* can also be used to show gene set
     args:
     domtype: 1 for <td>, 2 for <div>
     holder:
     shown: boolean
     obj: will be null for gene set
     showname: in case of weaving, will show genome name together with label
     callback: optional
     charlimit: optional
     */
    var ent;
    switch (domtype) {
        case 1:
            ent = holder.insertCell(-1);
            break;
        case 2:
            ent = dom_create('div', holder);
            break;
        default:
            ent = dom_create('span', holder);
            break;
    }
    ent.tkobj = obj;
    if (shown) {
        ent.className = 'tkentry_inactive';
    } else {
        ent.className = 'tkentry';
        if (callback) ent.onclick = callback;
    }
    if (charlimit == undefined) charlimit = 30;
    if (showname.length >= charlimit + 5) {
        ent.innerHTML = showname.substr(0, charlimit) + '...';
        ent.title = showname;
    } else {
        ent.innerHTML = showname;
    }
    return ent;
}

