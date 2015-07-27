/**
 * ===BASE===// tks // showcurrenttrack4select.js
 * @param __Browser.prototype__
 * @param 
 */

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