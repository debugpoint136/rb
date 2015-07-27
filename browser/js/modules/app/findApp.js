/**
 * ===BASE===// app // findApp.js
 * @param
 */

function findApp(event) {
    var s = event.target.value;
    if (s.length == 0) {
        menu2_hide();
        return;
    }
    var ss = s.toLowerCase();
    var lst = [];
    for (var i = 0; i < gflag.applst.length; i++) {
        var a = gflag.applst[i];
        if (a.name.toLowerCase().indexOf(ss) != -1) {
            lst.push(a);
        } else if (a.label && a.label.toLowerCase().indexOf(ss) != -1) {
            lst.push(a);
        }
    }
    if (lst.length == 0) {
        menu2_hide();
        if (event.keyCode == 13) print2console('No apps found', 2);
        return;
    }
    if (lst.length == 1 && event.keyCode == 13) {
        menu2_hide();
        lst[0].toggle();
        return;
    }
    menu2_show();
    var p = absolutePosition(event.target);
    menu2.style.left = p[0];
    menu2.style.top = p[1] + 20;
    stripChild(menu2, 0);
    for (var i = 0; i < lst.length; i++) {
        dom_create('div', menu2, 'font-size:120%;padding:5px 10px;', {
            c: 'menu2ele',
            t: lst[i].name,
            clc: invokeapp_closure(lst[i].toggle)
        });
    }
}
