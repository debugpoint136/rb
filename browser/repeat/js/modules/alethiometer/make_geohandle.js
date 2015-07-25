/**
 * @param geoid
 * @param label
 */

function make_geohandle(geoid,label) {
    var h=document.createElement('table');
    h.cellSpacing=0;
    h.className='geohandle';
    h.geoid=geoid;
    var tr=h.insertRow(0);
    var td=tr.insertCell(0);
    td.innerHTML='&nbsp;'+(label?label:id2geo[geoid].label)+'&nbsp;';
    td=tr.insertCell(1);
    td.className='handlebutt';
    td.innerHTML='&#8505;';
    td.addEventListener('click',geohandle_click,false);
    return h;
}