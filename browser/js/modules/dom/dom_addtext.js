/**
 * @param holder
 * @param text
 * @param color
 * @param cls
 * @return s <br><br><br>
 */

function dom_addtext(holder,text,color,cls)
{
    var s=dom_create('span',holder);
    if(text)
        s.innerHTML=text;
    if(color)
        s.style.color=color;
    if(cls)
        s.className=cls;
    return s;
}