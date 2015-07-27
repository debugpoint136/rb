/*** __hub__ */
/**
 * __Genome.prototype__ <br>
 * @param hub
 * @param holder
 */

Genome.prototype.publichub_makehandle = function (hub, holder) {
    var table = dom_create('table', holder, 'display:inline-block;margin:15px 15px 15px 0px;background-color:' + colorCentral.background_faint_5);
    table.cellPadding = 10;
    table.cellSpacing = 0;
    if (hub.hublist) {
        table.style.borderTop = '2px solid white';
    }
    var tr = table.insertRow(0);
    var td0 = tr.insertCell(0);
    td0.className = 'clb4';
    dom_addtext(td0, hub.name);
    dom_addtext(td0, '&nbsp;&nbsp;' +
        (hub.hublist ? (hub.hublist.length + ' hubs') : (hub.trackcount ? (hub.trackcount + ' tracks') : '')),
        colorCentral.foreground_faint_5);
    var td1 = tr.insertCell(1);
    if (hub.hublist) {
        td1.style.display = 'none';
    } else {
        td1.align = 'right';
        dom_addbutt(td1, '&nbsp; Load &nbsp;', publichub_load_closure(hub.id));
    }
    tr = table.insertRow(1);
    tr.style.display = 'none';
    td0.onclick = publichub_detail_closure(tr);
    var td = tr.insertCell(0);
    td.colSpan = 2;
    var d = dom_create('div', td, 'position:relative;width:' + (hub.hublist ? 700 : 600) + 'px;');
    if (hub.logo) {
        var img = dom_create('img', d, 'display:block;position:absolute;left:0px;top:0px;opacity:0.1;');
        img.src = hub.logo;
    }
    dom_create('div', d, 'margin:5px 20px 10px 20px;').innerHTML = hub.desc;
    if (hub.institution) {
        var d3 = dom_create('div', d, 'margin:10px 20px;');
        for (var j = 0; j < hub.institution.length; j++) {
            dom_create('div', d3, 'display:inline-block;white-space:nowrap;margin-right:10px;').innerHTML = hub.institution[j];
        }
    }
    if (hub.cite) {
        var d3 = dom_create('table', d, 'margin:10px 20px;');
        var tr4 = d3.insertRow(0);
        var td4 = tr4.insertCell(0);
        td4.vAlign = 'top';
        td4.innerHTML = 'Please cite:';
        td4 = tr4.insertCell(1);
        td4.innerHTML = hub.cite.join('<br>');
    }
    if (hub.hublist) {
        var d2 = dom_create('div', d, 'margin:10px 20px;');
        dom_create('div', d2, 'margin-top:20px;').innerHTML = 'This collection has following hubs:';
        return d2;
    } else {
        this.publichub.lst.push({says: td1, url: hub.url, id: hub.id});
    }
};