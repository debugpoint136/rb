/**
 * ===BASE===// svg // show_genome_info.js
 * @param 
 */

function show_genome_info(data) {
    if (!data) {
        menu_hide();
        print2console('Please try again!', 2);
        return;
    }
    var lst = data.info.split('|');
    menu_blank();
    var t = dom_create('table', menu.c32);
    t.style.margin = 10;
    for (var i = 0; i < lst.length; i += 2) {
        var tr = t.insertRow(-1);
        tr.insertCell(0).innerHTML = lst[i];
        tr.insertCell(1).innerHTML = lst[i + 1];
    }
}

