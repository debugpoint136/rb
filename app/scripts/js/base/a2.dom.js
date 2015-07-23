/**
 * Created by dpuru on 2/27/15.
 */
/*** __dom__ ***/
function dom_create(tag, holder, style, p) {
    var d = document.createElement(tag);
    if (holder) {
        holder.appendChild(d);
    } else {
        document.body.appendChild(d);
    }
    if (style) {
        d.setAttribute('style', style);
    }
    if (p) {
        if (p.c) d.className = p.c;
        if (p.t) d.innerHTML = p.t;
        if (p.clc) d.onclick = p.clc;
        if (p.title) d.title = p.title;
    }
    return d;
}

function make_radiobutton(holder, pp) {
    var ip = dom_create('input', holder);
    ip.type = 'radio';
    ip.setAttribute('name', pp.name);
    ip.setAttribute('id', pp.id);
    ip.setAttribute('value', pp.value);
    ip.addEventListener('change', pp.call, false);
    var lb = dom_create('label', holder);
    lb.style.marginLeft = 5;
    lb.innerHTML = pp.label;
    lb.setAttribute('for', pp.id);
    if (pp.linebreak) {
        dom_create('br', holder);
    }
    return ip;
}
function dom_addbutt(holder, text, call, style) {
    var b = dom_create('button', holder, style);
    b.type = 'button';
    b.innerHTML = text;
    if (call) {
        b.addEventListener('click', call, false);
    }
    return b;
}

function dom_addtext(holder, text, color, cls) {
    var s = dom_create('span', holder);
    if (text)
        s.innerHTML = text;
    if (color)
        s.style.color = color;
    if (cls)
        s.className = cls;
    return s;
}
function make_headertable(holder) {
    var t = dom_create('div', holder, 'display:table;background-color:' + colorCentral.background_faint_7 + ';border-top:solid 1px ' + colorCentral.magenta7);
    t._h = dom_create('div', t, 'text-align:center;margin:8px 20px;padding:5px 0px 10px;border-bottom:solid 1px ' + colorCentral.magenta2);
    t._c = dom_create('div', t, 'padding:20px;');
    return t;
}

function make_slidingtable(param) {
    var d = dom_create('div', param.holder, 'overflow:hidden;padding:5px;');
    var table = dom_create('table', d);
    table.cellPadding = table.cellSpacing = 0;
    var tr = table.insertRow(0);
// 1-1
    var td = tr.insertCell(0);
    d.leadingcell = td;
// 1-2
    td = tr.insertCell(1);
    var d2 = dom_create('div', td, 'position:relative;overflow:hidden;width:' + param.hscroll.width + 'px;height:' + param.hscroll.height + 'px;');
    var d3 = dom_create('div', d2, 'position:absolute;left:0px;top:0px;');
    d.hscroll = d3;
    tr = table.insertRow(1);
// 2-1
    td = tr.insertCell(0);
    d2 = dom_create('div', td, 'position:relative;overflow:hidden;width:' + param.vscroll.width + 'px;height:' + param.vscroll.height + 'px;');
    d3 = dom_create('div', d2, 'position:absolute;left:0px;top:0px;');
    d.vscroll = d3;
// 2-2
    td = tr.insertCell(1);
    d2 = dom_create('div', td, 'position:relative;overflow:hidden;width:' + param.hscroll.width + 'px;height:' + param.vscroll.height + 'px;');
    d2.addEventListener('mousedown', slidingtableMD, false);
    d2.slidingtable = d;
    d3 = dom_create('div', d2, 'position:absolute;left:0px;top:0px;');
    d.scroll = d3;
    return d;
}

