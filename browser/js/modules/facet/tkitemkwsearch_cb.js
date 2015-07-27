/**
 * ===BASE===// facet // tkitemkwsearch_cb.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.tkitemkwsearch_cb = function (data) {
    menu_shutup();
    menu.c47.style.display = 'block';
    if (!data || !data.lst) {
        var tr = menu.c47.table.insertRow(0);
        tr.insertCell(0).innerHTML = 'Server error!';
        return;
    }
    if (data.lst.length == 0) {
        var tr = menu.c47.table.insertRow(0);
        tr.insertCell(0).innerHTML = 'No hits found.';
        return;
    }
    for (var i = 0; i < data.lst.length; i++) {
        var tr = menu.c47.table.insertRow(-1);
        tr.className = 'clb_o';
        var c = data.lst[i];
        tr.coord = c.chrom + ':' + c.start + '-' + c.stop;
        tr.itemname = c.name;
        tr.addEventListener('click', menu_jump_highlighttkitem, false);
        var td = tr.insertCell(0);
        td.innerHTML = c.name;
        td = tr.insertCell(1);
        td.innerHTML = c.chrom + ':' + c.start + '-' + c.stop;
    }
};

