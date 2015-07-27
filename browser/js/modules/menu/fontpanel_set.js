/**
 * ===BASE===// menu // fontpanel_set.js
 * @param 
 */

function fontpanel_set(tk) {
    menu.font.style.display = 'block';
    if (tk.qtc.fontfamily) {
        var lst = menu.font.family.options;
        for (var i = 0; i < lst.length; i++) {
            if (lst[i].value == tk.qtc.fontfamily) {
                menu.font.family.selectedIndex = i;
                break;
            }
        }
    }
    if (tk.qtc.fontbold != undefined) {
        menu.font.bold.checked = tk.qtc.fontbold;
    }
    if (tk.qtc.textcolor) {
        menu.font.color.style.backgroundColor = tk.qtc.textcolor;
        menu.font.color.style.display = 'inline';
    } else {
        menu.font.color.style.display = 'none';
    }
}


