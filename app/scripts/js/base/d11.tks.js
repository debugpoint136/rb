/**
 * Created by dpuru on 2/27/15.
 */

/*** __tks__ track select panel ***/

Browser.prototype.decor_invoketksp = function () {
    /* called by clicking grandadd > add decor option, to add decor into main panel
     the menu must have already been shown
     */
    var d = this.genome.decorInfo;
    for (var n in d) {
        if (d[n].tksentry) {
            d[n].tksentry.className = 'tkentry';
        }
    }
// disable decors already in collection
    for (var i = 0; i < this.tklst.length; i++) {
        var tk = this.tklst[i];
        if (tk.name in d) {
            if (tk.cotton) {
                if (tk.cotton != this.genome.name) continue;
            }
            // custom tk do not have tksentry
            var ent = d[tk.name].tksentry;
            if (ent) ent.className = 'tkentry_inactive';
        }
    }
    menu_shutup();
    menu.decorcatalog.style.display = 'block';
    stripChild(menu.decorcatalog, 0);
    menu.decorcatalog.appendChild(this.genome.tablist_decor);
    gflag.menu.context = 12;
    if (this.weaver && this.weaver.iscotton) {
        stripChild(menu.c32, 0);
        menu.c32.style.display = 'block';
        dom_create('div', menu.c32, 'background-color:#858585;color:white;text-align:center;').innerHTML = 'tracks from ' + this.genome.name;
    }
};


function decorgrp_click(event) {
    /* clicking decor group tab in tkspanel
     event.target is <div> that tab, will switch decor child panels
     try to evade use of global_browser
     */
// turn off all grp tabs
    var lst = event.target.parentNode.childNodes;
    for (var i = 0; i < lst.length; i++) {
        lst[i].style.backgroundColor = '';
    }
// turn off all children panels
    lst = event.target.parentNode.parentNode.nextSibling.childNodes;
    for (i = 0; i < lst.length; i++)
        lst[i].style.display = 'none';
// turn on the one clicked
    event.target.style.backgroundColor = colorCentral.magenta2;
    var grp = event.target.getAttribute('grpname');
    for (i = 0; i < lst.length; i++) {
        if (lst[i].getAttribute('grpname') == grp) {
            lst[i].style.display = 'block';
            return;
        }
    }
}


Browser.prototype.showcurrenttrack4select = function (callback, ft_filter) {
    /* list tracks for selection
     * currently displayed
     * custom tracks but not those in public hub
     * apply ft filter
     menu_show must already been called
     */
    var lst = [];
    for (var i = 0; i < this.tklst.length; i++) {
        var t = this.tklst[i];
        if (t.ft in ft_filter) {
            lst.push(t);
        }
    }
    if (lst.length == 0) {
        menu.c1.style.display = 'block';
        menu.c1.innerHTML = 'No tracks available';
        return;
    }
    this.showhmtkchoice({lst: lst, call: callback, allactive: true, hidebuttholder: true});
};

/*** __tks__ ends ***/