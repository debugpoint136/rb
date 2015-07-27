/**
 * ===BASE===// menu // config_cmtk.js
 * @param 
 */

function config_cmtk(tk) {
    menu.c14.style.display = 'block';
    menu.c14.unify.style.display = 'none';
    menu.c45.style.display = 'block';
    menu.c45.combine_chg.div.style.display = 'none';
    if (tk.cm.set.rd_r) {
        // has two strands
        menu.c45.combine_notshown.style.display = 'none';
        menu.c45.combine.parentNode.style.display = 'block';
        menu.c45.combine.checked = tk.cm.combine;
        if (tk.cm.set.chg_f && tk.cm.set.chg_r && tk.cm.combine) {
            menu.c45.combine_chg.div.style.display = 'block';
            menu.c45.combine_chg.checkbox.checked = tk.cm.combine_chg;
        }
    } else {
        menu.c45.combine_notshown.style.display = 'block';
        menu.c45.combine.parentNode.style.display = 'none';
        menu.c45.combine.checked = false;
    }
    menu.c45.scale.checked = tk.cm.scale;
    if (tk.cm.filter > 0) {
        menu.c45.filter.checkbox.checked = true;
        menu.c45.filter.div.style.display = 'block';
        menu.c45.filter.input.value = tk.cm.filter;
    } else {
        menu.c45.filter.checkbox.checked = false;
        menu.c45.filter.div.style.display = 'none';
    }
    var hasreverse = tk.cm.set.rd_r;
    var t = menu.c45.table;
    stripChild(t, 0);
    var tr = t.insertRow(0);
    tr.insertCell(0);
    var td = tr.insertCell(1);
    td.align = 'center';
    td.style.fontSize = '70%';
    td.innerHTML = 'forward / comb.';
    if (hasreverse) {
        td = tr.insertCell(2);
        td.align = 'center';
        td.style.fontSize = '70%';
        td.innerHTML = 'reverse';
    }
    tr = t.insertRow(-1);
    td = tr.insertCell(0);
    td.align = 'right';
    td.innerHTML = 'CG';
    td = tr.insertCell(-1);
    var c = dom_create('canvas', td, 'background-color:' + tk.cm.color.cg_f);
    c.width = 36;
    c.height = 20;
    c.which = 'cg_f';
    c.addEventListener('click', cmtk_color_initiate, false);
    c = dom_create('canvas', td, 'background-color:' + tk.cm.bg.cg_f);
    c.width = 36;
    c.height = 20;
    c.which = 'cg_f';
    c.addEventListener('click', cmtk_color_initiate, false);
    c.bg = true;
    if (hasreverse) {
        td = tr.insertCell(-1);
        c = dom_create('canvas', td, 'background-color:' + tk.cm.color.cg_r);
        c.width = 36;
        c.height = 20;
        c.which = 'cg_r';
        c.addEventListener('click', cmtk_color_initiate, false);
        c = dom_create('canvas', td, 'background-color:' + tk.cm.bg.cg_r);
        c.width = 36;
        c.height = 20;
        c.which = 'cg_r';
        c.addEventListener('click', cmtk_color_initiate, false);
        c.bg = true;
    }
    if (tk.cm.set.chg_f) {
        tr = t.insertRow(-1);
        td = tr.insertCell(0);
        td.align = 'right';
        td.innerHTML = 'CHG';
        td = tr.insertCell(-1);
        c = dom_create('canvas', td, 'background-color:' + tk.cm.color.chg_f);
        c.width = 36;
        c.height = 20;
        c.addEventListener('click', cmtk_color_initiate, false);
        c.which = 'chg_f';
        c = dom_create('canvas', td, 'background-color:' + tk.cm.bg.chg_f);
        c.width = 36;
        c.height = 20;
        c.which = 'chg_f';
        c.addEventListener('click', cmtk_color_initiate, false);
        c.bg = true;
        if (hasreverse) {
            td = tr.insertCell(-1);
            c = dom_create('canvas', td, 'background-color:' + tk.cm.color.chg_r);
            c.width = 36;
            c.height = 20;
            c.which = 'chg_r';
            c.addEventListener('click', cmtk_color_initiate, false);
            c = dom_create('canvas', td, 'background-color:' + tk.cm.bg.chg_r);
            c.width = 36;
            c.height = 20;
            c.which = 'chg_r';
            c.addEventListener('click', cmtk_color_initiate, false);
            c.bg = true;
        }
    }
    if (tk.cm.set.chh_f) {
        tr = t.insertRow(-1);
        td = tr.insertCell(0);
        td.align = 'right';
        td.innerHTML = 'CHH';
        td = tr.insertCell(-1);
        c = dom_create('canvas', td, 'background-color:' + tk.cm.color.chh_f);
        c.width = 36;
        c.height = 20;
        c.which = 'chh_f';
        c.addEventListener('click', cmtk_color_initiate, false);
        c = dom_create('canvas', td, 'background-color:' + tk.cm.bg.chh_f);
        c.width = 36;
        c.height = 20;
        c.which = 'chh_f';
        c.addEventListener('click', cmtk_color_initiate, false);
        c.bg = true;
        if (hasreverse) {
            td = tr.insertCell(-1);
            c = dom_create('canvas', td, 'background-color:' + tk.cm.color.chh_r);
            c.width = 36;
            c.height = 20;
            c.which = 'chh_r';
            c.addEventListener('click', cmtk_color_initiate, false);
            c = dom_create('canvas', td, 'background-color:' + tk.cm.bg.chh_r);
            c.width = 36;
            c.height = 20;
            c.which = 'chh_r';
            c.addEventListener('click', cmtk_color_initiate, false);
            c.bg = true;
        }
    }
    tr = t.insertRow(-1);
    td = tr.insertCell(0);
    td.innerHTML = 'read depth';
    td = tr.insertCell(-1);
    c = dom_create('canvas', td, 'background-color:' + tk.cm.color.rd_f);
    c.width = 50;
    c.height = 20;
    c.which = 'rd_f';
    c.addEventListener('click', cmtk_color_initiate, false);
    if (hasreverse) {
        td = tr.insertCell(-1);
        c = dom_create('canvas', td, 'background-color:' + tk.cm.color.rd_r);
        c.width = 50;
        c.height = 20;
        c.which = 'rd_r';
        c.addEventListener('click', cmtk_color_initiate, false);
    }
// smoothing for rd
    menu.c46.style.display = 'block';
    if (tk.cm.set.rd_f.qtc.smooth) {
        menu.c46.checkbox.checked = true;
        menu.c46.div.style.display = 'block';
        menu.c46.says.innerHTML = tk.cm.set.rd_f.qtc.smooth + '-pixel window';
    } else {
        menu.c46.checkbox.checked = false;
        menu.c46.div.style.display = 'none';
    }
}

