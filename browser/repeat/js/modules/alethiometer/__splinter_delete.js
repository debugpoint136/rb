/**
 * __splinter__
 * @param event
 */

function __splinter_delete(event)
{
    var tag=gflag.browser.splinterTag;
    var d=document.getElementById('splinter_'+tag);
    d.parentNode.removeChild(d);
    delete browser.splinters[tag];
    delete horcrux[tag];
}