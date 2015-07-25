/**
 * __splinter_svg__ Call back
 */

function __splinter_svg_cb(key,d)
{
    menu_shutup();
    menu.c32.style.display='block';
    menu.c32.innerHTML='<div style="margin:10px;"><a href="/browser/t/'+key+'" target=_blank>Link to SVG file</a></div>';
    menu_show_beneathdom(0,d);
}