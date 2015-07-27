/**
 * ===BASE===// menu // config_bam.js
 * @param 
 */

function config_bam(tk) {
// not density
    fontpanel_set(tk);
    menu.bam.style.display = 'block';
    menu.bam.f.style.backgroundColor = tk.qtc.forwardcolor;
    menu.bam.r.style.backgroundColor = tk.qtc.reversecolor;
    menu.bam.m.style.backgroundColor = tk.qtc.mismatchcolor;
}
