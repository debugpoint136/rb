/**
 * make or re-make mcm holder table according to contents in _browser.mcm.lst
 write metadata categories vertically, check metadata voc tree checkboxes, only do once
 * __Browser.prototype__
 */

Browser.prototype.initiateMdcOnshowCanvas = function () {

    if (!this.mcm || !this.mcm.holder) return;
    var holder = this.mcm.holder;
    stripChild(holder.firstChild.firstChild, 0); // table-tbody-tr
    var terms = this.mcm.lst;
    if (terms.length == 0) {
        if (gflag.mdlst.length == 0) {
            // no md
            return;
        }
        // no term, make clickable blank
        var c = makecanvaslabel({str: 'add terms', color: colorCentral.foreground_faint_5, bottom: true});
        c.title = 'Click to add metadata terms to metadata color map';
        c.className = 'tkattrnamevcanvas';
        c.onclick = button_mcm_invokemds;
        holder.firstChild.firstChild.insertCell(-1).appendChild(c);
        this.mcmPlaceheader();
        return;
    }
    holder.style.width = tkAttrColumnWidth * terms.length;
    for (var i = 0; i < terms.length; i++) {
        var s = terms[i];
        var voc = gflag.mdlst[s[1]];
        var c = makecanvaslabel({str: (s[0] in voc.idx2attr ? voc.idx2attr[s[0]] : s[0]), bottom: true});
        c.className = 'tkattrnamevcanvas';
        c.termname = s[0];
        c.mdidx = s[1];
        c.onclick = mcm_termname_click;
        c.onmousedown = mcm_termname_MD;
        c.oncontextmenu = menu_mcm_header;
        holder.firstChild.firstChild.insertCell(-1).appendChild(c);
    }
    this.mcmPlaceheader();
};