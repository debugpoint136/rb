/**
 * always invoked on a single track
 */

function menu_getExperimentInfo_2()
{
// always invoked on a single track
    var tk=gflag.menu.tklst[0];
    if(gflag.menu.bbj.splinterTag) {
        // on a real browser track in splinter
        // risky way to detect whether it is assay track
        if(tk.name in gflag.menu.bbj.genome.decorInfo) {
            menu_shutup();
            menuGetonetrackdetails(tk.name);
            return;
        }
        gflag.menu.x=parseInt(menu.style.left);
        gflag.menu.y=parseInt(menu.style.top);
        get_file_info(tk.name);
    } else {
        // on a bigmap track
        menu_getExperimentInfo(tk.geoid);
    }
}