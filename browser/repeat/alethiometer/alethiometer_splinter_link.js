/**
 * __splinter__
 * @param key
 * @param d
 */

Browser.prototype.alethiometer_splinter_link=function(key,d)
{
    menu_shutup();
    menu.c32.style.display='block';
    menu.c32.innerHTML='<div style="margin:10px;"><a href='+url_base+'?genome='+this.genome.name+'&datahub_jsonfile='+url_base+'t/'+key+' target=_blank>Click this link to view in WashU EpiGenome Browser</a></div>';
    menu_show_beneathdom(0,d);
};