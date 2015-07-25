/**
 * make_subfamhandle
 * @param subfamid
 */

function make_subfamhandle(subfamid) {
    var h=document.createElement('table');
    h.cellSpacing=0;
    h.className='subfamhandle';
    h.subfamid=subfamid;
    var tr=h.insertRow(0);
    var td=tr.insertCell(0);
    td.innerHTML='&nbsp;'+id2subfam[subfamid].name+'&nbsp;';
    td=tr.insertCell(1);
    td.className='handlebutt';
    td.innerHTML='&#8505;';
    td.addEventListener('click',subfamhandle_click,false);
    return h;
}