function slidingtableMD(event) {
    /* generic moving panel */
    if (event.button != 0) return;
    var d = event.target;
    while (!d.slidingtable) {
        d = d.parentNode;
    }
    event.preventDefault();
    gflag.slidingtable = {d: d.slidingtable, oldx: event.clientX, oldy: event.clientY};
    document.body.addEventListener('mousemove', slidingtableMM, false);
    document.body.addEventListener('mouseup', slidingtableMU, false);
}
function slidingtableMM(event) {
    var d = gflag.slidingtable.d;
    d.hscroll.style.left = parseInt(d.hscroll.style.left) + event.clientX - gflag.slidingtable.oldx;
    d.vscroll.style.top = parseInt(d.vscroll.style.top) + event.clientY - gflag.slidingtable.oldy;
    d.scroll.style.left = parseInt(d.scroll.style.left) + event.clientX - gflag.slidingtable.oldx;
    d.scroll.style.top = parseInt(d.scroll.style.top) + event.clientY - gflag.slidingtable.oldy;
    gflag.slidingtable.oldx = event.clientX;
    gflag.slidingtable.oldy = event.clientY;
    /* to help with escaping click event on d
     click callback on d will test gflag.slidingtable.d.moved
     if true, set to false and quit
     else, it is a real click
     */
    d.moved = true;
}
function slidingtableMU(event) {
    event.preventDefault();
    document.body.removeEventListener('mousemove', slidingtableMM, false);
    document.body.removeEventListener('mouseup', slidingtableMU, false);
}


function make_tablist(param) {
    /* switching tabs, two layout (tabs on left, tabs on top)
     tabtop: true if tabs on top row
     tabpadding:
     */
    var table = document.createElement('table');
    table.style.margin = '0px 10px 10px 10px';
    table.cellPadding = table.cellSpacing = 0;
    var tr = table.insertRow(0);
// tabs
    var td = tr.insertCell(0);
    table.tab_td = td; // for bgcolor
    if (param.tabtop) {
        td.vAlign = 'bottom';
    } else {
        td.vAlign = 'top';
    }
// tab holder
    var d = dom_create('div', td, param.tabtop ? 'margin:10px 10px 0px 10px;display:inline-block' : 'margin: 10px 0px 10px 10px;');
    if (param.tabholderborder) {
        d.style.border = '1px solid ' + colorCentral.foreground_faint_1;
        if (param.tabtop) {
            d.style.borderBottomWidth = 0;
        } else {
            d.style.borderRightWidth = 0;
        }
    }
    table.tab_holder = d; // for bgcolor
    var firsttab = null;
    var tabs = [];
    for (var i = 0; i < param.lst.length; i++) {
        var tab = dom_create('div', d);
        tabs.push(tab);
        if (param.tabpadding) {
            tab.style.padding = param.tabpadding;
        }
        if (param.tabtop) {
            tab.style.display = 'inline-block';
        }
        tab.className = 'tablisttab_off';
        if (param.tabtop) {
            tab.style.padding = '5px 15px';
            tab.style.borderBottom = 'solid 1px ' + colorCentral.background_faint_1;
        } else {
            tab.style.borderRight = 'solid 1px ' + colorCentral.background_faint_1;
        }
        tab.innerHTML = param.lst[i];
        tab.addEventListener('click', tablisttab_click, false);
        tab.table = table;
        tab.tablist_idx = i;
        if (i == 0) firsttab = tab;
    }
    table.tabs = tabs;
// list of holders
    if (param.tabtop) {
        tr = table.insertRow(1);
        td = tr.insertCell(0);
        td.style.borderTop = 'solid 1px ' + colorCentral.magenta7;
    } else {
        td = tr.insertCell(1);
        td.vAlign = 'top';
        td.style.borderLeft = 'solid 1px ' + colorCentral.magenta7;
    }
    table.page_td = td; // for bgcolor
    td.style.padding = 10;
    td.style.whiteSpace = 'nowrap';
    var holders = [];
    for (var i = 0; i < param.lst.length; i++) {
        holders.push(dom_create(param.usediv ? 'div' : 'table', td));
    }
    simulateEvent(firsttab, 'click');
    table.holders = holders;
    return table;
}

function tablisttab_click(event) {
// clicking on a tab (div)
    var lst = event.target.table.tabs;
    var lst2 = event.target.table.page_td.childNodes;
    for (var i = 0; i < lst.length; i++) {
        lst[i].className = 'tablisttab_off';
        lst2[i].style.display = 'none';
    }
    event.target.className = 'tablisttab_on';
    lst2[event.target.tablist_idx].style.display = 'block';
}


