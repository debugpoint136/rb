/**
 * ===BASE===// menu // menuDecorChangemode.js
 * @param 
 */

function menuDecorChangemode(event) {
// pushing mode butt
    var bbj = gflag.menu.bbj;
    var tk = gflag.menu.tklst[0];
    if (bbj.splinterTag) {
        bbj = bbj.trunk;
        tk = bbj.findTrack(tk.name);
    }
// alert
    var tom = event.target.mode;
    if ((tom == M_thin || tom == M_full || tom == M_bar) && tk.mode != M_den) {
        var itemcount = 0;
        for (var i = 0; i < tk.data.length; i++) {
            itemcount += tk.data[i].length;
        }
        itemcount += tk.skipped ? tk.skipped : 0;
        if (itemcount > trackitemnumAlert) {
            menu_shutup();
            var d = menu.changemodealert;
            d.style.display = 'block';
            d.count.innerHTML = itemcount;
            d.mode.innerHTML = mode2str[tom];
            d.tk = tk;
            d.tom = tom;
            return;
        }
    }
    bbj.tkchangemode(tk, tom);
    menu_hide();
}

