/**
 * ===BASE===// track // removeTrackCanvas.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.removeTrackCanvas = function (tk) {
    if (tk.where == 1) {
        if (this.hmheaderdiv && tk.header) {
            try {
                this.hmheaderdiv.removeChild(tk.header);
            } catch (e) {
                print2console('stray tk header: ' + tk.label, 2);
            }
        }
        if (tk.canvas) {
            try {
                this.hmdiv.removeChild(tk.canvas);
            } catch (e) {
                print2console('stray tk canvas: ' + tk.label, 2);
            }
        }
        if (this.mcm && tk.atC) {
            try {
                this.mcm.tkholder.removeChild(tk.atC);
            } catch (e) {
                print2console('stray tk atC: ' + tk.atC, 2);
            }
        }
    } else {
        if (this.decorheaderdiv && tk.header) {
            try {
                this.decorheaderdiv.removeChild(tk.header);
            } catch (e) {
                print2console('stray tk header: ' + tk.label, 2);
            }
        }
        if (tk.canvas) {
            try {
                this.decordiv.removeChild(tk.canvas);
            } catch (e) {
                print2console('stray tk canvas: ' + tk.label, 2);
            }
        }
    }
};
