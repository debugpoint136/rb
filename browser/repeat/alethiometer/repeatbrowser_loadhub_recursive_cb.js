/**
 * repeatbrowser_loadhub_recursive Callback
 */

function repeatbrowser_loadhub_recursive_cb()
{
    var lst=browser.init_bbj_param?browser.init_bbj_param.tklst:null;
    if(lst) {
        for(var i=0; i<lst.length; i++) {
            browser.genome.registerCustomtrack(lst[i]);
        }
    }
    delete browser.init_bbj_param;
    pagemask();
    repeatbrowser_loadhub_recursive();
}