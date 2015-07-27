/**
 * ===BASE===// menu // config_density.js
 * @param 
 */

function config_density(tk) {
    qtcpanel_setdisplay({
        qtc: tk.qtc,
        color1: 'rgb(' + tk.qtc.pr + ',' + tk.qtc.pg + ',' + tk.qtc.pb + ')',
        ft: tk.ft,
    });
    menu.c14.style.display = 'block';
    menu.c14.unify.style.display = 'none';
    menu.c59.style.display = 'none';
    menu.c51.sharescale.style.display = tk.group != undefined ? 'block' : 'none';
}
