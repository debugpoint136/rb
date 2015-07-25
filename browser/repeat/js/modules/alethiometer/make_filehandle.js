/**
 * make_filehandle
 * @param tkname
 * @param basename
 * @param totalnum
 * @param idx
 * @return h <br><br><br>
 */

function make_filehandle(tkname,basename,totalnum,idx) {
    var h=document.createElement('table');
    h.cellSpacing=0;
    h.className='filehandle';
    h.tkname=tkname;
    var tr=h.insertRow(0);
    var td=tr.insertCell(0);
    td.innerHTML='&nbsp;'+basename+(totalnum==1?'':' '+(idx+1))+'&nbsp;';
    td=tr.insertCell(1);
    td.className='handlebutt';
    td.innerHTML='&#8505;';
    td.addEventListener('click',filehandle_click,false);
    return h;
}