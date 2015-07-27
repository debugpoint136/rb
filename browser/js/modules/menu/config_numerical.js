/**
 * ===BASE===// menu // config_numerical.js
 * @param 
 */

function config_numerical(tk) {
    var q = tk.qtc;
    qtcpanel_setdisplay({
        qtc: q,
        color1: 'rgb(' + q.pr + ',' + q.pg + ',' + q.pb + ')',
        color1text: 'positive',
        color2: 'rgb(' + q.nr + ',' + q.ng + ',' + q.nb + ')',
        color2text: 'negative',
        ft: tk.ft,
    });
    menu.c14.style.display = 'block';
    menu.c14.unify.style.display = 'none';
    menu.c51.sharescale.style.display = tk.group != undefined ? 'block' : 'none';
}
