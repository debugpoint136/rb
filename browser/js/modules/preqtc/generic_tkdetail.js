/**
 * ===BASE===// preqtc // generic_tkdetail.js
 * @param 
 */

function generic_tkdetail(event) {
    var t = event.target;
    menu_shutup();
    menu_show_beneathdom(0, t);
    gflag.browser.tkinfo_show(t.tkobj);
}
