/**
 * ===BASE===// menu // config_hammock.js
 * @param 
 */

function config_hammock(tk) {
    /* not density
     can be nested inside other tracks that derives from hammock format
     */
    fontpanel_set(tk);
    if (tk.mode == M_bar) {
        menu.c14.style.display = 'block';
        menu.c14.unify.style.display = 'none';
    }
    if (tk.cateInfo) {
        // TODO text color is same as item color
        menu.font.color.style.display = 'none';
        menu.bed.style.display = 'none';
        cateCfg_show(tk, false, true);
    } else {
        // all items have same color, separate color for item/text
        menu.font.color.style.display = 'inline';
        menu.bed.style.display = 'block';
        menu.bed.color.style.backgroundColor = tk.qtc.bedcolor;
    }
    if (tk.showscoreidx != undefined) {
        menu.c48.style.display = 'block';
        stripChild(menu.c48, 0);
        var n = Math.random().toString();
        dom_create('div', menu.c48, 'opacity:0.5;margin-bottom:8px;').innerHTML = 'Apply score';
        if (tk.group != undefined) {
            dom_create('div', menu.c48, 'margin:5px 5px 15px 5px;padding:5px;background-color:rgba(255,204,51,.5);font-size:70%;text-align:center;', {t: 'This track shares Y scale with other tracks.'});
        }
        for (var i = -1; i < tk.scorenamelst.length; i++) {
            var d0 = dom_create('div', menu.c48);
            var ip = dom_create('input', d0);
            ip.type = 'radio';
            ip.setAttribute('name', n);
            ip.id = n + (i == -1 ? 'n' : i);
            ip.checked = tk.showscoreidx == i;
            ip.idx = i;
            ip.addEventListener('change', menu_hammock_choosescore, false);
            var lb = dom_create('label', d0);
            lb.setAttribute('for', ip.id);
            lb.innerHTML = ' ' + (i == -1 ? 'do not use score' : tk.scorenamelst[i]);
            if (i != -1) {
                var d = dom_create('div', menu.c48, null, {c: 'menushadowbox'});
                d.style.display = i == tk.showscoreidx ? 'block' : 'none';
                var scale = tk.scorescalelst[i];
                var tt;
                if (scale.min_fixed != undefined) {
                    tt = 'auto (min set at ' + scale.min_fixed + ')';
                } else if (scale.max_fixed != undefined) {
                    tt = 'auto (max set at ' + scale.max_fixed + ')';
                } else {
                    tt = 'automatic scale';
                }
                dom_addselect(d, menu_hammock_changescale,
                    [{text: tt, value: scale_auto, selected: scale_auto == scale.type},
                        {text: 'fixed scale', value: scale_fix, selected: scale_fix == scale.type}]);
                var d2 = dom_create('div', d);
                d2.style.display = scale.type == scale_fix ? 'block' : 'none';
                dom_addtext(d2, 'min: ');
                dom_inputnumber(d2, {width: 50, value: scale.min});
                dom_addtext(d2, ' max: ');
                dom_inputnumber(d2, {width: 50, value: scale.max});
                dom_addbutt(d2, 'set', menu_hammock_setfixscale);
            }
        }
    }
}

