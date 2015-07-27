/**
 * Created by dpuru on 2/27/15.
 */


/** __wvfind__ **/
function wvfind_view_toggle(event) {
    var b = event.target;
    apps.wvfind.vertical = b.innerHTML == 'vertical';
    apps.wvfind.view_h.disabled = apps.wvfind.vertical ? false : true;
    apps.wvfind.view_v.disabled = apps.wvfind.vertical;
    wvfind_showresult(apps.wvfind);
}
