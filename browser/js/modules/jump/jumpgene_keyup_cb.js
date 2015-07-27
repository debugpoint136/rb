/**
 * ===BASE===// jump // jumpgene_keyup_cb.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.jumpgene_keyup_cb = function (data, query) {
    if (!data || !data.lst || data.lst.length == 0) {
        menu2_hide();
        return;
    }
    menu2_show();
    var p = absolutePosition(menu.relocate.gene);
    menu2.style.left = p[0];
    menu2.style.top = p[1] + 20;
    stripChild(menu2, 0);
// returned gene names could be identical
    var s = {};
    for (var i = 0; i < data.lst.length; i++) {
        s[data.lst[i]] = 1;
    }
// put genes whose name start with the query to front
    var lst = [];
    query = query.toLowerCase();
    for (var n in s) {
        var sn = n.toLowerCase();
        if (sn.indexOf(query) == 0) {
            lst.push(n);
            delete s[n];
        }
    }
    for (n in s) lst.push(n);
    for (var i = 0; i < Math.min(20, lst.length); i++) {
        dom_create('div', menu2, null, {c: 'menu2ele', t: lst[i], clc: menu2ele_click}).genename = lst[i];
    }
};


