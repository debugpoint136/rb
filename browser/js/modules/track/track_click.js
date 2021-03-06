/**
 * ===BASE===// track // track_click.js
 * @param 
 */

function track_click(event) {
    var sbj = gflag.browser;
    /* must escape the case of panning
     .move.oldpos is set to old position when mousedown
     */
    if (sbj.move.oldpos != sbj.move.styleLeft) return;

    var tk = sbj.findTrack(event.target.tkname, event.target.cotton);
    if (event.shiftKey) {
        /* register selected ones in gflag.menu.tklst
         exit when done
         */
        if (sbj.splinterTag) {
            sbj = sbj.trunk;
        }
        sbj.track_click_multiselect(tk.name, tk.cotton);
        return;
    }
    if (tk.cotton && tk.ft != FT_weaver_c) {
        // this is cotton track, switch to cotton bbj
        sbj = sbj.weaver.q[tk.cotton];
    }
    var x = event.clientX,
        y = event.clientY;
    var pos = absolutePosition(sbj.hmdiv.parentNode);
    var hitpoint = sbj.sx2rcoord(x + document.body.scrollLeft - pos[0] - sbj.move.styleLeft, true);
    if (!hitpoint) {
        return;
    }
    if (hitpoint.gap && tk.ft != FT_weaver_c) {
        bubbleShow(x, y);
        bubble.says.innerHTML = '<div style="margin:10px;">' + sbj.tellsgap(hitpoint) + '</div>';
        return;
    }
    var result = sbj.gettkitem_cursor(tk, x, y);

    bubbleShow(x + document.body.scrollLeft, y + document.body.scrollTop);
    stripChild(bubble.says, 0);

    if (isNumerical(tk)) {
        dom_create('div', bubble.says, 'margin:10px;color:white;').innerHTML = '<div style="font-size:130%;padding-bottom:10px;">' +
        (tk.mode == M_den ?
            ((isNaN(result) || result == 0) ? 'No data' : result + ' item' + (result > 1 ? 's' : '')) :
            (isNaN(result) ? 'No data' : 'Score: ' + result)) + '</div>' +
        hitpoint.str;
        return;
    }
    if (tk.ft == FT_matplot) {
        var str = [];
        for (var i = 0; i < tk.tracks.length; i++) {
            var _t = tk.tracks[i];
            var v = _t.data[hitpoint.rid][hitpoint.sid];
            if (!isNaN(v)) {
                v = sbj.track_normalize(_t, v);
                var q = _t.qtc;
                str.push('<tr><td class=squarecell style="background-color:rgb(' + q.pr + ',' + q.pg + ',' + q.pb + ')"></td><td valign=top>' + neatstr(v) + '</td><td style="font-size:70%;">' + _t.label + '</td></tr>');
            }
        }
        dom_create('div', bubble.says, 'margin:10px;color:white;').innerHTML = '<table style="margin:5px;color:white">' +
        str.join('') + '<tr><td colspan=3 style="padding-top:5px">' + hitpoint.str + '</td></tr></table>';
        return;
    }
    if (tk.ft == FT_cm_c) {
        bubble.says.innerHTML = '<div style="margin:10px;">' + cmtk_detail(tk, hitpoint.rid, hitpoint.sid) + hitpoint.str + '</div>';
        return;
    }

    if (!result || result.length == 0) {
        bubbleHide();
        return;
    }
    var _i = result;
    if (Array.isArray(_i)) _i = result[0];
    var currentcoord = sbj.regionLst[hitpoint.rid][0] + ':' + _i.start + '-' + _i.stop +
        ((_i.strand && _i.strand != '.') ? '&nbsp;&nbsp;&nbsp;<span style="font-size:150%">' +
        ((_i.strand == '>' || _i.strand == '+') ? '&raquo;' : '&laquo;') + '</span>' : '') +
        '&nbsp;&nbsp;&nbsp;' + bp2neatstr(_i.stop - _i.start);

    if (tk.ft == FT_ld_c || tk.ft == FT_ld_n) {
        var item2 = tk.data_chiapet[result[4]][result[5]];
        var tmp = findSnp_ldtk(tk, result, item2);
        var rs1 = tmp[0], rs2 = tmp[1];
        var _rs1 = tk.ld.hash[rs1];
        var _rs2 = tk.ld.hash[rs2];
        var table = dom_create('table', bubble.says, 'color:white;margin:10px');
        var td = table.insertRow(0).insertCell(0);
        // find ld item in tk.ld.data
        for (var i = 0; i < tk.ld.data[_rs1.rid].length; i++) {
            var t = tk.ld.data[_rs1.rid][i];
            if (t.rs1 == rs1 && t.rs2 == rs2) {
                for (var j = 0; j < t.scorelst.length; j++) {
                    dom_addtext(td, tk.scorenamelst[j] + ': ');
                    dom_addtext(td, t.scorelst[j] + '&nbsp;&nbsp;&nbsp;');
                }
                break;
            }
        }
        if (!tk.querytrack) {
            // no track to query
            dom_addtext(td, '<br><br><a href=' + literal_snpurl + rs1 + ' style="color:white" target=_blank>' + rs1 + '</a>');
            dom_addtext(td, '<br><br><a href=' + literal_snpurl + rs2 + ' style="color:white" target=_blank>' + rs2 + '</a>');
            return;
        }
        bubble.sayajax.style.display = 'block';
        bubble.sayajax.innerHTML = 'Loading SNP info...';
        bubble.sayajax.style.maxHeight = 30;
        sbj.ajax('dbName=' + sbj.genome.name + '&runmode=' + sbj.genome.defaultStuff.runmode +
        '&regionLst=' +
        sbj.regionLst[_rs1.rid][0] + ',' + (_rs1.coord - 1) + ',' + (_rs1.coord + 1) + ',1,' +
        sbj.regionLst[_rs2.rid][0] + ',' + (_rs2.coord - 1) + ',' + (_rs2.coord + 1) + ',1' +
        '&startCoord=' + (_rs1.coord - 1) +
        '&stopCoord=' + (_rs2.coord + 1) + trackParam([tk.querytrack]), function (data) {
            sbj.lditemclick_gotdata(data, tk, rs1, rs2);
        });
        return;
    }
    if (tk.ft == FT_lr_c || tk.ft == FT_lr_n) {
        var item;
        switch (tk.mode) {
            case M_arc:
                item = tk.data_chiapet[result[3]][result[4]];
                break;
            case M_trihm:
                item = tk.data_chiapet[result[4]][result[5]];
                break;
            default:
                item = result;
        }
        var d = dom_create('div', bubble.says, 'margin:10px;color:white;line-height:1.5;');
        dom_addtext(d, 'Interacting regions:');
        dom_create('br', d);
        if (item.hasmate) {
            // mate found
            var m1 = item.struct.L;
            var m2 = item.struct.R;
            var coord1 = sbj.regionLst[m1.rid][0] + ':' + m1.start + '-' + m1.stop;
            var coord2 = sbj.regionLst[m2.rid][0] + ':' + m2.start + '-' + m2.stop;
            dom_addtext(d, 'left: ' + coord1 + '&nbsp;');
            var b = dom_addbutt(d, 'show', function () {
                sbj.splinter_issuetrigger(coord1);
            });
            dom_create('br', d);
            dom_addtext(d, 'right: ' + coord2 + '&nbsp;');
            b = dom_addbutt(d, 'show', function () {
                sbj.splinter_issuetrigger(coord2);
            });
            dom_create('br', d);
            dom_addtext(d, 'score: ' + item.name);
        } else {
            // no mate, preliminary checking to make sure there's valid mate information
            if (item.name.indexOf(',') == -1 || item.name.indexOf(':') == -1 || item.name.indexOf('-') == -1) {
                bubbleHide();
                print2console('Unexpected contents. Is this a valid Long range interaction track?', 2);
                return;
            }
            var tt = item.name.split(',');
            var t2 = tt[0].split(':');
            var t3 = t2[1].split('-');
            dom_addtext(d, 'current: ' + currentcoord + '&nbsp;');
            var b = dom_addbutt(d, 'show', function () {
                sbj.splinter_issuetrigger(currentcoord);
            });
            dom_create('br', d);
            dom_addtext(d, 'remote: ' + tt[0] + '&nbsp;');
            var b = dom_addbutt(d, 'show', function () {
                sbj.splinter_issuetrigger(tt[0]);
            });
            dom_create('br', d);
            dom_addtext(d, 'score: ' + tt[1]);
        }
        return;
    }
    if (tk.ft == FT_bed_n || tk.ft == FT_bed_c || tk.ft == FT_anno_n || tk.ft == FT_anno_c) {
        var item = Array.isArray(result) ? result[0] : result;
        if (gflag.allow_packhide_tkdata) {
            dom_addbutt(bubble.says, 'HIDE THIS ITEM', function () {
                sbj.trackitem_delete(tk, item, hitpoint.rid);
            }).style.margin = 10;
        }
        var table = dom_create('table', bubble.says, 'color:white;');
        table.cellSpacing = 10;
        var tr = table.insertRow(0);
        if (item.name) {
            // item.name is like NM_003930, item.name2 for skap2
            var td = tr.insertCell(0);
            td.style.font = 'italic bold 18px Georgia';
            td.innerHTML = item.name2 ? item.name2 : item.name;
            td = tr.insertCell(-1);
            if (tk.queryUrl) {
                td.align = 'right';
                td.innerHTML = '<a href=' + tk.queryUrl + item.name + ' target=_blank style="color:white">' + item.name + '</a>';
            }
        }
        tr = table.insertRow(-1);
        var td = tr.insertCell(0);
        td.colSpan = 2;
        td.innerHTML = currentcoord;
        if (item.category && tk.cateInfo) {
            tr = table.insertRow(-1);
            td = tr.insertCell(0);
            td.colSpan = 2;
            var c = tk.cateInfo[item.category];
            td.innerHTML = '<span class=squarecell style="padding:0px 8px;background-color:' + c[1] + ';">&nbsp;</span> ' + c[0];
        }
        if (item.desc) {
            tr = table.insertRow(-1);
            td = tr.insertCell(0);
            td.colSpan = 2;
            td.style.width = '300px';
            td.innerHTML = item.desc;
        }
        if (item.scorelst) {
            for (var i = 0; i < item.scorelst.length; i++) {
                tr = table.insertRow(-1);
                if (tk.showscoreidx != undefined) {
                    if (tk.showscoreidx == i) {
                        tr.style.backgroundColor = 'rgba(0,0,0,0.5)';
                    }
                }
                td = tr.insertCell(0);
                td.style.fontStyle = 'italic';
                td.innerHTML = tk.scorenamelst ? tk.scorenamelst[i] : 'unidentified score';
                td = tr.insertCell(1);
                td.innerHTML = item.scorelst[i];
            }
        }
        if (item.struct) {
            var r = sbj.regionLst[hitpoint.rid];
            var curbstart, curbstop;
            var d = sbj.dspBoundary;
            if (r[8] && r[8].item.hsp.strand == '-') {
                curbstart = Math.max(item.start, hitpoint.rid == d.vstopr ? d.vstopc : r[3]);
                curbstop = Math.min(item.stop, hitpoint.rid == d.vstartr ? d.vstartc : r[4]);
            } else {
                curbstart = Math.max(item.start, hitpoint.rid == d.vstartr ? d.vstartc : r[3]);
                curbstop = Math.min(item.stop, hitpoint.rid == d.vstopr ? d.vstopc : r[4]);
            }
            if (curbstart < curbstop && (curbstart > item.start || curbstop < item.stop)) {
                td = table.insertRow(-1).insertCell(0);
                td.colSpan = 2;
                var c = dom_create('canvas', td);
                c.width = 280;
                c.height = 19;
                var ctx = c.getContext('2d');
                var pL = 10; // left/right padding
                var pH = 3; // top/bottom padding
                var w = c.width - pL * 2; // actual plotable width
                plotGene(ctx, 'white', '#858585',
                    item,
                    pL, pH, w, c.height - pH * 2,
                    item.start, item.stop,
                    false);
                // highlight current region
                var sf = w / (item.stop - item.start);
                ctx.strokeStyle = 'yellow';
                ctx.strokeRect(pL + parseInt((curbstart - item.start) * sf) + 0.5, 0.5, parseInt((curbstop - curbstart) * sf), c.height - 1);
            }
            // show struct
            var slst = [];
            if (item.struct.thin) {
                for (var i = 0; i < item.struct.thin.length; i++) {
                    var a = item.struct.thin[i];
                    slst.push([a[0], a[1], 1]);
                }
            }
            if (item.struct.thick) {
                for (var i = 0; i < item.struct.thick.length; i++) {
                    var a = item.struct.thick[i];
                    slst.push([a[0], a[1], 2]);
                }
            }
            if (slst.length > 1) {
                td = table.insertRow(-1).insertCell(0);
                td.colSpan = 2;
                var _d = dom_create('div', td, 'height:70px;overflow-Y:scroll;resize:vertical;margin:10px;padding-left:10px;border-style:solid;border-color:rgba(200,200,200,.4);border-width:1px 0px;');
                var t2 = dom_create('table', _d, 'color:white;');
                var tr2 = t2.insertRow(0);
                var td2 = tr2.insertCell(0);
                td2.colSpan = 2;
                td2.style.fontSize = '70%';
                td2.innerHTML = slst.length + ' segments:';
                slst.sort(sort_struct);
                for (var i = 0; i < slst.length; i++) {
                    tr2 = t2.insertRow(-1);
                    td2 = tr2.insertCell(0);
                    td2.innerHTML = slst[i][2] == 1 ? '&#9644;' : '&#9606;';
                    td2 = tr2.insertCell(1);
                    td2.innerHTML = slst[i][0] + ' - ' + slst[i][1];
                }
            }
        }
        if (item.details) {
            tr = table.insertRow(-1);
            td = tr.insertCell(0);
            td.colSpan = 2;
            var t2 = dom_create('table', td, 'color:white;font-size:70%;');
            for (var k in item.details) {
                tr = t2.insertRow(-1);
                td = tr.insertCell(0);
                td.style.fontStyle = 'italic';
                td.style.opacity = 0.8;
                td.innerHTML = k;
                td = tr.insertCell(1);
                td.style.width = '250px';
                td.innerHTML = item.details[k];
            }
        }
        if (item.sbstroke) {
            tr = table.insertRow(-1);
            td = tr.insertCell(0);
            td.colSpan = 2;
            td.innerHTML = 'Highlighted base from start: ';
            for (var i = 0; i < item.sbstroke.length; i++) {
                td.innerHTML += item.sbstroke + ' ';
            }
        }
        return;
    }

    if (tk.ft == FT_bam_n || tk.ft == FT_bam_c) {
        if (sbj.targetBypassQuerytk(tk)) {
            sbj = sbj.weaver.q[tk.cotton];
        }
        var item = result;
        bubble.says.innerHTML = '<div style="margin:10px;color:white;">' +
        'name: ' + item.id + '<br>(' + item.bam.status + ')<br><br>';
        bubble.sayajax.style.display = 'block';
        bubble.sayajax.innerHTML = "<br>Loading read alignment...<br>";
        bubble.sayajax.style.maxHeight = 30;
        var rlst = []; // list of regions for seq query
        if (item.hasmate) {
            var r = item.struct.L;
            var c = samread_seqregion(r.bam.cigar, r.start);
            for (var i = 0; i < c.length; i++) {
                rlst.push(sbj.regionLst[r.rid][0] + ',' + c[i][0] + ',' + c[i][1]);
            }
            r = item.struct.R;
            c = samread_seqregion(r.bam.cigar, r.start);
            for (var i = 0; i < c.length; i++) {
                rlst.push(sbj.regionLst[r.rid][0] + ',' + c[i][0] + ',' + c[i][1]);
            }
        } else {
            var c = samread_seqregion(item.bam.cigar, item.start);
            for (var i = 0; i < c.length; i++) {
                rlst.push(sbj.regionLst[hitpoint.rid][0] + ',' + c[i][0] + ',' + c[i][1]);
            }
        }
        sbj.ajax('getChromseq=on&dbName=' + sbj.genome.name +
        '&regionlst=' + rlst.join(','), function (data) {
            sbj.bamread2bubble(data, item);
        });
        return;
    }
    if (tk.ft == FT_cat_c || tk.ft == FT_cat_n) {
        dom_create('div', bubble.says, 'margin:10px;color:white;').innerHTML = '<div style="font-size:130%;padding-bottom:10px;">' +
        '<div class=squarecell style="display:inline-block;background-color:' + result[1] + '"></div> ' + result[0] + '</div>' +
        hitpoint.str + '</div>';
        return;
    }
    if (tk.ft == FT_catmat || tk.ft == FT_qcats) {
        var q = result[0], cat = result[1];
        dom_create('div', bubble.says, 'margin:10px;color:white;').innerHTML = '<div style="font-size:130%;padding-bottom:10px;">' +
        '<div class=squarecell style="display:inline-block;background-color:' + cat[1] + '"></div> ' + cat[0] + '</div>' +
        '<div style="font-size:120%">' + q + '</div>' +
        hitpoint.str + '</div>';
        return;
    }
    if (tk.ft == FT_weaver_c) {
        var h = result.hsp;
        var tmp = sbj.weaver_detail(
            x + document.body.scrollLeft - pos[0] - sbj.move.styleLeft,
            hitpoint, result, tk, bubble.says);
        if (tk.weaver.mode == W_fine) {
            var chewstart = tmp[0], chewstop = tmp[1];
            var totallen = result.hsp.targetseq.length;
            if (chewstart > 0 || chewstop < totallen - 1) {
                // tooltip shows a fraction of the entire alignment
                var table = tmp[2];
                var tr = table.insertRow(-1);
                tr.insertCell(0);
                var td = tr.insertCell(1);
                tr.insertCell(2);
                var canvas = dom_create('canvas', td, 'margin-top:10px;');
                var w = (chewstop - chewstart) * 9;
                canvas.width = w;
                canvas.height = 40;
                var ctx = canvas.getContext('2d');
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, 1, 5);
                ctx.fillRect(w - 1, 0, 1, 5);
                var a = parseInt(chewstart * w / totallen) + .5,
                    b = parseInt(chewstop * w / totallen) + .5;
                ctx.strokeStyle = 'white';
                ctx.moveTo(0, 5);
                var y = 20.5, h2 = 15;
                ctx.lineTo(a, y);
                ctx.moveTo(w - 1, 5);
                ctx.lineTo(b, y);
                ctx.lineTo(a, y);
                ctx.lineTo(a, y + h2);
                ctx.lineTo(b, y + h2);
                ctx.lineTo(b, y);
                ctx.stroke();
                ctx.fillStyle = 'rgba(255,255,255,.5)';
                ctx.fillRect(0, y + 2, w, 4);
                ctx.fillRect(0, y + 8, w, 4);
            }
            var d = dom_create('table', bubble.says, 'margin:0px 10px 10px;color:white;');
            d.cellSpacing = 5;
            tr = d.insertRow(0);
            tr.insertCell(0).innerHTML = sbj.genome.name;
            tr.insertCell(1).innerHTML = sbj.regionLst[h.targetrid][0] + ':' + h.targetstart + '-' + h.targetstop;
            tr.insertCell(2).innerHTML = bp2neatstr(h.targetstop - h.targetstart);
            tr = d.insertRow(1);
            tr.insertCell(0).innerHTML = tk.cotton;
            tr.insertCell(1).innerHTML = h.querychr + ':' + h.querystart + '-' + h.querystop;
            tr.insertCell(2).innerHTML = bp2neatstr(h.querystop - h.querystart);
        } else {
        }
        return;
    }
    fatalError('unknown ft: ' + tk.ft);
}

