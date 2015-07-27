/**
 * ===BASE===// matplot // config_matplot.js
 * @param 
 */

function config_matplot(tk) {
    qtcpanel_setdisplay({
        qtc: tk.qtc,
        ft: tk.ft,
        no_log: true,
        no_smooth: true,
    });
    menu.c51.sharescale.style.display = 'none';
    stripChild(menu.c13, 0);
    var t = dom_create('table', menu.c13, 'color:inherit;');
    t.cellSpacing = 5;
    for (var i = 0; i < tk.tracks.length; i++) {
        var t2 = tk.tracks[i];
        var tr = t.insertRow(-1);
        var td = tr.insertCell(0);
        td.className = 'squarecell';
        var q = t2.qtc;
        td.style.backgroundColor = 'rgb(' + q.pr + ',' + q.pg + ',' + q.pb + ')';
        td.onclick = matplot_linecolor_initiate;
        td.tkidx = i;
        tr.insertCell(1).innerHTML = t2.label;
    }
    menu.c13.style.display = 'block';
    menu.c14.style.display = 'block';
    menu.c14.unify.style.display = 'none';
}

