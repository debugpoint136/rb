/**
 * if what==0, strip all children
 * @param holder
 * @param what
 */

function stripChild(holder, what) {
// if what==0, strip all children
    var L = holder.childNodes.length;
    if (what == 0) {
        while (holder.hasChildNodes())
            holder.removeChild(holder.lastChild);
    } else {
        for (var i = what; i < L; i++)
            holder.removeChild(holder.lastChild);
    }
}