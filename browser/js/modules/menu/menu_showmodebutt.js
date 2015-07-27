/**
 * ===BASE===// menu // menu_showmodebutt.js
 * @param 
 */

function menu_showmodebutt(tk) {
    menu.c22.style.display = 'block';
    if (tk.ft == FT_lr_c || tk.ft == FT_lr_n) {
        menu.c10.style.display = tk.mode == M_trihm ? 'none' : 'table-cell';
        menu.c11.style.display = tk.mode == M_arc ? 'none' : 'table-cell';
    } else {
        menu.c10.style.display = menu.c11.style.display = 'none';
    }
    menu.c6.style.display = tk.mode == M_thin ? 'none' : 'table-cell';
    menu.c7.style.display = tk.mode == M_full ? 'none' : 'table-cell';
    menu.c8.style.display = tk.mode == M_den ? 'none' : 'table-cell';
    menu.c60.style.display = 'none';
    if ((tk.ft == FT_anno_c || tk.ft == FT_anno_n) && tk.scorenamelst && tk.mode != M_bar) {
        menu.c60.style.display = 'table-cell';
    }
}

