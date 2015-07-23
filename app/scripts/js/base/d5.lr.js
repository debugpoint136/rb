/**
 * Created by dpuru on 2/27/15.
 */
/*** __lr__ longrange specific ***/

function longrange_showplotcolor(pcolor, ncolor) {
// plot the two color stripe in the menu config panel
    if (pcolor) {
        var c = menu.lr.pcolor;
        c.style.backgroundColor = pcolor;
        var ctx = c.getContext('2d');
        var lingrad = ctx.createLinearGradient(0, 0, c.width, 0);
        lingrad.addColorStop(0, 'white');
        lingrad.addColorStop(1, pcolor);
        ctx.fillStyle = lingrad;
        ctx.fillRect(0, 0, c.width, c.height);
    }
    if (ncolor) {
        var c = menu.lr.ncolor;
        c.style.backgroundColor = ncolor;
        var ctx = c.getContext('2d');
        var lingrad = ctx.createLinearGradient(0, 0, c.width, 0);
        lingrad.addColorStop(0, 'white');
        lingrad.addColorStop(1, ncolor);
        ctx.fillStyle = lingrad;
        ctx.fillRect(0, 0, c.width, c.height);
    }
}

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

Browser.prototype.is_gsv = function () {
    var t = this.juxtaposition.type;
    return t == RM_gsv_c || t == RM_gsv_kegg || t == RM_protein;
};
