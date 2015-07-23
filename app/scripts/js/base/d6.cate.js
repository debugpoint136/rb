/**
 * Created by dpuru on 2/27/15.
 */
/* __cate__ categorical track */

function cateInfo_copy(fromobj, toobj) {
    /* args are cateInfo hash */
    for (var k in fromobj) {
        toobj[k] = [fromobj[k][0], fromobj[k][1]];
    }
    toobj[-1] = ['no information', 'transparent'];
}
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
function cateCfg_show(tkobj, showcateid, disablecc) {
    if (!tkobj.cateInfo) {
        print2console('not categorical??', 2);
        return;
    }
    menu.catetkobj = tkobj;
    var lst = ['<table cellspacing=3 style="color:inherit;">'];
    for (var i in tkobj.cateInfo) {
        if (i == -1) continue;
        var t = tkobj.cateInfo[i];
        lst.push('<tr><td>' + (showcateid ? i : '') + '</td><td class=squarecell itemidx=' + i +
        (disablecc ? '' : ' onclick="cateTkitemcolor_initiate(event)"') +
        ' style="background-color:' + t[1] + ';"></td><td>' + t[0] + '</td></tr>');
    }
// restore button is only shown for native hmtk
    if (tkobj.ft == FT_cat_n) {
        lst.push('<tr><td colspan=3 style="padding-left:20px"><button type=button onclick=menu_update_track(35)>Restore color settings</button></td></tr>');
    }
    if (!showcateid) {
        lst.push('<tr><td colspan=3 style="padding-left:20px;"><button type=button onclick=cateCfg_showcateid(event)>Show category id</button></td></tr>');
    }
    lst.push('</table>');
    menu.c13.innerHTML = lst.join('');
    menu.c13.style.display =
        menu.c14.style.display = 'block';
    menu.c14.unify.style.display = 'none';
}

function cateCfg_showcateid(event) {
    event.target.style.display = 'none';
    cateCfg_show(menu.catetkobj, true);
}


function cateTkitemcolor_initiate(event) {
    /* invoking color palette for categorical track from the configuration menu
     track is identified by gflag.menu
     */
    paletteshow(event.clientX, event.clientY, 42);
    palettegrove_paint(event.target.style.backgroundColor);
    gflag.menu.catetk.itemidx = parseInt(event.target.getAttribute('itemidx'));
    gflag.menu.catetk.item = event.target;
}
function cateTkitemcolor() {
    /* change item color */
    var sto = gflag.menu.catetk;
    sto.item.style.backgroundColor = palette.output;
    menu_update_track(34);
}

function custcate_idnum_change_input() {
    var _g = apps.custtk.bbj.genome;
    var value = _g.custtk.ui_cat.category_idnum.value;
    if (value.length == 0) return;
    var num = parseInt(value);
    if (isNaN(num)) {
        print2console('Invalid number of categories', 2);
        return;
    }
    if (num <= 1) {
        print2console('There must be more than 1 categories', 2);
        return;
    }
    if (num > 40) {
        print2console('Are you sure you want ' + num + ' categories?', 2);
        return;
    }
    _g.custcate_idnum_change(num);
}

Genome.prototype.custcate_idnum_change = function (num) {
    var table = this.custtk.ui_cat.category_table;
    stripChild(table, 0);
    this.custtk.ui_cat.lst = [];
    for (var i = 0; i < num; i++) {
        var tr = table.insertRow(-1);
        tr.insertCell(0).innerHTML = i + 1;
        var td = tr.insertCell(1);
        var s = dom_create('span', td, 'padding:0px 8px;background-color:' + colorCentral.longlst[i]);
        s.className = 'squarecell';
        s.innerHTML = '&nbsp;';
        s.addEventListener('click', custcate_color_initiate, false);
        var ip = dom_create('input', td);
        ip.type = 'text';
        ip.size = 10;
        this.custtk.ui_cat.lst.push([ip, s]);
    }
};

function custcate_color_initiate(event) {
    /* invoking color palette for cust cate in submit ui
     */
    paletteshow(event.clientX, event.clientY, 39);
    palettegrove_paint(event.target.style.backgroundColor);
    gflag.menu.catetk.item = event.target;
}
function custcate_submitui_setcolor() {
    /* change item color */
    gflag.menu.catetk.item.style.backgroundColor = palette.output;
}


/* __cate__ ends */