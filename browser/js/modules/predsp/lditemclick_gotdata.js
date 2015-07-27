/**
 * ===BASE===// predsp // lditemclick_gotdata.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.lditemclick_gotdata = function (data, tkobj, rs1, rs2) {
    if (!data || !data.tkdatalst || data.tkdatalst.length == 0) {
        bubble.sayajax.innerHTML = 'Error fetching data, sorry...';
        return;
    }
    var t = data.tkdatalst[0].data;
    if (!t || t.length != 2) {
        bubble.sayajax.innerHTML = 'no data...';
        return;
    }
    stripChild(bubble.sayajax, 0);
    var table3 = dom_create('table', bubble.sayajax, 'color:white');
    var tr3 = table3.insertRow(0);
    var td1 = tr3.insertCell(0);
    td1.style.paddingRight = 20;
    var miss = true;
    for (var i = 0; i < t[0].length; i++) {
        var item = t[0][i];
        if (item.name == rs1) {
            var table = dom_create('table', td1, 'color:white');
            var td = table.insertRow(0).insertCell(0);
            td.colSpan = 2;
            if (tkobj.queryUrl) {
                td.innerHTML = '<a href=' + tkobj.queryUrl + rs1 + ' style="color:white" target=_blank>' + rs1 + '</a>';
            } else {
                td.innerHTML = rs1;
            }
            if (item.category != undefined && tkobj.cateInfo) {
                td = table.insertRow(-1).insertCell(0);
                td.colSpan = 2;
                var c = tkobj.cateInfo[item.category];
                td.innerHTML = '<span class=squarecell style="padding:0px 8px;background-color:' + c[1] + ';">&nbsp;</span> ' + c[0];
            }
            if (item.details) {
                for (var k in item.details) {
                    var tr = table.insertRow(-1);
                    td = tr.insertCell(0);
                    td.style.fontStyle = 'italic';
                    td.style.opacity = 0.8;
                    td.innerHTML = k;
                    td = tr.insertCell(1);
                    td.innerHTML = item.details[k];
                }
            }
            miss = false;
            break;
        }
    }
    if (miss) {
        td1.innerHTML =
            (tkobj.queryUrl ? '<a href=' + tkobj.queryUrl + rs1 + ' style="color:white" target=_blank>' + rs1 + '</a>' : rs1) +
            '<br>No data';
    }
// duplication
    var td2 = tr3.insertCell(1);
    miss = true;
    for (var i = 0; i < t[1].length; i++) {
        var item = t[1][i];
        if (item.name == rs2) {
            var table = dom_create('table', td2, 'color:white');
            var td = table.insertRow(0).insertCell(0);
            td.colSpan = 2;
            if (tkobj.queryUrl) {
                td.innerHTML = '<a href=' + tkobj.queryUrl + rs2 + '  style="color:white" target=_blank>' + rs2 + '</a>';
            } else {
                td.innerHTML = rs2;
            }
            if (item.category != undefined && tkobj.cateInfo) {
                td = table.insertRow(-1).insertCell(0);
                td.colSpan = 2;
                var c = tkobj.cateInfo[item.category];
                td.innerHTML = '<span class=squarecell style="padding:0px 8px;background-color:' + c[1] + ';">&nbsp;</span> ' + c[0];
            }
            if (item.details) {
                for (var k in item.details) {
                    var tr = table.insertRow(-1);
                    td = tr.insertCell(0);
                    td.style.fontStyle = 'italic';
                    td.style.opacity = 0.8;
                    td.innerHTML = k;
                    td = tr.insertCell(1);
                    td.innerHTML = item.details[k];
                }
            }
            miss = false;
        }
    }
    if (miss) {
        td2.innerHTML =
            (tkobj.queryUrl ? '<a href=' + tkobj.queryUrl + rs2 + ' style="color:white" target=_blank>' + rs2 + '</a>' : rs2) +
            '<br>No data';
    }
    bubble.sayajax.style.maxHeight = 1000;
};

