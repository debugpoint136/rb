/**
 * @param holder
 * @param text
 * @param call
 * @param style
 * @return b <br><br><br>
 */

function dom_addbutt(holder,text,call,style)
{
    var b=dom_create('button',holder,style);
    b.type='button';
    b.innerHTML=text;
    if(call) {
        b.addEventListener('click',call,false);
    }
    return b;
}

