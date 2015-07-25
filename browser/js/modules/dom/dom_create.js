/**
 * Create DOM
 */

function dom_create(tag,holder,style,p)
{
    var d=document.createElement(tag);
    if(holder) {
        holder.appendChild(d);
    } else {
        document.body.appendChild(d);
    }
    if(style) {
        d.setAttribute('style',style);
    }
    if(p) {
        if(p.c) d.className=p.c;
        if(p.t) d.innerHTML=p.t;
        if(p.clc) d.onclick=p.clc;
        if(p.title) d.title=p.title;
    }
    return d;
}