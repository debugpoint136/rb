/**
 * @param param
 * @return d <br><br><br>
 */

function make_slidingtable(param)
{
    var d=dom_create('div',param.holder,'overflow:hidden;padding:5px;');
    var table=dom_create('table',d);
    table.cellPadding=table.cellSpacing=0;
    var tr=table.insertRow(0);
// 1-1
    var td=tr.insertCell(0);
    d.leadingcell=td;
// 1-2
    td=tr.insertCell(1);
    var d2=dom_create('div',td,'position:relative;overflow:hidden;width:'+param.hscroll.width+'px;height:'+param.hscroll.height+'px;');
    var d3=dom_create('div',d2,'position:absolute;left:0px;top:0px;');
    d.hscroll=d3;
    tr=table.insertRow(1);
// 2-1
    td=tr.insertCell(0);
    d2=dom_create('div',td,'position:relative;overflow:hidden;width:'+param.vscroll.width+'px;height:'+param.vscroll.height+'px;');
    d3=dom_create('div',d2,'position:absolute;left:0px;top:0px;');
    d.vscroll=d3;
// 2-2
    td=tr.insertCell(1);
    d2=dom_create('div',td,'position:relative;overflow:hidden;width:'+param.hscroll.width+'px;height:'+param.vscroll.height+'px;');
    d2.addEventListener('mousedown',slidingtableMD,false);
    d2.slidingtable=d;
    d3=dom_create('div',d2,'position:absolute;left:0px;top:0px;');
    d.scroll=d3;
    return d;
}

