/**
 * Created by dpuru on 2/27/15.
 */
function tkentry_click(event) {
    /* clicking on a track entry in menu list, accumulates selected ones
     the item (list) should always be hosted in one of the panels in menu:
     - facet tklst table
     - general purpose track selection panel, for all types of tracks that are currently on show
     including hmtk and decor
     */
    var bbj = gflag.menu.bbj;
    var add = false;
    if (event.target.className == 'tkentry') {
        event.target.className = 'tkentry_onfocus';
        add = true;
    } else if (event.target.className == 'tkentry_onfocus') {
        event.target.className = 'tkentry';
    }
    var tkname = event.target.tkname;
    var tkobj = bbj.findTrack(tkname);
    var ft = null, tknameurl = null;
    /* notice: display object can be missing
     in case of facet track selection
     */
    if (tkobj != null) {
        ft = tkobj.ft;
        tknameurl = isCustom(ft) ? tkobj.url : tkname;
    }
    var butt = menu.facettklstdiv.submit;
    var s = butt.count;
    butt.count += add ? 1 : -1;
    if (butt.count == 0) {
        butt.style.display = 'none';
    } else {
        butt.innerHTML = 'Add ' + butt.count + ' track' + (butt.count > 1 ? 's' : '');
        butt.style.display = 'inline';
    }
}


/* __decor__ good old decor tk */

function decorJson_parse(val, hash) {
    if (Array.isArray(val)) {
        for (var i = 0; i < val.length; i++) {
            hash[val[i].name] = val[i];
        }
    } else {
        for (var k in val) {
            decorJson_parse(val[k], hash);
        }
    }
}

function decorTrackcell_make(tk, holder) {
    tk.tksentry = dom_addtkentry(2, holder, false, tk, tk.label, decortkentry_click);
}

function dom_maketree(val, holder, makecell) {
    if (!val) return;
    if (Array.isArray(val)) {
        for (var i = 0; i < val.length; i++) {
            makecell(val[i], holder);
        }
    } else {
        var tabs = [];
        for (var n in val) {
            tabs.push(n);
        }
        var t = make_tablist({lst: tabs});
        t.style.margin = '';
        holder.appendChild(t);
        for (var i = 0; i < tabs.length; i++) {
            dom_maketree(val[tabs[i]], t.holders[i], makecell);
        }
    }
}

function decortkentry_click(event) {
    if (event.target.className == 'tkentry_inactive') return;
    event.target.className = 'tkentry_inactive';
    var bbj = gflag.menu.bbj;
    if (bbj.trunk) bbj = bbj.trunk;
    bbj.adddecorparam([event.target.tkobj.name]);
    bbj.ajax_loadbbjdata(bbj.init_bbj_param);
}

Browser.prototype.adddecorparam = function (names) {
    var lst = [];
    for (var i = 0; i < names.length; i++) {
        var o = this.genome.decorInfo[names[i]];
        if (!o) {
            print2console('Unrecognized native track: ' + names[i], 2);
            continue;
        }
        var o2 = duplicateTkobj(o);
        o2.mode = o.defaultmode ? o.defaultmode : tkdefaultMode(o);
        // XXXb
        if (names[i].indexOf('snp') != -1) {
            var v = this.getDspStat();
            if (v[0] == v[2]) {
                if (v[3] - v[1] >= 20000) {
                    o2.mode = M_den;
                }
            } else {
                o2.mode = M_den;
            }
        }
        lst.push(o2);
    }
    if (lst.length == 0) return;
    if (!this.init_bbj_param) {
        this.init_bbj_param = {tklst: []};
    }
    /* is there a track list in init_bbj_param?
    * no? let's create it */
    if (!this.init_bbj_param.tklst) {
        this.init_bbj_param.tklst = [];
    }
    /* now take the list created at the beginning of this function
    * and merge the whole thing into init_bbj_param's track list */
    this.init_bbj_param.tklst = this.init_bbj_param.tklst.concat(lst);
};


/* __decor__ ends */

