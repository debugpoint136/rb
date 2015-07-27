/**
 * ===BASE===// preqtc // tkinfo_print.js
 * @param 
 */

function tkinfo_print(hash, holder) {
// make a row to hold text1 and text2 in two <td>
    var i = 0;
    var table = dom_create('table', holder);
    for (var key in hash) {
        var color = (i % 2) ? colorCentral.foreground_faint_1 : '';
        i++;
        var tr = table.insertRow(-1);
        var td = tr.insertCell(0);
        td.style.fontSize = "12px";
        td.style.backgroundColor = color;
        td.innerHTML = key.replace(/\_/g, " ");
        tr.appendChild(td);
        td = tr.insertCell(1);
        td.style.fontSize = "12px";
        td.style.backgroundColor = color;
        td.innerHTML = hash[key];
    }
    if (i > 20) {
        holder.style.overflowY = 'scroll';
        holder.style.height = 200;
    }
}


