/**
 * Created by dpuru on 2/27/15.
 */
/*** __splinter__  ***/

Browser.prototype.splinter_issuetrigger = function (coord) {
// triggered by app, show empty splinter holder with prompt of choosing view range
    var bbj = this.splinterTag ? this.trunk : this;
    if (bbj.weaver) {
        print2console('This function is not available for the moment!', 2);
        return;
    }
    var pa = {splinters: [coord]};
    bbj.init_bbj_param = pa;
    bbj.ajax_loadbbjdata(pa);
};

