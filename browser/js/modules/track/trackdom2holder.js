/**
 * ===BASE===// track // trackdom2holder.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.trackdom2holder = function () {
    /* track dom elements (canvas or labels) insert to holder
     */
    var inghmlst = [], outghmlst = [], hidden = [];
    for (var i = 0; i < this.tklst.length; i++) {
        var tk = this.tklst[i];
        if (tkishidden(tk)) {
            hidden.push(tk);
            continue;
        }
        if (tk.where == 1) {
            inghmlst.push(tk);
            if (this.hmdiv && tk.canvas) this.hmdiv.appendChild(tk.canvas);
            if (this.mcm && tk.atC) {
                this.mcm.tkholder.appendChild(tk.atC);
                tk.atC.style.display = 'block';
            }
            if (this.hmheaderdiv && tk.header) this.hmheaderdiv.appendChild(tk.header);
        } else {
            outghmlst.push(tk);
            if (this.decordiv && tk.canvas) this.decordiv.appendChild(tk.canvas);
            if (tk.atC) tk.atC.style.display = 'none';
            if (this.decorheaderdiv && tk.header) this.decorheaderdiv.appendChild(tk.header);
        }
    }
    inghmlst = inghmlst.concat(outghmlst);
    inghmlst = inghmlst.concat(hidden);
    this.tklst = inghmlst;
    this.trackHeightChanged();
};


