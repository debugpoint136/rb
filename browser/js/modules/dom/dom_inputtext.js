/**
 * @param holder
 * @param p
 * @return i <br><br><br>
 */

function dom_inputtext(holder,p)
{
    var i=dom_create('input',holder);
    i.type='text';
    i.size=p.size?p.size:10;
    if(p.ph) {
        i.placeholder=p.ph;
    }
    if(p.call) {
        i.addEventListener('keyup',p.call,false);
    }
    return i;
}