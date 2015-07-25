/**
 * @param holder
 * @param label
 * @param call
 * @return t <br><br><br>
 */

function dom_addcheckbox(holder,label,call)
{
    var t=dom_create('input',holder,'margin-right:8px;');
    t.type='checkbox';
    var id=Math.random().toString();
    t.id=id;
    if(call) {
        t.addEventListener('change',call,false);
    }
    var l=dom_create('label',holder);
    l.innerHTML=label;
    l.setAttribute('for',id);
    return t;
}