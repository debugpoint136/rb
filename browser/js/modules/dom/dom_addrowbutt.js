/**
 * @param holder
 * @param lst
 * @param style
 * @param rowbgcolor
 * @return d <br><br><br>
 */

function dom_addrowbutt(holder,lst,style,rowbgcolor)
{
    var d=dom_create('table',holder,style);
    d.className='butt_holder';
    d.cellSpacing=0;
    var tr=d.insertRow(0);
    if(rowbgcolor) {
        tr.style.backgroundColor=rowbgcolor;
    }
    for(var i=0; i<lst.length; i++) {
        var c=lst[i];
        var td=tr.insertCell(-1);
        td.className='button';
        td.innerHTML=(c.pad?'&nbsp;':'')+c.text+(c.pad?'&nbsp;':'');
        td.addEventListener('click',c.call,false);
        if(c.attr) {
            for(var k in c.attr) {
                td[k]=c.attr[k];
            }
        }
    }
    return d;
}