/**
 * @param key
 */

function view_gg(key)
{
    for(var k in apps.gg.view) {
        apps.gg.view[k].main.style.display='none';
        apps.gg.view[k].handle.style.display='inline-block';
    }
    apps.gg.view[key].main.style.display='block';
    apps.gg.view[key].handle.style.display='none';
}