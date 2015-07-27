/**
 * ===BASE===// cate // custcate_idnum_change.js
 * @param __Genome.prototype__
 * @param 
 */

Genome.prototype.custcate_idnum_change = function (num) {
    var table = this.custtk.ui_cat.category_table;
    stripChild(table, 0);
    this.custtk.ui_cat.lst = [];
    for (var i = 0; i < num; i++) {
        var tr = table.insertRow(-1);
        tr.insertCell(0).innerHTML = i + 1;
        var td = tr.insertCell(1);
        var s = dom_create('span', td, 'padding:0px 8px;background-color:' + colorCentral.longlst[i]);
        s.className = 'squarecell';
        s.innerHTML = '&nbsp;';
        s.addEventListener('click', custcate_color_initiate, false);
        var ip = dom_create('input', td);
        ip.type = 'text';
        ip.size = 10;
        this.custtk.ui_cat.lst.push([ip, s]);
    }
};

