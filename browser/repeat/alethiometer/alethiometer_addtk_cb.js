/**
 * alethiometer_addtk Callback : the json 'data' use geo accession as key
 so track name must be converted to geo to retrieve data
 * @param data
 * @param geoacclst
 */


function alethiometer_addtk_cb(data,geoacclst)
{
    /* the json 'data' use geo accession as key
     so track name must be converted to geo to retrieve data
     */
    for(var i=0; i<browser.tklst.length; i++) {
        var t=browser.tklst[i];
        if(t.geoid in data) {
            // this is a new track
            t.data=data[t.geoid];
            t.canvas.oncontextmenu=menu_bigmap;
            t.header.oncontextmenu=menu_track_bigmap;
        }
    }
    browser.initiateMdcOnshowCanvas();
    drawBigmap(true);
    /* this is because removing track is sukn-native
     will shrink bigmap height
     so when any tracks are added the bigmap height is restored
     */
    browser.hmdiv.parentNode.style.height=
        browser.mcm.tkholder.parentNode.style.height=document.body.clientHeight-200;
    if(gflag.menu.context==undefined) {
        browser.generateTrackselectionLayout(0);
    } else {
        browser.aftertkaddremove(geoacclst);
    }
    loading_done();
}