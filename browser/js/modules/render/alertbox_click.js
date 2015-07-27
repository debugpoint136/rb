/**
 * ===BASE===// render // alertbox_click.js
 * @param 
 */

function alertbox_click(event) {
    menu_blank();
    menu_show(0, event.clientX, event.clientY);
    for (var i = 0; i < alertbox.messages.length; i++) {
        var m = alertbox.messages[i];
        var d = dom_create('div', menu.c32, 'margin:10px;padding:5px 10px;border-left:solid 2px ' + m.bgcolor);
        d.innerHTML = m.text;
        if (m.refreshcachehandle) {
            d.appendChild(m.refreshcachehandle);
        }
    }
    alertbox.style.display = 'none';
    alertbox.innerHTML = 0;
    alertbox.messages = [];
}


