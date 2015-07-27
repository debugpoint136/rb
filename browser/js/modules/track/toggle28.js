/**
 * ===BASE===// track // toggle28.js
 * @param 
 */

function toggle28() {
    menu_shutup();
    menu.c35.style.display = 'block';
    var b = gflag.menu.bbj;
    var ctotal = b.tkCount()[1];
    if (ctotal == 0) {
        menu.c35.says.innerHTML = 'None yet.';
        menu.c35.opt.style.display = 'none';
    } else {
        menu.c35.says.innerHTML = '<span style="font-size:150%">' + ctotal + '</span> <span style="font-size:70%">TOTAL</span>';
        menu.c35.opt.style.display = 'block';
    }
    if (b.weaver && b.weaver.iscotton) {
        stripChild(menu.c32, 0);
        menu.c32.style.display = 'block';
        dom_create('div', menu.c32, 'background-color:#858585;color:white;text-align:center;').innerHTML = 'tracks from ' + b.genome.name;
    }
}


