/**
 * ===BASE===// decor // decortkentry_click.js
 * @param 
 */

function decortkentry_click(event) {
    if (event.target.className == 'tkentry_inactive') return;
    event.target.className = 'tkentry_inactive';
    var bbj = gflag.menu.bbj;
    if (bbj.trunk) bbj = bbj.trunk;
    bbj.adddecorparam([event.target.tkobj.name]);
    bbj.ajax_loadbbjdata(bbj.init_bbj_param);
}

