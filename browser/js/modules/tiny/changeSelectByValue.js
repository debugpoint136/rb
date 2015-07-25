/**
 * change .selectedIndex of a <select> by given value
 * return 1 for success, -1 for failure
 * first argument could be string (<select> id), or dom object
 */

function changeSelectByValue(arg, value) {
    /* change .selectedIndex of a <select> by given value
     return 1 for success, -1 for failure
     first argument could be string (<select> id), or dom object
     */
    var s = arg;
    if (typeof(s) == "string") {
        s = document.getElementById(arg);
        if (s == undefined)
            return -1;
    }
    if (s.tagName != 'SELECT') {
        print2console('changeSelectByValue: target object is not <select>', 2);
        return -1;
    }
    var lst = s.options;
    for (var i = 0; i < lst.length; i++) {
        if (lst[i].value == value) {
            s.selectedIndex = i;
            return 1;
        }
    }
    return -1;
}