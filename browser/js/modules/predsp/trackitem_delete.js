/**
 * ===BASE===// predsp // trackitem_delete.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.trackitem_delete = function (tk, item, itemRidx) {
    for (var i = 0; i < tk.data[itemRidx].length; i++) {
        if (tk.data[itemRidx][i].id == item.id) {
            tk.data[itemRidx].splice(i, 1);
            var oldheight = tk.canvas.height;
            this.stack_track(tk, 0);
            this.drawTrack_browser(tk);
            if (tk.canvas.height != oldheight) {
                this.trackHeightChanged();
            }
            bubbleHide();
            return;
        }
    }
    print2console('Can\'t find this item!?', 2);
};

