/**
 * @param filename
 */

function get_file_info(filename)
{
    browser.ajax('repeatbrowser=on&getfileinfo='+filename+'&rpbrDbname='+infodb,function(data){
        menu_shutup();
        menu_show(0, gflag.menu.x, gflag.menu.y);
        menu.infowrapper.style.display='block';
        stripChild(menu.infowrapper,0);
        var x={};
        tkinfo_parse(data.text,x);
        browser.tkinfo_show_do({details:x});
    });
}