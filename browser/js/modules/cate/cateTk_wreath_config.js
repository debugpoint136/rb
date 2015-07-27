/**
 * ===BASE===// cate // cateTk_wreath_config.js
 * @param 
 */

function cateTk_wreath_config(tkn) {
    /* wrapper, configuring a wreath track, viewidx is given by chiapet.viewidx */
    gflag.cateTk.which = 4;
    gflag.cateTk.chiapetvidx = chiapet.viewidx;
    var lst = chiapet.datalst[chiapet.viewidx].wreath;
    for (var i = 0; i < lst.length; i++) {
        if (lst[i].name == tkn) {
            gflag.cateTk.wreathidx = i;
            cateCfg_show({ft: lst[i].filetype, name: tkn, label: lst[i].label, cateInfo: lst[i].cateInfo}, false);
            return;
        }
    }
    fatalError('cateTk_wreath_config: track not found ' + tkn);
}
