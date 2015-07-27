/**
 * ===BASE===// cate // cateCfg_show.js
 * @param 
 */

function cateCfg_show(tkobj, showcateid, disablecc) {
    if (!tkobj.cateInfo) {
        print2console('not categorical??', 2);
        return;
    }
    menu.catetkobj = tkobj;
    var lst = ['<table cellspacing=3 style="color:inherit;">'];
    for (var i in tkobj.cateInfo) {
        if (i == -1) continue;
        var t = tkobj.cateInfo[i];
        lst.push('<tr><td>' + (showcateid ? i : '') + '</td><td class=squarecell itemidx=' + i +
        (disablecc ? '' : ' onclick="cateTkitemcolor_initiate(event)"') +
        ' style="background-color:' + t[1] + ';"></td><td>' + t[0] + '</td></tr>');
    }
// restore button is only shown for native hmtk
    if (tkobj.ft == FT_cat_n) {
        lst.push('<tr><td colspan=3 style="padding-left:20px"><button type=button onclick=menu_update_track(35)>Restore color settings</button></td></tr>');
    }
    if (!showcateid) {
        lst.push('<tr><td colspan=3 style="padding-left:20px;"><button type=button onclick=cateCfg_showcateid(event)>Show category id</button></td></tr>');
    }
    lst.push('</table>');
    menu.c13.innerHTML = lst.join('');
    menu.c13.style.display =
        menu.c14.style.display = 'block';
    menu.c14.unify.style.display = 'none';
}

