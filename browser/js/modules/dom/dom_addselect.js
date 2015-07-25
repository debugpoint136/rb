/**
 * @param holder
 * @param call
 * @param options
 * @return s <br><br><br>
 */

function dom_addselect(holder,call,options)
{
    var s=dom_create('select',holder);
    if(call) {
        s.addEventListener('change',call,false);
    }
    for(var i=0; i<options.length; i++) {
        var o=dom_create('option',s);
        o.value=options[i].value;
        o.text=options[i].text;
        if(options[i].selected) {
            o.selected=true;
        }
    }
    return s;
}