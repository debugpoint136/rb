/**
 * ===BASE===// facet // menu_delete_custtk.js
 * @param 
 */

function menu_delete_custtk(event) {
// called by pushing butt in 'list all' menu
    gflag.menu.bbj.delete_custtk([event.target.tkname]);
    menu_custtk_showall();
}

