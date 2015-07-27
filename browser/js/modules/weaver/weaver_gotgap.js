/**
 * ===BASE===// weaver // weaver_gotgap.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.weaver_gotgap = function (rid, descending) {
    if (!this.weaver || !this.weaver.insert) return [];
    var ins = this.weaver.insert[rid];
    if (!ins) return [];
    var lst = [];
    for (var c in ins) lst.push(parseInt(c));
    if (lst.length == 0) return [];
    lst.sort(descending ? numSort2 : numSort);
    return lst;
};

