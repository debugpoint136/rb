/**
 * Delete Genome graph
 * @param event
 */

function delete_gg(event)
{
    var v=apps.gg.view[event.target.key];
    apps.gg.holder.removeChild(v.main);
    apps.gg.handleholder.removeChild(v.handle);
    delete apps.gg.view[event.target.key];
    var c=document.getElementById('viewcount');
    c.innerHTML=parseInt(c.innerHTML)-1;
}