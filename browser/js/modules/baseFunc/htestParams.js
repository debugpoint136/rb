/**
 * ===BASE===// baseFunc // htestParams .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.htestParams = function () {
    if (!this.htest.inuse) return '';
    var lst = [];
    for (var i = 1; i <= this.htest.grpnum; i++) {
        lst.push("&htestgrp" + i + "=" + this.htest["gtn" + i].join(","));
    }
    var v = getSelectValueById("htestc"); // correction
    return "&htest=on&htestgrpnum=" + this.htest.grpnum + lst.join("") + (v == "no" ? "" : "&htestc=" + v);
};
