/**
 * ===BASE===// menu // menu_appoption.js
 * @param 
 */

function menu_appoption(holder, icon, name, desc, callback) {
    var d = dom_create('div', holder);
    d.className = 'menuactivechoice';
    d.addEventListener('click', callback, false);
    var t = dom_create('table', d, 'color:inherit;white-space:nowrap');
    var tr = t.insertRow(0);
    var td = tr.insertCell(0);
//td.className='appicon';
//td.innerHTML=icon;
    td = tr.insertCell(1);
    td.style.paddingLeft = 10;
    td.innerHTML = (desc ? '<strong>' + name + '</strong>' : name) +
    (desc ? '<br><span style="font-size:80%;opacity:0.7;">' + desc + '</span>' : '');
}

