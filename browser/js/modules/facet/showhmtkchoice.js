/**
 * ===BASE===// facet // showhmtkchoice.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.showhmtkchoice = function (p) {
    /* arg:
     .lst: list of tk name or objects
     .selected: boolean, if true, all entries are selected by default
     .x/.y: x/y position to show menu (no scroll offset!)
     .delete: show delete buttons
     .call: direct call back
     .context: for gflag.menu.context, if .call is not provided
     .allactive: if true, make all tk available for selection
     */
    var bbj = this;
    if (apps.hmtk && apps.hmtk.main.style.display != 'none') {
        // cover the facet panel
        invisible_shield(apps.hmtk.main);
    }
    menu.facettklstdiv.submit.count = 0;
    menu.facettklstdiv.submit.style.display = 'none';
// adjust list order, put tk first that are on show
    var lst1 = [], lst2 = [];
    for (var i = 0; i < p.lst.length; i++) {
        var n = p.lst[i];
        if (typeof(n) == 'string') {
            var t = this.findTrack(n);
            if (t) lst1.push(t);
            else lst2.push(n);
        } else {
            if (this.findTrack(n.name, n.cotton)) {
                lst1.push(n);
            } else {
                lst2.push(n);
            }
        }
    }
    p.lst = lst1.concat(lst2);

    menu_shutup();
    menu.facettklstdiv.style.display = 'block';
    menu.facettklstdiv.buttholder.style.display = p.hidebuttholder ? 'none' : 'block';
    if (p.context == undefined) {
        p.context = 0;
    }
    if (p.x != undefined) {
        menu_show(p.context, p.x, p.y);
    } else {
        gflag.menu.context = p.context;
    }
    var table = menu.facettklsttable;
    stripChild(table, 0);
    if (p.lst.length <= 8) {
        table.parentNode.style.height = "auto";
        table.parentNode.style.overflowY = "auto";
    } else {
        table.parentNode.style.height = "200px";
        table.parentNode.style.overflowY = "scroll";
    }
    var showremovebutt = false;
    for (var i = 0; i < p.lst.length; i++) {
        var tk = p.lst[i];
        var tkn, obj;
        if (typeof(tk) == 'string') {
            tkn = tk;
            obj = this.genome.getTkregistryobj(tkn);
            if (!obj) {
                print2console('registry object not found for ' + tkn, 2);
                continue;
            }
        } else {
            tkn = tk.name;
            obj = tk;
        }
        var tr = table.insertRow(-1);
        var shown = false;
        if (!p.allactive) {
            shown = typeof(tk) != 'string';
        }
        var td = dom_addtkentry(1, tr, shown, obj,
            (this.weaver ? ('(' + (obj.cotton ? obj.cotton : this.genome.name) + ') ') : '') + obj.label,
            p.call ? p.call : tkentry_click);
        if (shown) {
            showremovebutt = true;
        } else {
            if (p.selected) simulateEvent(td, 'click');
        }
        td = tr.insertCell(-1);
        td.className = 'tkentrytype';
        td.innerHTML = FT2verbal[obj.ft];
        td = tr.insertCell(-1);
        td.innerHTML = '&nbsp;&#8505;&nbsp;';
        td.className = 'clb';
        td.onclick = tkinfo_show_closure(bbj, obj);
        if (p.delete) {
            td = tr.insertCell(-1);
            dom_addbutt(td, 'delete', menu_delete_custtk).tkname = tkn;
        }
    }
    table.style.display = "block";
    menu.facetremovebutt.style.display = showremovebutt ? 'inline' : 'none';
};

