/**
 * ===BASE===// track // track_Mmove.js
 * @param 
 */

function track_Mmove(event) {
    /* must tell if this track is from a splinter
     */
    var sbj = gflag.browser;
    var tk = sbj.findTrack(event.target.tkname, event.target.cotton);
    if (!tk) {
        pica_hide();
        return;
    }
    pica.tk = tk;
    if (tk.header && !tk.menuselected) {
        tk.header.style.backgroundColor = colorCentral.tkentryfill;
    }
    var x = event.clientX,
        y = event.clientY;
    var pos = absolutePosition(sbj.hmdiv.parentNode);

    if (sbj.weaver && sbj.weaver.mode == W_rough) {
        if (tk.ft != FT_weaver_c) {
            // activate smears
            var tn = tk.name + tk.cotton;
            var h = 0;
            var where = 1;
            for (var i = 0; i < sbj.tklst.length; i++) {
                var t = sbj.tklst[i];
                if (tkishidden(t)) continue;
                if (t.name + t.cotton == tn) break;
                h += t.canvas.height + parseInt(t.canvas.style.paddingBottom);
                if (t.where != where) {
                    h += sbj.ideogram.canvas.height;
                    where = t.where;
                }
            }
            if (h > 0) {
                smear1.style.display = 'block';
                smear1.style.left = pos[0];
                smear1.style.top = pos[1];
                smear1.style.width = sbj.hmSpan;
                smear1.style.height = h;
            }
            var h2 = 0;
            for (; i < sbj.tklst.length; i++) {
                var t = sbj.tklst[i];
                if (tkishidden(t)) continue;
                if (t.name + t.cotton == tn) break;
                h2 += t.canvas.height + parseInt(t.canvas.style.paddingBottom);
            }
        }
        if (tk.cotton && tk.ft != FT_weaver_c) {
            // over cottontk
        } else if (!tk.cotton) {
            // over target tk
        }
    }

    if (tk.cotton && tk.ft != FT_weaver_c) {
        // this is cotton track, switch to cotton bbj
        sbj = sbj.weaver.q[tk.cotton];
    }
    var hitpoint = sbj.sx2rcoord(x + document.body.scrollLeft - pos[0] - sbj.move.styleLeft, true);
    if (!hitpoint) {
        // no man land, possible for inter-hsp in query genome
        pica_hide();
        glasspane.style.display = 'none';
        return;
    }
    var A = hitpoint.rid, B = hitpoint.sid;
    if (tk.cotton && tk.ft != FT_weaver_c && sbj.weaver.target.weaver.mode == W_rough) {
        var tbj = sbj.weaver.target;
        // cotton, check if cursor is in an hsp
        var _x = x - absolutePosition(tbj.hmdiv.parentNode)[0] + document.body.scrollLeft - sbj.move.styleLeft;
        var r = sbj.regionLst[A];
        var s = r[8].stitch;
        var lst = tbj.stitch2hithsp(s, _x);
        for (var i = 0; i < lst.length; i++) {
            lst[i][1] = lst[i][2] = -1;
        }
        tbj.weaver_stitch_decor(
            sbj.weaver.track,
            lst,
            _x,
            -1, -1,
            hitpoint.str);
    }
    var result = sbj.gettkitem_cursor(tk, x, y);
    if (tk.ft == FT_weaver_c) {
        glasspane.style.display = 'none';
        if (!result) {
            pica_hide();
            return;
        }
        stripChild(picasays, 0);
        pica.style.display = 'block';
        pica.style.left = x - 100;
        pica.style.right = '';
        var ytk = absolutePosition(tk.canvas)[1];
        pica.style.top = ytk + tk.canvas.height - document.body.scrollTop;
        pica.style.bottom = '';
        sbj.weaver_detail(x + document.body.scrollLeft - pos[0] - sbj.move.styleLeft, hitpoint, result, tk, picasays);
        if (result.stitch) {
            var _x = x - absolutePosition(sbj.hmdiv.parentNode)[0] + document.body.scrollLeft - sbj.move.styleLeft;
            var s = result.stitch;
            var querycoord = s.chr + ' ' + parseInt(s.start + (s.stop - s.start) * (_x - s.canvasstart) / (s.canvasstop - s.canvasstart));

            if (result.hsp) {
                sbj.weaver_stitch_decor(tk,
                    sbj.stitch2hithsp(s, _x),
                    _x,
                    result.hsp.q1,
                    result.hsp.q2,
                    querycoord
                );
            } else {
                // no hit to hsp
                sbj.weaver_stitch_decor(tk,
                    [],
                    _x,
                    -1, -1,
                    querycoord
                );
            }
        }
        return;
    }
    if (hitpoint.gap) {
        pica_go(x, y);
        picasays.innerHTML = sbj.tellsgap(hitpoint);
        return;
    }
    if (result == null) {
        pica_hide();
        return;
    }
    var cottonlabel = tk.cotton ? '<span style="background-color:' + sbj.weaver.track.qtc.bedcolor + ';color:white;">&nbsp;' + tk.cotton + '&nbsp;</span>' : '';
    if (tk.mode == M_arc || tk.mode == M_trihm) {
        if (tk.mode == M_arc) {
            if (!result) {
                pica_hide();
                return;
            }
            picasays.innerHTML = 'Score: ' + tk.data_chiapet[result[3]][result[4]].name;
            pica_go(x, y);
            return;
        }
        // trihm
        var isld = tk.ft == FT_ld_c || tk.ft == FT_ld_n;
        if (!result) {
            pica_hide();
            indicator.style.display = indicator6.style.display = 'none';
            if (isld) glasspane.style.display = 'none';
            return;
        }
        var item2 = tk.data_chiapet[result[4]][result[5]];
        if (item2.struct.L.rid == item2.struct.R.rid && item2.struct.L.stop >= item2.struct.R.start) {
            if (isld) {
                glasspane.style.display = 'none';
            }
            return;
        }
        // ld differs from lr here
        if (isld) {
            // find left/right snp by xpos
            var tmp = findSnp_ldtk(tk, result, item2);
            var rs1 = tmp[0], rs2 = tmp[1];
            if (rs1 == null || rs2 == null) {
                glasspane.style.display = 'none';
                return;
            }
            // paint path from beam to snp
            glasspane.style.display = 'block';
            glasspane.width = sbj.hmSpan;
            glasspane.height = tk.ld.ticksize + tk.ld.topheight;
            glasspane.style.left = pos[0];
            glasspane.style.top = absolutePosition(tk.canvas)[1];
            var ctx = glasspane.getContext('2d');
            ctx.fillStyle = 'rgba(' + tk.qtc.pr + ',' + tk.qtc.pg + ',' + tk.qtc.pb + ',0.5)';
            // left
            var a = tk.ld.hash[rs1];
            var b = a.bottomx + sbj.move.styleLeft;
            var w = result[2];
            ctx.beginPath();
            ctx.moveTo(a.topx + sbj.move.styleLeft - .5, tk.ld.ticksize);
            ctx.lineTo(b - w / 2 - 1, glasspane.height);
            ctx.lineTo(b + w / 2 + 1, glasspane.height);
            ctx.lineTo(a.topx + sbj.move.styleLeft + .5, tk.ld.ticksize);
            ctx.closePath();
            ctx.fill();
            // right
            a = tk.ld.hash[rs2];
            b = a.bottomx + sbj.move.styleLeft;
            w = result[3];
            ctx.beginPath();
            ctx.moveTo(a.topx + sbj.move.styleLeft - .5, tk.ld.ticksize);
            ctx.lineTo(b - w / 2 - 1, glasspane.height);
            ctx.lineTo(b + w / 2 + 1, glasspane.height);
            ctx.lineTo(a.topx + sbj.move.styleLeft + .5, tk.ld.ticksize);
            ctx.closePath();
            ctx.fill();
        } else {
            var Y = pos[1];
            var H = sbj.hmdiv.clientHeight + sbj.decordiv.clientHeight + sbj.ideogram.canvas.height;
            // left beam
            var _x = item2.boxstart + sbj.move.styleLeft;
            if (_x + result[2] > 0) {
                indicator.style.display = 'block';
                indicator.style.height = H;
                indicator.style.top = Y;
                indicator.style.left = Math.max(pos[0], _x + pos[0]);
                indicator.style.width = Math.min(_x + result[2], result[2]);
            } else {
                indicator.style.display = 'none';
            }
            // right beam
            _x = item2.boxstart + item2.boxwidth + sbj.move.styleLeft - result[3];
            if (_x < sbj.hmSpan) {
                indicator6.style.display = 'block';
                indicator6.style.height = H;
                indicator6.style.top = Y;
                indicator6.style.left = _x + pos[0];
                indicator6.style.width = Math.min(sbj.hmSpan - _x, result[3]);
            } else {
                indicator6.style.display = 'none';
            }
        }
        picasays.innerHTML = 'Score: ' + tk.data_chiapet[result[4]][result[5]].name;
        pica_go(x, y);
        return;
    }
    if (tk.mode == M_bar) {
        if (result.length > 0) {
            pica_go(x, y);
            stripChild(picasays, 0);
            var d = dom_create('div', picasays, 'padding:5px;font-size:16px;color:white');
            for (var i = 0; i < Math.min(4, result.length); i++) {
                var lst = [];
                var n = result[i].name2 ? result[i].name2 : result[i].name;
                if (n) {
                    lst.push(n);
                }
                if (tk.showscoreidx >= 0) {
                    lst.push(result[i].scorelst[tk.showscoreidx] + ' <span style="font-size:80%;opacity:.8;">' + tk.scorenamelst[tk.showscoreidx] + '</span>');
                }
                if (result[i].category != undefined && tk.cateInfo) {
                    lst.push('<span class=squarecell style="padding:0px 8px;background-color:' + tk.cateInfo[result[i].category][1] + ';">&nbsp;</span> <span style="font-size:80%;">' + tk.cateInfo[result[i].category][0] + '</span>');
                }
                dom_create('div', d, 'margin:5px;').innerHTML = lst.join('<br>');
            }
            if (result.length > 4) {
                dom_create('div', d, 'margin-top:3px;border-top:1px solid white;opacity:.7;font-size:70%;text-align:center;').innerHTML = (result.length - 4) + ' NOT SHOWN';
            }
            var s = result.length == 1 ? result[0].strand : null;
            dom_create('div', d, 'margin:5px;', {
                c: 'picadim', t: tk.label +
                '<br>' + hitpoint.str + ' ' +
                ((s && s != '.') ? ('<span style="font-size:150%;">' + ((s == '>' || s == '+') ? '&raquo;' : '&laquo;') + '</span>') : '')
            });
            if (cottonlabel) dom_create('div', d).innerHTML = cottonlabel;
        } else {
            pica_hide();
        }
        return;
    }
    if (tk.ft == FT_cat_n || tk.ft == FT_cat_c) {
        pica_go(x, y);
        picasays.innerHTML = '<div style="padding:5px;font-size:16px;color:white">' +
        '<div class=squarecell style="display:inline-block;background-color:' + result[1] + '"></div> ' + result[0] +
        '<div class=picadim>' + tk.label +
        '<br>' + hitpoint.str + '</div>' + cottonlabel + '</div>';
        return;
    }
    if (tk.ft == FT_catmat) {
        pica_go(x, y);
        picasays.innerHTML = '<div style="padding:5px;font-size:16px;color:white">' +
        '<div class=squarecell style="display:inline-block;background-color:' + result[1] + '"></div> ' + result[0] +
        '<div class=picadim>' + tk.label +
        '<br>' + hitpoint.str + '</div>' + cottonlabel + '</div>';
        return;
    }
    if (tk.ft == FT_qcats) {
        pica_go(x, y);
        var quantity = result[0];
        var cat = result[1];
        picasays.innerHTML = '<div style="padding:5px;font-size:16px;color:white">' +
        '<div class=squarecell style="display:inline-block;background-color:' + cat[1] + '"></div> ' + cat[0] +
        '<div>' + quantity + '</div>' +
        '<div class=picadim>' + tk.label +
        '<br>' + hitpoint.str + '</div>' + cottonlabel + '</div>';
        return;
    }
    if (isNumerical(tk)) {
        // no matter whether the track is in ghm or decor, the x is same
        pica_go(x, y);
        var str = '<div style="padding:5px;font-size:16px;color:white">';
        if (isNaN(result)) {
            str += 'No data';
        } else if (tk.normalize) {
            var n = sbj.track_normalize(tk, result);
            str += neatstr(n) + ' (' + tk.normalize.method + ')' +
            '<br><span style="font-size:12px">' + result + ' (raw)</span>';
        } else {
            str += result + (tk.qtc.height < 20 ? '<div style="font-size:70%;opacity:.8">min: ' + tk.minv + ', max: ' + tk.maxv + '</div>' : '');
        }
        picasays.innerHTML = str + '<div class=picadim>' + tk.label +
        '<br>' + hitpoint.str + '</div>' + cottonlabel + '</div>';
        return;
    }
    if (tk.ft == FT_matplot) {
        var str = [];
        for (var i = 0; i < tk.tracks.length; i++) {
            var _t = tk.tracks[i];
            var v = _t.data[A][B];
            if (!isNaN(v)) {
                v = sbj.track_normalize(_t, v);
                var q = _t.qtc;
                str.push('<tr><td class=squarecell style="background-color:rgb(' + q.pr + ',' + q.pg + ',' + q.pb + ')"></td><td valign=top>' + neatstr(v) + '</td><td style="font-size:70%;">' + _t.label + '</td></tr>');
            }
        }
        //pica_go(pos[0]+sbj.hmSpan-10,pos[1]-10);
        pica_go(x, y);
        picasays.innerHTML = '<table style="margin:5px;color:white">' +
        str.join('') + '<tr><td colspan=3 style="padding-top:5px">' + hitpoint.str + cottonlabel + '</td></tr></table>';
        return;
    }
    if (tk.ft == FT_cm_c) {
        picasays.innerHTML = cmtk_detail(tk, A, B) +
        '<div class=picadim style="margin:10px;">' + tk.label +
        '<br>' + hitpoint.str + '</div>' +
        (cottonlabel ? '<div style="margin:10px;">' + cottonlabel + '</div>' : '');
        pica_go(x, y);
        return;
    }
// remainder, stacked items
    if (tk.ft == FT_lr_n || tk.ft == FT_lr_c) {
        picasays.innerHTML = '<div style="padding:5px;">Score: ' +
        (result.hasmate ? result.name : result.name.split(',')[1]) + '<div class=picadim>' + tk.label +
        '<br>' + hitpoint.str + '</div>' + cottonlabel + '</div>';
        pica_go(x, y);
        return;
    }
    var s = result.strand;
    picasays.innerHTML = '<div style="padding:5px;"><div style="color:white;line-height:1.5;">' +
    (result.name2 ? result.name2 : (result.name ? result.name : ((tk.ft == FT_bam_n || tk.ft == FT_bam_c) ? 'Read' : 'Unamed item'))) + '<br>' +
    ((result.category != undefined && tk.cateInfo) ?
    '<span class=squarecell style="padding:0px 8px;background-color:' + tk.cateInfo[result.category][1] + ';">&nbsp;</span> ' + tk.cateInfo[result.category][0] + '<br>' : '') +
    (result.scorelst ? (tk.showscoreidx >= 0 ?
    result.scorelst[tk.showscoreidx] + ' <span style="font-size:80%;opacity:.8;">' + tk.scorenamelst[tk.showscoreidx] + '</span>'
        : '') : '') +
    '</div><div class=picadim>' + tk.label +
    '<br>' + hitpoint.str +
    ((s && s != '.') ? ('<span style="font-size:150%;">&nbsp;' + ((s == '>' || s == '+') ? '&raquo;' : '&laquo;') + '</span>') : '') +
    '</div>' + cottonlabel + '</div>';
    pica_go(x, y);
}


