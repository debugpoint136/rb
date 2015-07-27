/**
 * ===BASE===// misc // app_showseq.js
 * @param 
 */

function app_showseq(data, coordlst) {
    menu.apppanel.getseq.butt.disabled = false;
    if (!data || !data.lst) {
        print2console('Error retrieving sequence, please try again.', 2);
        return;
    }
    menu.apppanel.getseq.main.style.display = 'none';
    menu.c32.style.display = 'block';
    stripChild(menu.c32, 0);
    var d = dom_create('div', menu.c32, 'width:500px;margin:15px;');
    for (var i = 0; i < data.lst.length; i++) {
        dom_create('div', d, 'opacity:.7').innerHTML = '>' + coordlst[i];
        dom_create('div', d, 'word-wrap:break-word;font-family:Courier;font-size:80%;').innerHTML = data.lst[i];
    }
    placePanel(menu);
}
/** __misc__ */