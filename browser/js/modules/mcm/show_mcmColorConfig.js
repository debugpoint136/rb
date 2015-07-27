/**
 * called by clicking menu.c9
 */

function show_mcmColorConfig() {
    menu_shutup();
    menu.style.left = Math.min(parseInt(menu.style.left), document.body.clientWidth - 300);
    var holder = menu.c9.nextSibling;
    holder.style.display = 'block';
    stripChild(holder, 0);
    var tr = holder.insertRow(0);
    var td = tr.insertCell(0);
    td.colSpan = 3;
    td.innerHTML = 'Change color setting<div style="color:#858585;font-size:60%;">These colors are used to paint metadata color map</div>';
    for (var i = 0; i < 3; i++) {
        tr = holder.insertRow(-1);
        for (var j = 0; j < 3; j++) {
            var sid = i * 3 + j;
            td = tr.insertCell(-1);
            td.innerHTML = '&nbsp;';
            td.style.backgroundColor = colorCentral.longlst[sid];
            td.sid = sid;
            td.addEventListener('click', mcm_configcolor_initiate, false);
        }
    }
    td = holder.insertRow(-1).insertCell(0);
    td.colSpan = 3;
    td.innerHTML = '<button type=button onclick=mcm_configcolor_restore()>Restore default settings</button>';
}