/**
 * ___scatter__ for comparing two experiments over all subfams
 */

function scatterplot_submit2()
{
    /* scatterplot
     for comparing two experiments over all subfams
     */
    var sp=apps.scp;
    if(sp.tk1==null || sp.tk2==null || sp.tk1.name==sp.tk2.name) return;
    var data1=browser.findTrack(sp.tk1.name).data;
    var data2=browser.findTrack(sp.tk2.name).data;
    var data=[];
    for(var sid in data1) {
        data.push({name:htmltext_subfaminfo(sid,true),
            subfamid:sid,
            x:data1[sid][useRatioIdx],
            y:data2[sid][useRatioIdx]});
    }
    sp.data=data;
    sp.main.__hbutt2.style.display='block';
    flip_panel(sp.ui_submit,sp.ui_figure,true);
    scatterplot_makeplot(sp);
}
