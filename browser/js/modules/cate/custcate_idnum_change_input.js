/**
 * ===BASE===// cate // custcate_idnum_change_input.js
 * @param 
 */

function custcate_idnum_change_input() {
    var _g = apps.custtk.bbj.genome;
    var value = _g.custtk.ui_cat.category_idnum.value;
    if (value.length == 0) return;
    var num = parseInt(value);
    if (isNaN(num)) {
        print2console('Invalid number of categories', 2);
        return;
    }
    if (num <= 1) {
        print2console('There must be more than 1 categories', 2);
        return;
    }
    if (num > 40) {
        print2console('Are you sure you want ' + num + ' categories?', 2);
        return;
    }
    _g.custcate_idnum_change(num);
}

