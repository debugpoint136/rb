/**
 * @param holder
 * @return t <br><br><br>
 */

function make_headertable(holder)
{
    var t=dom_create('div',holder,'display:table;background-color:'+colorCentral.background_faint_7+';border-top:solid 1px '+colorCentral.magenta7);
    t._h=dom_create('div',t,'text-align:center;margin:8px 20px;padding:5px 0px 10px;border-bottom:solid 1px '+colorCentral.magenta2);
    t._c=dom_create('div',t,'padding:20px;');
    return t;
}