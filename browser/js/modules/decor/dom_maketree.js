/**
 * ===BASE===// decor // dom_maketree.js
 * @param 
 */

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

