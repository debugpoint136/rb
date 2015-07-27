/**
 * ===BASE===// lr // menu_showtk2region.js
 * @param 
 */

function menu_showtk2region() {
    /* called through menu option
     ???
     */
    var tk = gflag.menu.bbj.genome.hmtk[gflag.menu.tklst[0].name];
    if (!tk || !tk.regions) {
        menu_hide();
        print2console('This track does not have associated regions', 2);
        return;
    }
    var lst = tk.regions[1];
    var lst2 = [];
    for (var i = 0; i < lst.length; i++) {
        //lst2.push('<a class=a2 href="javascript:void(0)" onclick="menu.relocate.coord.value=\''+lst[i]+'\';gflag.jump.type=1;menuJump();menu_hide();">'+lst[i]+'</a>');
    }
    menu_shutup();
    var h = menu.tk2region_showlst.nextSibling;
    h.style.display = 'block';
    h.innerHTML = lst2.join('<br>');
}

/*** __lr__ ends ***/