function dom_inputtext(holder, p) {
    var i = dom_create('input', holder);
    i.type = 'text';
    i.size = p.size ? p.size : 10;
    if (p.ph) {
        i.placeholder = p.ph;
    }
    if (p.call) {
        i.addEventListener('keyup', p.call, false);
    }
    return i;
}
function dom_inputnumber(holder, p) {
    var i = dom_create('input', holder);
    i.type = 'number';
    i.style.width = p.width ? p.width : 50;
    i.value = p.value;
    if (p.call) {
        i.addEventListener('keyup', p.call, false);
    }
    return i;
}
function dom_addcheckbox(holder, label, call) {
    var t = dom_create('input', holder, 'margin-right:8px;');
    t.type = 'checkbox';
    var id = Math.random().toString();
    t.id = id;
    if (call) {
        t.addEventListener('change', call, false);
    }
    var l = dom_create('label', holder);
    l.innerHTML = label;
    l.setAttribute('for', id);
    return t;
}

function dom_addselect(holder, call, options) {
    var s = dom_create('select', holder);
    if (call) {
        s.addEventListener('change', call, false);
    }
    for (var i = 0; i < options.length; i++) {
        var o = dom_create('option', s);
        o.value = options[i].value;
        o.text = options[i].text;
        if (options[i].selected) {
            o.selected = true;
        }
    }
    return s;
}

function dom_addrowbutt(holder, lst, style, rowbgcolor) {
    var d = dom_create('table', holder, style);
    d.className = 'butt_holder';
    d.cellSpacing = 0;
    var tr = d.insertRow(0);
    if (rowbgcolor) {
        tr.style.backgroundColor = rowbgcolor;
    }
    for (var i = 0; i < lst.length; i++) {
        var c = lst[i];
        var td = tr.insertCell(-1);
        td.className = 'button';
        td.innerHTML = (c.pad ? '&nbsp;' : '') + c.text + (c.pad ? '&nbsp;' : '');
        td.addEventListener('click', c.call, false);
        if (c.attr) {
            for (var k in c.attr) {
                td[k] = c.attr[k];
            }
        }
    }
    return d;
}

function dom_labelbox(p) {
    var d = dom_create('table', p.holder, 'cursor:default;' + (p.style ? p.style : ''));
    d.className = 'labelbox';
    d.cellSpacing = 0;
    if (p.call) {
        d.onclick = p.call;
        d.onmouseover = labelbox_mover;
        d.onmouseout = labelbox_mout;
    }
    var tr = d.insertRow(0);
    var td = tr.insertCell(0);
    td.style.padding = '';
    td.style.fontSize = '70%';
    td.style.opacity = .7;
    d.stext = td;
    if (p.stext) {
        td.innerHTML = p.stext;
    }
    tr = d.insertRow(1);
    td = tr.insertCell(0);
    if (!p.color) {
        p.color = '#858585';
    }
    d.color = p.color;
    td.style.borderTop = '2px solid ' + p.color;
    td.style.padding = '4px 10px';
    td.style.backgroundColor = lightencolor(colorstr2int(p.color), .7);
    d.ltext = td;
    if (p.ltext) {
        td.innerHTML = p.ltext;
    }
    return d;
}

function labelbox_mover(event) {
    var d = event.target;
    while (d.className != 'labelbox') d = d.parentNode;
    d.firstChild.childNodes[1].firstChild.style.borderColor = darkencolor(colorstr2int(d.color), .4);
}
function labelbox_mout(event) {
    var d = event.target;
    while (d.className != 'labelbox') d = d.parentNode;
    d.firstChild.childNodes[1].firstChild.style.borderColor = d.color;
}


function dom_bignumtable(holder, num1, num2, style) {
    var table = dom_create('table', holder, style);
    var tr = table.insertRow(0);
    var td = tr.insertCell(0);
    table.num1 = td;
    td.vAlign = 'top';
    td.style.fontSize = '150%';
    td.style.fontWeight = 'bold';
    td.className = 'headcount';
    td.innerHTML = num1;
    td = tr.insertCell(-1);
    td.vAlign = 'top';
    td.style.fontSize = '70%';
    td.style.opacity = .7;
    td.innerHTML = 'TOTAL / ';
    td = tr.insertCell(-1);
    td.vAlign = 'top';
    td.style.fontWeight = 'bold';
    td.className = 'headcount';
    table.num2 = td;
    td.innerHTML = num2;
    td = tr.insertCell(-1);
    td.vAlign = 'top';
    td.style.fontSize = '70%';
    td.style.opacity = .7;
    td.innerHTML = 'SHOWN';
    return table;
}

/*** __dom__ ends ***/

