/**
 * Created by dpuru on 2/27/15.
 */
/*** __navi__ navigator ***/

Browser.prototype.clicknavibutt = function (param) {
    if (this.is_gsv()) {
        if (param && param.d) {
            param.d.innerHTML = 'working...';
        }
        this.gsv_turnoff();
        return;
    }
    var p2 = {};
    if (param.d) {
        p2.d = param.d;
    } else {
        p2.x = param.x;
        p2.y = param.y;
    }
    p2.showchr = this.navigator ? false : true;
    this.showjumpui(p2);
    menu.relocate.coord.focus();
};

