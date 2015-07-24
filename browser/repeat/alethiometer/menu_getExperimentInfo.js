/**
 * @param geoid
 * @param x - optional
 * @param y - optional
 */

function menu_getExperimentInfo(geoid, x,y)
{
// x,y are optional
    if(x!=undefined) {
        menu_show(0, x,y);
    }
    menu_shutup();
    browser.tkinfo_show(id2geo[geoid].acc);
}