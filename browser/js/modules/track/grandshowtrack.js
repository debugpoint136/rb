/**
 * ===BASE===// track // grandshowtrack.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.grandshowtrack = function () {
    gflag.menu.bbj = this;
    if (!this.header) {
        menu.grandadd.says.style.display =
            menu.grandadd.pubh.style.display =
                menu.grandadd.cust.style.display = 'block';
    } else {
        menu.grandadd.says.style.display = this.header.no_number ? 'none' : 'block';
        menu.grandadd.pubh.style.display = this.header.no_publichub ? 'none' : 'block';
        menu.grandadd.cust.style.display = this.header.no_custtk ? 'none' : 'block';
        if (this.header.no_number) return;
    }
    var tmp = this.tkCount();
    var total = tmp[0],
        ctotal = tmp[1];
    var show = 0;
    var cshow = 0;
    for (var i = 0; i < this.tklst.length; i++) {
        var t = this.tklst[i];
        if (tkishidden(t)) continue;
        if (t.name in this.genome.decorInfo) continue;
        if (this.weaver && !this.weaver.iscotton) {
            // is target bbj
            if (t.cotton && t.ft != FT_weaver_c) continue;
            // is cottontk, skip
        }
        show++;
        if (!t.public && isCustom(t.ft)) {
            cshow++;
        }
    }
    var s = menu.grandadd.says;
    if (total == 0) {
        s.style.display = 'none';
    } else {
        s.style.display = 'block';
        stripChild(s, 0);
        var t = dom_create('table', s);
        var tr = t.insertRow(0);
        var td = tr.insertCell(0);
        td.vAlign = 'top';
        dom_create('span', td, 'font-size:250%;font-weight:bold;').innerHTML = total;
        td = tr.insertCell(1);
        td.vAlign = 'top';
        td.style.paddingTop = 5;
        td.innerHTML = '<span style="opacity:.6;font-size:70%;">TOTAL</span> / <span style="font-weight:bold;font-size:normal">' + show + '</span> <span style="opacity:.6;font-size:70%;">SHOWN</span>';
        dom_create('div', s, 'font-size:70%;opacity:.6;').innerHTML = 'CLICK FOR TRACK TABLE';
    }
    menu.grandadd.custtkcount.innerHTML = ctotal > 0 ? '(' + ctotal + ')' : '';
    if (this.weaver) {
        stripChild(menu.c32, 0);
        menu.c32.style.display = 'block';
        if (this.weaver.iscotton) {
            dom_create('div', menu.c32, 'background-color:#858585;color:white;text-align:center;').innerHTML = 'tracks from ' + this.genome.name;
        } else if (this.weaver.q) {
            // need to see if cotton genome is ansible, if so, no tracks
            var d = dom_create('div', menu.c32, 'padding:15px;border-top:1px solid #ccc;');
            dom_addtext(d, 'Show tracks for:').style.opacity = '0.7';
            for (var n in this.weaver.q) {
                dom_create('div', d, 'margin:10px;padding:5px;display:inline-block;', {
                    c: 'header_g',
                    t: n,
                    clc: weaver_showgenometk_closure(n)
                });
            }
        }
    }
};

