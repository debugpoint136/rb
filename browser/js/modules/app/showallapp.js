/**
 * ===BASE===// app // showallapp.js
 * @param 
 */

function showallapp() {
    menu_blank();
    var d2 = dom_create('div', menu.c32, 'margin:20px;resize:both;width:' + (gflag.browser.hmSpan / 2) + 'px;');
    for (var i = 0; i < gflag.applst.length; i++) {
        var a = gflag.applst[i];
        var d = dom_create('div', d2, 'display:inline-block;margin:10px 15px;padding:5px 10px;background-color:#ededed;',
            {
                t: '<b>' + a.name + '</b>' + (a.label ? '<div style="font-size:80%">' + a.label + '</div>' : ''),
                c: 'opaque7',
                clc: a.toggle
            });
    }
    placePanel(menu);
}

/** __app__ end */
