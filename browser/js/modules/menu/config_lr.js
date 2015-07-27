/**
 * ===BASE===// menu // config_lr.js
 * @param 
 */

function config_lr(tk) {
// not density
    if (tk.mode == M_full) {
        fontpanel_set(tk);
    } else if (tk.mode == M_trihm) {
        menu.c14.style.display = 'block';
        menu.c14.unify.style.display = 'none';
    }
    menu.lr.style.display = 'block';
    longrange_showplotcolor('rgb(' + tk.qtc.pr + ',' + tk.qtc.pg + ',' + tk.qtc.pb + ')', 'rgb(' + tk.qtc.nr + ',' + tk.qtc.ng + ',' + tk.qtc.nb + ')');
    menu.lr.autoscale.parentNode.style.display = 'block';
    menu.lr.autoscale.checked = tk.qtc.thtype == scale_auto;
    menu.lr.pcscore.parentNode.style.display = menu.lr.ncscore.parentNode.style.display = tk.qtc.thtype == scale_auto ? 'none' : 'inline';
    menu.lr.pcscoresays.style.display = menu.lr.ncscoresays.style.display = tk.qtc.thtype == scale_auto ? 'inline' : 'none';
    menu.lr.pcscore.value = tk.qtc.pcolorscore;
    menu.lr.pcscoresays.innerHTML = tk.qtc.pcolorscore;
    menu.lr.ncscore.value = tk.qtc.ncolorscore;
    menu.lr.ncscoresays.innerHTML = tk.qtc.ncolorscore;
    menu.lr.pfscore.value = tk.qtc.pfilterscore;
    menu.lr.nfscore.value = tk.qtc.nfilterscore;
    menu.lr.pfscore.parentNode.style.display = menu.lr.nfscore.parentNode.style.display = 'block';
}
