/**
 * ===BASE===// preqtc // hengeview_lrtkdetail.js
 * @param 
 */

function hengeview_lrtkdetail(event) {
    var t = event.target;
    menu_shutup();
    menu_show_beneathdom(0, t);
    apps.circlet.hash[t.viewkey].bbj.tkinfo_show(t.tkname);
}

