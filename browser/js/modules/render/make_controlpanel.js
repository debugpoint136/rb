/**
 * ===BASE===// render // make_controlpanel.js
 * @param 
 */

function make_controlpanel(param) {
    var main = dom_create('div');
    main.style.position = 'absolute';
    main.style.zIndex = 100;
    main.style.display = 'none';
    if (param.bg) {
        main.style.backgroundColor = param.bg;
    }
    var tableid = Math.random();
    main.setAttribute('id', tableid);
// 1 header
    var table = dom_create('table', main);
    if (param.headerzoom) {
        table.style.zoom = param.headerzoom;
    }
    var tr = table.insertRow(0);
// 1 header text, draggable
    var td = tr.insertCell(0);
    td.setAttribute('holderid', tableid);
    td.addEventListener('mousedown', cpmoveMD, false);
    if (param.htextbg) {
        td.style.backgroundColor = param.htextbg;
    }
    var d = dom_create('div', td);
    d.className = 'skewbox_header';
    var d2 = dom_create('div', d); // skew box
    d2.style.borderColor = param.htextcolor ? param.htextcolor : colorCentral.background_faint_7;
    if (param.htextbg) {
        d2.style.backgroundColor = param.htextbg;
    }
    d2 = dom_create('div', d); // text box
    d2.style.padding = param.hpadding ? param.hpadding : '2px 100px';
    d2.style.color = param.htextcolor ? param.htextcolor : colorCentral.background;
    d2.innerHTML = param.htext;
    main.__htextdiv = d2;
// 1 header butt
    if (param.hbutt1) {
        var p = param.hbutt1;
        td = tr.insertCell(-1);
        td.style.paddingLeft = '15px';
        d = make_skewbox_butt(td);
        if (p.title) d.title = p.title;
        if (p.call) d.addEventListener('click', p.call, false);
        d.firstChild.style.backgroundColor = p.bg ? p.bg : (param.htextcolor ? param.htextcolor : colorCentral.background);
        d.childNodes[1].style.color = p.fg ? p.fg : colorCentral.foreground_faint_5;
        d.childNodes[1].innerHTML = param.hbutt1.text;
        main.__hbutt1 = d;
    }
    if (param.hbutt2) {
        var p = param.hbutt2;
        td = tr.insertCell(-1);
        td.style.paddingLeft = '15px';
        d = make_skewbox_butt(td);
        if (p.title) d.title = p.title;
        if (p.call) d.addEventListener('click', p.call, false);
        d.firstChild.style.backgroundColor = p.bg ? p.bg : (param.htextcolor ? param.htextcolor : colorCentral.background);
        d.childNodes[1].style.color = p.fg ? p.fg : colorCentral.foreground_faint_5;
        d.childNodes[1].innerHTML = p.text;
        main.__hbutt2 = d;
    }
    if (param.hbutt3) {
        var p = param.hbutt3;
        td = tr.insertCell(-1);
        td.style.paddingLeft = '15px';
        d = make_skewbox_butt(td);
        if (p.title) d.title = p.title;
        if (p.call) d.addEventListener('click', p.call, false);
        d.firstChild.style.backgroundColor = p.bg ? p.bg : (param.htextcolor ? param.htextcolor : colorCentral.background);
        d.childNodes[1].style.color = p.fg ? p.fg : colorCentral.foreground_faint_5;
        d.childNodes[1].innerHTML = p.text;
        main.__hbutt3 = d;
    }
// 2 contents
    d = dom_create('div', main);
    d.style.marginTop = '20px';
    d.style.position = 'relative';
    main.__contentdiv = d;
    return main;
}

