/**
 * ===BASE===// menu // config_ld.js
 * @param 
 */

function config_ld(tk) {
// not density mode
    menu.c49.style.display = 'block';
    menu.c49.color.style.backgroundColor = 'rgb(' + tk.qtc.pr + ',' + tk.qtc.pg + ',' + tk.qtc.pb + ')';
    menu.c14.style.display = 'block';
    menu.c14.unify.style.display = 'none';
    config_hammock(tk);
    menu.font.style.display = menu.bed.style.display = 'none';
}

