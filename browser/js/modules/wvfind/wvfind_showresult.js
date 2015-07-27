/**
 * ===BASE===// wvfind // wvfind_showresult.js
 * @param 
 */

function wvfind_showresult(arg) {
    if (!arg.queries || !arg.rlst) return;
    var bbj = arg.bbj;
    var bbjclb = bbj.regionLst.length > 0;
    stripChild(arg.table, 0);
    var tr = arg.table.insertRow(0);
    var td = tr.insertCell(0);
    td.align = 'center';
    td.innerHTML = bbj.genome.name + (bbjclb ? ' <span style="font-size:70%">click to view in browser</span>' : '');
    for (var i = 0; i < arg.queries.length; i++) {
        td = tr.insertCell(-1);
        td.align = 'center';
        td.style.color = arg.queries[i][1];
        td.innerHTML = arg.queries[i][0];
    }
    var lst = arg.rlst;
    var width = 300;
    var maxtarget = 0;
    for (var i = 0; i < lst.length; i++) {
        maxtarget = Math.max(lst[i].stop - lst[i].start, maxtarget);
    }
    var sf = 150 / maxtarget;
    for (var i = 0; i < lst.length; i++) {
        var e = lst[i];
        tr = arg.table.insertRow(-1);
        tr.className = 'clb4';
        td = tr.insertCell(0);
        td.vAlign = 'top';
        td.align = 'right';
        if (e.isgene) {
            var s = dom_addtext(td, e.name, weavertkcolor_target, bbjclb ? 'clb' : null);
            if (bbjclb) {
                s.onclick = jump2coord_closure(bbj, e.chr, e.start, e.stop);
            }
        } else {
            var s = dom_addtext(td, e.chr + ':' + e.start + '-' + e.stop + ' <span style="font-size:70%">' + bp2neatstr(e.stop - e.start) + '</span>', weavertkcolor_target, 'clb');
            if (bbjclb) {
                s.onclick = jump2coord_closure(bbj, e.chr, e.start, e.stop);
            }
        }
        if (arg.checkbox) {
            var chb = dom_create('input', td, 'transform:scale(1.5);');
            chb.type = 'checkbox';
            e.checkbox = chb;
        }
        dom_create('div', td, 'width:' + parseInt(100 * (e.stop - e.start) / maxtarget) + '%;height:2px;background-color:' + weavertkcolor_target);
        if (e.isgene) {
            dom_create('div', td, 'font-size:70%;').innerHTML = e.chr + ':' + e.start + '-' + e.stop + ', ' + bp2neatstr(e.stop - e.start);
        }
        for (var j = 0; j < arg.queries.length; j++) {
            td = tr.insertCell(-1);
            td.vAlign = 'top';
            td.style.paddingTop = 5;
            var hits = e.hit[arg.queries[j][0]];
            if (!hits || hits.length == 0) {
                td.innerHTML = 'no hit';
                continue;
            }
            var stc = hits[0];
            if (arg.checkbox) {
                if (stc.percentage > 40) {
                    e.checkbox.checked = true;
                }
            }
            var par = {
                start: e.start, stop: e.stop,
                targetcolor: weavertkcolor_target,
                querycolor: arg.queries[j][1],
                stitch: stc,
                width: width,
                holder: td,
            };
            if (e.isgene) {
                par.targetstruct = e.struct;
                par.strand = e.strand;
            }
            draw_stitch(par);
            var d = dom_create('div', td);
            if (stc.querygene) {
                dom_addtext(d,
                    stc.querygene.name2 ? stc.querygene.name2 : stc.querygene.name,
                    arg.queries[j][1]);
                dom_addtext(d, '&nbsp;&nbsp;' + stc.chr + ':' + stc.start + '-' + stc.stop + ', ' + bp2neatstr(stc.stop - stc.start) + ' ' + stc.percentage + '% aligned').style.fontSize = '70%';
            } else {
                dom_addtext(d, stc.chr + ':' + stc.start + '-' + stc.stop + ' <span style="font-size:70%">' + bp2neatstr(stc.stop - stc.start) + ' ' + stc.percentage + '% aligned</span>', arg.queries[j][1]);
            }
            if (hits.length > 1) {
                var d2 = dom_create('table', d, 'display:none;zoom:.8;');
                for (var k = 1; k < hits.length; k++) {
                    var ss = hits[k];
                    var tr2 = d2.insertRow(-1);
                    tr2.insertCell(0).innerHTML = ss.chr + ':' + ss.start + '-' + ss.stop;
                    tr2.insertCell(1).innerHTML = bp2neatstr(ss.stop - ss.start);
                    tr2.insertCell(2).innerHTML = ss.percentage + '%';
                }
                dom_addtext(d, '&nbsp;&nbsp;' + (hits.length - 1) + ' more hit' + (hits.length - 1 > 1 ? 's' : ''), null, 'clb').onclick = toggle_prevnode;
            }
        }
    }
}

