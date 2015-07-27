/**
 * Created by dpuru on 2/27/15.
 */
/* __cache__ */

function menu_refreshcache() {
    menu_blank();
    dom_create('div', menu.c32, 'margin:10px;width:200px;font-size:70%;opacity:.7;').innerHTML = 'Refreshing cache is necessary when you have updated the file(s) of this track.';
    gflag.menu.bbj.refreshcache_maketkhandle(dom_create('div', menu.c32, 'margin:20px;'), gflag.menu.tklst[0]);
}

