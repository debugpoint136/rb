/**
 * ===BASE===// render // barplot_uniform .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.barplot_uniform = function (arg) {
    if (arg.start >= arg.stop) return [];
    arg.x = this.cumoffset(arg.rid, arg.start);
    arg.initcoord = arg.start;
    var slst = [];
    if (this.entire.atbplevel) {
        for (var i = arg.start; i < arg.stop; i++) {
            slst.push(arg.score);
        }
    } else {
        var a = arg.start;
        while (a < arg.stop) {
            slst.push(arg.score);
            a += this.regionLst[arg.rid][7];
        }
    }
    delete arg.score;
    delete arg.start;
    delete arg.stop;
    arg.data = slst;
    return this.barplot_base(arg);
};

