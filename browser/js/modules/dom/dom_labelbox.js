/**
 * @param p
 * @return d <br><br><br>
 */

function dom_labelbox(p)
{
    var d=dom_create('table',p.holder,'cursor:default;'+(p.style?p.style:''));
    d.className='labelbox';
    d.cellSpacing=0;
    if(p.call) {
        d.onclick=p.call;
        d.onmouseover=labelbox_mover;
        d.onmouseout=labelbox_mout;
    }
    var tr=d.insertRow(0);
    var td=tr.insertCell(0);
    td.style.padding='';
    td.style.fontSize='70%';
    td.style.opacity=.7;
    d.stext=td;
    if(p.stext) {
        td.innerHTML=p.stext;
    }
    tr=d.insertRow(1);
    td=tr.insertCell(0);
    if(!p.color) {
        p.color='#858585';
    }
    d.color=p.color;
    td.style.borderTop='2px solid '+p.color;
    td.style.padding='4px 10px';
    td.style.backgroundColor=lightencolor(colorstr2int(p.color),.7);
    d.ltext=td;
    if(p.ltext) {
        td.innerHTML=p.ltext;
    }
    return d;
}