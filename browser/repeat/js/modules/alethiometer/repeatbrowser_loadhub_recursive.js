/**
 * repeatbrowser_loadhub_recursive
 */


function repeatbrowser_loadhub_recursive()
{
    while(datahuburllst.length>0) {
        browser.loadhub_urljson(datahuburllst[0],repeatbrowser_loadhub_recursive_cb);
        datahuburllst.splice(0,1);
        return;
    }
    /* replace .genome.hmtk with entire set of GSM
     data.geo2track: GSM as key, hmtk track name as value
     geo2id: contains entire set of GSM used in repeatbrowser
     */
    var newhash={};
    for(var n in browser.genome.hmtk) {
        var t=browser.genome.hmtk[n];
        if(!t.geolst) continue;
        for(var i=0; i<t.geolst.length; i++) {
            var gsm=t.geolst[i];
            if(!(gsm in geo2id)) continue;
            var gid=geo2id[gsm];
            t.label=id2geo[gid].label;
            newhash[gsm]=t;
            geoid2realtrack[gid]=n;
            realtrack2geoid[n]=gid;
        }
    }
    browser.genome.hmtk=newhash;
    browser.move.styleLeft=0;
    browser.hmdiv.style.left=0;
    pagemask();
    browser.ajax_addtracks_names(geopreload.split(','));
}