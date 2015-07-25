/**
 * @param holder
 * @param pp
 */

function make_radiobutton(holder,pp)
{
    var ip=dom_create('input',holder);
    ip.type='radio';
    ip.setAttribute('name',pp.name);
    ip.setAttribute('id',pp.id);
    ip.setAttribute('value',pp.value);
    ip.addEventListener('change',pp.call,false);
    var lb=dom_create('label',holder);
    lb.style.marginLeft=5;
    lb.innerHTML=pp.label;
    lb.setAttribute('for',pp.id);
    if(pp.linebreak) {
        dom_create('br',holder);
    }
    return ip;
}