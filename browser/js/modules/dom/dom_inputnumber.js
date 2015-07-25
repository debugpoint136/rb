/**
 * @param holder
 * @param p
 * @return i <br><br><br>
 */

function dom_inputnumber(holder,p)
{
    var i=dom_create('input',holder);
    i.type='number';
    i.style.width=p.width?p.width:50;
    i.value=p.value;
    if(p.call) {
        i.addEventListener('keyup',p.call,false);
    }
    return i;
}