/**
 * Created by dpuru on 2/27/15.
 */


/*** __track__ ***/

function track_Mout(event) {
    var bbj = gflag.browser;
    var tk = bbj.findTrack(event.target.tkname, event.target.cotton);
    if (!tk) {
        // this is the case for alethiometer splinter
        return;
    }
    if (!tk.menuselected) {
        tk.header.style.backgroundColor = 'transparent';
    }
    pica_hide();
    glasspane.style.display =
        smear1.style.display = smear2.style.display =
            indicator.style.display = indicator6.style.display = 'none';
}

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


Browser.prototype.gettkitem_cursor = function (tk, x, y) {
    /* x/y: event.clientX/Y
     if at barplot, will return a list of items
     */
    x = x + document.body.scrollLeft - absolutePosition(this.hmdiv.parentNode)[0] - this.move.styleLeft;
    y = y + document.body.scrollTop - absolutePosition(tk.canvas)[1];
    if (tk.mode == M_arc || tk.mode == M_trihm) {
        if (tk.mode == M_arc) {
            return findDecoritem_longrange_arc(tk.data_arc, x, y);
        }
        return findDecoritem_longrange_trihm(tk.data_trihm,
            tk.qtc.anglescale * Math.PI / 4,
            x, y);
    }
    var hitpoint = this.sx2rcoord(x, true);
    if (!hitpoint) return null;
    var A = hitpoint.rid, B = hitpoint.sid;

    if (tk.mode == M_bar) {
        if (y <= densitydecorpaddingtop + tk.qtc.height + 1) {
            // cursor over bars
            var hits = [];
            for (var i = 0; i < tk.data[A].length; i++) {
                var item = tk.data[A][i];
                if (item.start <= hitpoint.coord && item.stop >= hitpoint.coord) {
                    hits.push(item);
                }
            }
            return hits;
        } else {
            // cursor over item boxes
            var clickstack = parseInt((y - densitydecorpaddingtop - tk.qtc.height - 1) / (fullStackHeight + 1));
            for (var i = 0; i < tk.data[A].length; i++) {
                var item = tk.data[A][i];
                if (item.stack == clickstack && item.start <= hitpoint.coord && item.stop >= hitpoint.coord) {
                    return [item];
                }
            }
        }
        return [];
    }
    if (isNumerical(tk)) {
        if (A >= tk.data.length) return null;
        if (B >= tk.data[A].length) return null;
        return tk.data[A][B];
    }
    switch (tk.ft) {
        case FT_cat_n:
        case FT_cat_c:
            return tk.cateInfo[tk.data[A][B]];
        case FT_matplot:
            return true;
        case FT_cm_c:
            return true;
        case FT_anno_n:
        case FT_anno_c:
        case FT_bam_n:
        case FT_bam_c:
        case FT_bed_n:
        case FT_bed_c:
        case FT_lr_n:
        case FT_lr_c:
        case FT_weaver_c:
            if (tk.ft == FT_weaver_c && tk.weaver.mode == W_rough) {
                if (y >= tk.canvas.height - fullStackHeight) {
                    // over query stitch
                    for (var i = 0; i < tk.weaver.stitch.length; i++) {
                        var s = tk.weaver.stitch[i];
                        if (x < s.canvasstart || x > s.canvasstop) continue;
                        var perc = (x - s.canvasstart) / (s.canvasstop - s.canvasstart);
                        var re = {
                            stitch: s,
                            query: s.chr + ':' + (s.start + parseInt((s.stop - s.start) * perc)),
                        };
                        for (var j = 0; j < s.lst.length; j++) {
                            var h = s.lst[j];
                            // using on screen pos of query, not target!
                            var a = h.strand == '+' ? h.q1 : h.q2,
                                b = h.strand == '+' ? h.q2 : h.q1;
                            if (x >= a && x <= b) {
                                re.hsp = h;
                                perc = (x - h.q1) / (h.q2 - h.q1);
                                re.target = this.regionLst[h.targetrid][0] + ':' +
                                (h.targetstart + parseInt((h.targetstop - h.targetstart) * perc));
                                return re;
                            }
                        }
                        return re;
                    }
                } else {
                    // may target
                }
                return null;
            }
            var clickstack;
            if (tk.ft == FT_weaver_c) {
                clickstack = parseInt((y - weavertkpad) / (tk.qtc.stackheight + 1));
            } else {
                var stkh = tk.mode == M_full ? fullStackHeight + 1 : thinStackHeight + 1;
                clickstack = parseInt(y / (stkh));
            }
            var _data = (tk.ft == FT_lr_n || tk.ft == FT_lr_c) ? tk.data_chiapet : tk.data;
            for (var i = 0; i < _data.length; i++) {
                for (var j = 0; j < _data[i].length; j++) {
                    var item = _data[i][j];
                    if (item.stack == undefined || item.stack != clickstack) continue;
                    if (item.stackstart >= 0) {
                        if (item.stackstart <= x && item.stackstart + item.stackwidth >= x) {
                            return item;
                        }
                    } else {
                        if (item.start <= hitpoint.coord && item.stop > hitpoint.coord) {
                            return item;
                        }
                    }
                }
            }
            return null;
        case FT_catmat:
            if (y <= 1) return null;
            if (!tk.data[A]) return null;
            for (var i = 0; i < tk.data[A].length; i++) {
                var item = tk.data[A][i];
                if (item.start <= hitpoint.coord && item.stop >= hitpoint.coord) {
                    return tk.cateInfo[item.layers[parseInt((y - 1) / tk.rowheight)]];
                }
            }
            return null;
        case FT_qcats:
            if (y <= 1) return null;
            if (!tk.data[A]) return null;
            for (var i = 0; i < tk.data[A].length; i++) {
                var item = tk.data[A][i];
                if (item.start <= hitpoint.coord && item.stop >= hitpoint.coord) {
                    for (var j = 0; j < item.qcat.length; j++) {
                        var q = item.qcat[j];
                        if (q[3] <= y && q[3] + q[4] >= y) {
                            return [q[0], tk.cateInfo[q[1]]];
                        }
                    }
                }
            }
            return null;
        default:
            fatalError('unknown tk ft');
    }
};


function findSnp_ldtk(tk, item, item2) {
    /* item: tk.data_trihm
     item2: tk.data_chiapet
     */
    var a = item2.boxstart + item2.boxwidth;
    var rs1 = null, rs2 = null;
    for (var k in tk.ld.hash) {
        var x = tk.ld.hash[k].bottomx;
        if (rs1 == null && (x > item2.boxstart && x < item2.boxstart + item[2])) {
            rs1 = k;
            if (rs2 != null) return [rs1, rs2];
        }
        if (rs2 == null && (x > a - item[3] && x < a)) {
            rs2 = k;
            if (rs1 != null) return [rs1, rs2];
        }
    }
    return [rs1, rs2];
}

function duplicateTkobj(o) {
    var o2 = {
        name: o.name,
        label: o.label,
        ft: o.ft,
        url: o.url,
        qtc: {},
        mode: isHmtk(o.ft) ? M_show : M_den,
    };
    if (o.ft == FT_weaver_c) {
        o2.cotton = o.cotton;
    }
    qtc_paramCopy(o.qtc, o2.qtc);
    if (o.cateInfo) {
        o2.cateInfo = {};
        cateInfo_copy(o.cateInfo, o2.cateInfo);
    }
    return o2;
}

Genome.prototype.replicatetk = function (t) {
// make tkobj to go into datahub
    var _o = {}; // temp obj for stringify
    if (t.ft == FT_cm_c) {
        if (t.cm.combine) {
            _o.combinestrands = true;
        }
        if (t.cm.combine_chg) {
            _o.combinestrands_chg = true;
        }
        if (t.cm.scale) {
            _o.scalebarheight = true;
        }
        if (t.cm.filter) {
            _o.filterreaddepth = t.cm.filter;
        }
        // smooth?
        var trd = t.cm.set.rd_f;
        if (trd && trd.qtc && trd.qtc.smooth) {
            _o.smoothwindow = trd.qtc.smooth;
        }
        _o.tracks = {forward: {}, reverse: {}};
        var no_r = true;
        // if t is registry object, the member tracks are just names
        if (t.cm.set.cg_f) {
            if (typeof(t.cm.set.cg_f) == 'string') {
                var o3 = this.hmtk[t.cm.set.cg_f];
                if (o3) {
                    _o.tracks.forward.CG = {color: t.cm.color.cg_f, bg: t.cm.bg.cg_f, url: o3.url};
                }
            } else {
                _o.tracks.forward.CG = {color: t.cm.color.cg_f, bg: t.cm.bg.cg_f, url: t.cm.set.cg_f.url};
            }
        }
        if (t.cm.set.cg_r) {
            if (typeof(t.cm.set.cg_r) == 'string') {
                var o3 = this.hmtk[t.cm.set.cg_r];
                if (o3) {
                    _o.tracks.reverse.CG = {color: t.cm.color.cg_r, bg: t.cm.bg.cg_r, url: o3.url};
                    no_r = false;
                }
            } else {
                _o.tracks.reverse.CG = {color: t.cm.color.cg_r, bg: t.cm.bg.cg_r, url: t.cm.set.cg_r.url};
                no_r = false;
            }
        }
        if (t.cm.set.chg_f) {
            if (typeof(t.cm.set.chg_f) == 'string') {
                var o3 = this.hmtk[t.cm.set.chg_f];
                if (o3) {
                    _o.tracks.forward.CHG = {color: t.cm.color.chg_f, bg: t.cm.bg.chg_f, url: o3.url};
                }
            } else {
                _o.tracks.forward.CHG = {color: t.cm.color.chg_f, bg: t.cm.bg.chg_f, url: t.cm.set.chg_f.url};
            }
        }
        if (t.cm.set.chg_r) {
            if (typeof(t.cm.set.chg_r) == 'string') {
                var o3 = this.hmtk[t.cm.set.chg_r];
                if (o3) {
                    _o.tracks.reverse.CHG = {color: t.cm.color.chg_r, bg: t.cm.bg.chg_r, url: o3.url};
                    no_r = false;
                }
            } else {
                _o.tracks.reverse.CHG = {color: t.cm.color.chg_r, bg: t.cm.bg.chg_r, url: t.cm.set.chg_r.url};
                no_r = false;
            }
        }
        if (t.cm.set.chh_f) {
            if (typeof(t.cm.set.chh_f) == 'string') {
                var o3 = this.hmtk[t.cm.set.chh_f];
                if (o3) {
                    _o.tracks.forward.CHH = {color: t.cm.color.chh_f, bg: t.cm.bg.chh_f, url: o3.url};
                }
            } else {
                _o.tracks.forward.CHH = {color: t.cm.color.chh_f, bg: t.cm.bg.chh_f, url: t.cm.set.chh_f.url};
            }
        }
        if (t.cm.set.chh_r) {
            if (typeof(t.cm.set.chh_r) == 'string') {
                var o3 = this.hmtk[t.cm.set.chh_r];
                if (o3) {
                    _o.tracks.reverse.CHH = {color: t.cm.color.chh_r, bg: t.cm.bg.chh_r, url: o3.url};
                    no_r = false;
                }
            } else {
                _o.tracks.reverse.CHH = {color: t.cm.color.chh_r, bg: t.cm.bg.chh_r, url: t.cm.set.chh_r.url};
                no_r = false;
            }
        }
        if (t.cm.set.rd_f) {
            if (typeof(t.cm.set.rd_f) == 'string') {
                var o3 = this.hmtk[t.cm.set.rd_f];
                if (o3) {
                    _o.tracks.forward.ReadDepth = {color: t.cm.color.rd_f, bg: t.cm.bg.rd_f, url: o3.url};
                }
            } else {
                _o.tracks.forward.ReadDepth = {color: t.cm.color.rd_f, bg: t.cm.bg.rd_f, url: t.cm.set.rd_f.url};
            }
        }
        if (t.cm.set.rd_r) {
            if (typeof(t.cm.set.rd_r) == 'string') {
                var o3 = this.hmtk[t.cm.set.rd_r];
                if (o3) {
                    _o.tracks.reverse.ReadDepth = {color: t.cm.color.rd_r, bg: t.cm.bg.rd_r, url: o3.url};
                    no_r = false;
                }
            } else {
                _o.tracks.reverse.ReadDepth = {color: t.cm.color.rd_r, bg: t.cm.bg.rd_r, url: t.cm.set.rd_r.url};
                no_r = false;
            }
        }
        if (no_r) {
            delete _o.tracks.reverse;
        }
    } else if (t.ft == FT_matplot) {
        var lst = [];
        for (var i = 0; i < t.tracks.length; i++) {
            var t2 = t.tracks[i];
            // t2 will be tkname if t is registry obj
            if (typeof(t2) == 'string') {
                var t3 = this.getTkregistryobj(t2);
                if (t3) {
                    lst.push({
                        type: FT2verbal[t3.ft],
                        url: t3.url,
                        name: t3.label,
                        colorpositive: 'rgb(' + t3.qtc.pr + ',' + t3.qtc.pg + ',' + t3.qtc.pb + ')',
                    });
                }
            } else {
                lst.push({
                    type: FT2verbal[t2.ft],
                    url: t2.url,
                    name: t2.label,
                    colorpositive: 'rgb(' + t2.qtc.pr + ',' + t2.qtc.pg + ',' + t2.qtc.pb + ')',
                });
            }
        }
        _o.tracks = lst;
    } else if (t.ft == FT_catmat) {
        _o.rowcount = t.rowcount;
        _o.rowheight = t.rowheight;
    } else if (t.ft == FT_weaver_c) {
        _o.querygenome = t.cotton;
        _o.color = t.qtc.bedcolor;
        _o.weaver = {};
    }

    if (isCustom(t.ft)) {
        _o.type = FT2verbal[t.ft];
        _o.name = t.label;
        _o.url = t.url;
        //if(t.public) { _o.public=true; }
    } else {
        _o.name = t.name;
    }
    _o.mode = t.mode;
    if (t.defaultmode != undefined) {
        _o.defaultmode = t.defaultmode;
    }
    if (t.qtc) {
        _o.qtc = t.qtc;
    }
    if (t.showscoreidx != undefined) {
        _o.showscoreidx = t.showscoreidx;
        _o.scorenamelst = t.scorenamelst;
        _o.scorescalelst = t.scorescalelst;
    }
    if (t.md) {
        _o.metadata = {};
        for (var i = 0; i < t.md.length; i++) {
            if (t.md[i]) {
                if (gflag.mdlst[i].tag == literal_imd) {
                    // skip internal md
                    continue;
                }
                var a = [];
                for (var n in t.md[i]) {
                    a.push(n);
                }
                _o.metadata['md' + i] = a;
            }
        }
    }
    if (t.cateInfo) {
        _o.categories = t.cateInfo;
    }
    if (t.details) {
        _o.details = t.details;
    }
    if (t.geolst) {
        _o.geolst = t.geolst;
    }
    if (t.group != undefined) {
        _o.group = t.group;
    }
    if (t.horizontallines) {
        _o.horizontallines = t.horizontallines;
    }
    return _o;
};


function grandaddtracks(event) {
    menu_shutup();
    menu.grandadd.style.display = 'block';
    menu_show_beneathdom(12, event.target);
    gflag.browser.grandshowtrack();
//menu.grandadd.kwinput.focus();
}

Browser.prototype.grandshowtrack = function () {
    gflag.menu.bbj = this;
    if (!this.header) {
        menu.grandadd.says.style.display =
            menu.grandadd.pubh.style.display =
                menu.grandadd.cust.style.display = 'block';
    } else {
        menu.grandadd.says.style.display = this.header.no_number ? 'none' : 'block';
        menu.grandadd.pubh.style.display = this.header.no_publichub ? 'none' : 'block';
        menu.grandadd.cust.style.display = this.header.no_custtk ? 'none' : 'block';
        if (this.header.no_number) return;
    }
    var tmp = this.tkCount();
    var total = tmp[0],
        ctotal = tmp[1];
    var show = 0;
    var cshow = 0;
    for (var i = 0; i < this.tklst.length; i++) {
        var t = this.tklst[i];
        if (tkishidden(t)) continue;
        if (t.name in this.genome.decorInfo) continue;
        if (this.weaver && !this.weaver.iscotton) {
            // is target bbj
            if (t.cotton && t.ft != FT_weaver_c) continue;
            // is cottontk, skip
        }
        show++;
        if (!t.public && isCustom(t.ft)) {
            cshow++;
        }
    }
    var s = menu.grandadd.says;
    if (total == 0) {
        s.style.display = 'none';
    } else {
        s.style.display = 'block';
        stripChild(s, 0);
        var t = dom_create('table', s);
        var tr = t.insertRow(0);
        var td = tr.insertCell(0);
        td.vAlign = 'top';
        dom_create('span', td, 'font-size:250%;font-weight:bold;').innerHTML = total;
        td = tr.insertCell(1);
        td.vAlign = 'top';
        td.style.paddingTop = 5;
        td.innerHTML = '<span style="opacity:.6;font-size:70%;">TOTAL</span> / <span style="font-weight:bold;font-size:normal">' + show + '</span> <span style="opacity:.6;font-size:70%;">SHOWN</span>';
        dom_create('div', s, 'font-size:70%;opacity:.6;').innerHTML = 'CLICK FOR TRACK TABLE';
    }
    menu.grandadd.custtkcount.innerHTML = ctotal > 0 ? '(' + ctotal + ')' : '';
    if (this.weaver) {
        stripChild(menu.c32, 0);
        menu.c32.style.display = 'block';
        if (this.weaver.iscotton) {
            dom_create('div', menu.c32, 'background-color:#858585;color:white;text-align:center;').innerHTML = 'tracks from ' + this.genome.name;
        } else if (this.weaver.q) {
            // need to see if cotton genome is ansible, if so, no tracks
            var d = dom_create('div', menu.c32, 'padding:15px;border-top:1px solid #ccc;');
            dom_addtext(d, 'Show tracks for:').style.opacity = '0.7';
            for (var n in this.weaver.q) {
                dom_create('div', d, 'margin:10px;padding:5px;display:inline-block;', {
                    c: 'header_g',
                    t: n,
                    clc: weaver_showgenometk_closure(n)
                });
            }
        }
    }
};

function toggle28() {
    menu_shutup();
    menu.c35.style.display = 'block';
    var b = gflag.menu.bbj;
    var ctotal = b.tkCount()[1];
    if (ctotal == 0) {
        menu.c35.says.innerHTML = 'None yet.';
        menu.c35.opt.style.display = 'none';
    } else {
        menu.c35.says.innerHTML = '<span style="font-size:150%">' + ctotal + '</span> <span style="font-size:70%">TOTAL</span>';
        menu.c35.opt.style.display = 'block';
    }
    if (b.weaver && b.weaver.iscotton) {
        stripChild(menu.c32, 0);
        menu.c32.style.display = 'block';
        dom_create('div', menu.c32, 'background-color:#858585;color:white;text-align:center;').innerHTML = 'tracks from ' + b.genome.name;
    }
}


Browser.prototype.highlighttrack = function (lst) {
    /* put indicator over some tracks
     the tracks must be next to each other
     first element in the list is assumed to be the one on top (determines box position)
     */
    var pos = absolutePosition(lst[0].canvas);
    var h = 0;
    for (var i = 0; i < lst.length; i++) {
        h += tk_height(lst[i]) + parseInt(lst[i].canvas.style.paddingBottom);
    }
    placeIndicator3(pos[0] - this.move.styleLeft, pos[1], this.hmSpan, h);
};


Browser.prototype.findTrack = function (tkname, cotton) {
// display object
    for (var i = 0; i < this.tklst.length; i++) {
        var t = this.tklst[i];
        if (t.name == tkname) {
            if (t.ft == FT_weaver_c) {
                /* better logic here
                 target bbj finding weavertk, no worry about cotton
                 */
                return t;
            }
            if (this.weaver && this.weaver.iscotton) {
                // cottonbbj looking through
                return t;
            }
            if (cotton) {
                if (t.cotton && cotton == t.cotton) return t;
            } else {
                if (!t.cotton) return t;
            }
        }
    }
    return null;
};

Browser.prototype.removeTrackCanvas = function (tk) {
    if (tk.where == 1) {
        if (this.hmheaderdiv && tk.header) {
            try {
                this.hmheaderdiv.removeChild(tk.header);
            } catch (e) {
                print2console('stray tk header: ' + tk.label, 2);
            }
        }
        if (tk.canvas) {
            try {
                this.hmdiv.removeChild(tk.canvas);
            } catch (e) {
                print2console('stray tk canvas: ' + tk.label, 2);
            }
        }
        if (this.mcm && tk.atC) {
            try {
                this.mcm.tkholder.removeChild(tk.atC);
            } catch (e) {
                print2console('stray tk atC: ' + tk.atC, 2);
            }
        }
    } else {
        if (this.decorheaderdiv && tk.header) {
            try {
                this.decorheaderdiv.removeChild(tk.header);
            } catch (e) {
                print2console('stray tk header: ' + tk.label, 2);
            }
        }
        if (tk.canvas) {
            try {
                this.decordiv.removeChild(tk.canvas);
            } catch (e) {
                print2console('stray tk canvas: ' + tk.label, 2);
            }
        }
    }
};
Browser.prototype.removeTrack = function (namelst) {
    /* remove a track from view
     special treatment for matplot
     no special for cmtk
     */
    var hashmtk = false;
    for (var i = 0; i < namelst.length; i++) {
        var tk = this.findTrack(namelst[i]);
        if (!tk) continue;
        if (!tkishidden(tk)) {
            this.removeTrackCanvas(tk);
            if (tk.where == 1) {
                hashmtk = true;
            }
        }
        for (var j = 0; j < this.tklst.length; j++) {
            if (this.tklst[j].name == namelst[i]) {
                this.tklst.splice(j, 1);
                break;
            }
        }
    }
    if (this.weaver && this.weaver.iscotton) {
        // cottonbbj removing, must also remove from target
        var tbj = this.weaver.target;
        for (var i = 0; i < namelst.length; i++) {
            for (var j = 0; j < tbj.tklst.length; j++) {
                var t = tbj.tklst[j];
                if (t.name == namelst[i] && t.cotton == this.genome.name) {
                    tbj.tklst.splice(j, 1);
                    break;
                }
            }
        }
    }
// after removing
    var bbj = this;
    if (this.weaver && this.weaver.iscotton) {
        bbj = this.weaver.target;
    }
    if (hashmtk) {
        bbj.prepareMcm();
        bbj.drawMcm();
    }
    bbj.trackHeightChanged();
// to solve the problem that trihm pillars don't hide
    indicator.style.display = indicator6.style.display = 'none';
    bbj.aftertkaddremove(namelst);
    for (var tag in this.splinters) {
        this.splinters[tag].removeTrack(namelst);
    }
};


Genome.prototype.getTkregistryobj = function (name, ft) {
    var o = this.hmtk[name];
    if (!o) {
        o = this.decorInfo[name];
        if (!o) {
            if (__request_tk_registryobj) {
                o = __request_tk_registryobj(name, ft);
            }
        }
    }
    return o;
};


function tk_applydefaultstyle(tk) {
    if (!tk.qtc) {
        tk.qtc = {};
    }
    switch (tk.ft) {
        case FT_bed_n:
        case FT_anno_n:
        case FT_sam_n:
        case FT_bam_n:
        case FT_lr_n:
        case FT_ld_n:
        case FT_bed_c:
        case FT_anno_c:
            qtc_paramCopy(defaultQtcStyle.density, tk.qtc);
            qtc_paramCopy(defaultQtcStyle.anno, tk.qtc);
            break;
        case FT_weaver_c:
            tk.qtc.bedcolor = weavertkcolor_query;
            tk.qtc.height = 60;
            break;
        case FT_bedgraph_n:
            qtc_paramCopy(defaultQtcStyle.heatmap, tk.qtc);
            break;
        case FT_bedgraph_c:
            qtc_paramCopy(defaultQtcStyle.ft3, tk.qtc);
            break;
        case FT_sam_c:
        case FT_bam_c:
            qtc_paramCopy(defaultQtcStyle.density, tk.qtc);
            var ss = defaultQtcStyle.ft5;
            tk.qtc.textcolor = ss.textcolor;
            tk.qtc.fontsize = ss.fontsize;
            tk.qtc.fontfamily = ss.fontfamily;
            tk.qtc.fontbold = ss.fontbold;
            tk.qtc.forwardcolor = ss.forwardcolor;
            tk.qtc.reversecolor = ss.reversecolor;
            tk.qtc.mismatchcolor = ss.mismatchcolor;
            break;
        case FT_qdecor_n:
            qtc_paramCopy(defaultQtcStyle.ft8, tk.qtc);
            break;
        case FT_lr_c:
        case FT_ld_c:
            qtc_paramCopy(defaultQtcStyle.interaction, tk.qtc);
            break;
        case FT_cat_n:
            qtc_paramCopy(defaultQtcStyle.ft12, tk.qtc);
            break;
        case FT_cat_c:
            qtc_paramCopy(defaultQtcStyle.ft13, tk.qtc);
            break;
        case FT_bigwighmtk_n:
        case FT_bigwighmtk_c:
            qtc_paramCopy(defaultQtcStyle.ft3, tk.qtc);
            break;
        case FT_matplot:
            tk.qtc.height = 200;
            break;
        case FT_cm_c:
            tk.qtc = {height: 50};
            break;
        case FT_catmat:
            break;
        case FT_qcats:
            tk.qtc = {height: 100};
            break;
        default:
            fatalError('trying to assign default style but got unknown tk ft ' + tk.ft);
    }
}


Browser.prototype.makeTrackDisplayobj = function (name, ft) {
    /* create display object
     unified for all types
     registry object must already exist, no matter native or custom
     make doms for display

     TODO pwc, htest, bev?
     */
    var oobj = this.genome.getTkregistryobj(name, ft);
    if (!oobj) {
        print2console('Cannot make track, no registry object found for ' + name, 2);
        return null;
    }
// tk obj to be returned
    var obj = {label: oobj.label};

    /* recover display object from registry object
     */
    obj.name = name;
    obj.ft = ft;
    if (oobj.group) {
        obj.group = oobj.group;
    }
    obj.md = [];
    obj.attrlst = [];
    obj.attrcolor = [];
    if (oobj.md) {
        for (var i = 0; i < oobj.md.length; i++) {
            if (!oobj.md[i]) continue;
            var s = {};
            for (var t in oobj.md[i]) {
                s[t] = 1;
            }
            obj.md[i] = s;
        }
    }
    if (oobj.normalize) {
        var s = {};
        for (var k in oobj.normalize) {
            s[k] = oobj.normalize[k];
        }
        obj.normalize = s;
    }

// decide where (ghm or under) this track should appear initially
    if (ft == FT_matplot) {
        obj.where = 1;
    } else if (ft == FT_bam_n || ft == FT_bam_c || ft == FT_sam_n || ft == FT_sam_c) {
        obj.where = 1;
    } else if (ft == FT_ld_c || ft == FT_ld_n) {
        obj.where = 2;
    } else if ((ft == FT_bed_n || ft == FT_bed_c || ft == FT_lr_n || ft == FT_lr_c || ft == FT_qdecor_n) || (name in this.genome.decorInfo)) {
        obj.where = 2;
    } else {
        obj.where = 1;
    }

// initial mode, should make into track2Style
    if (isHmtk(ft) || ft == FT_matplot || ft == FT_cm_c) {
        obj.mode = M_show;
    } else if (ft == FT_ld_c || ft == FT_ld_n) {
        obj.mode = M_trihm;
    } else {
        obj.mode = oobj.mode;
    }

// always-on
    obj.url = oobj.url;
    obj.details = oobj.details;

// for weaving
    if (oobj.cotton) {
        // cotton passed for custom track
        obj.cotton = oobj.cotton;
    } else if (this.weaver && this.weaver.iscotton) {
        // won't get cotton from registry object of native track, need to detect by this method
        obj.cotton = this.genome.name;
    }

// set internal md
    var mdi = getmdidx_internal();
    var a = {};
    a[FT2verbal[obj.ft]] = 1;
    if (obj.ft == FT_weaver_c) {
        a[obj.cotton] = 1;
    } else {
        a[this.genome.name] = 1;
    }
    obj.md[mdi] = a;

// track canvas
    var c = document.createElement('canvas');
    c.height = c.width = 1;
    c.style.display = 'block';
    c.tkname = name;
    c.onmousemove = track_Mmove;
    c.onmouseout = track_Mout;
    c.oncontextmenu = menu_track_browser;
    obj.canvas = c;
    c.onclick = track_click;
    if (obj.cotton) c.cotton = obj.cotton;

// mcm canvas (hidden in splinter)
    c = document.createElement('canvas');
    c.style.display = "block";
    c.tkname = name;
    c.width = c.height = 1;
    c.onmousedown = mcm_Mdown;
    c.onmouseover = mcm_Mover;
    c.onmousemove = mcm_tooltipmove;
    c.onmouseout = mcm_Mout;
    c.oncontextmenu = menu_track_mcm;
    obj.atC = c;
    if (obj.cotton) c.cotton = obj.cotton;

// header canvas (hidden in splinter)
    c = document.createElement('canvas');
    c.style.display = 'block';
    c.width = c.height = 1;
    c.tkname = name;
    c.oncontextmenu = menu_track_browser;
    c.onmouseover = trackheader_Mover;
    c.onmouseout = trackheader_Mout;
    c.onmousedown = trackheader_MD;
    obj.header = c;
    if (obj.cotton) c.cotton = obj.cotton;

    /* apply style
     */
    obj.qtc = {anglescale: 1};
    tk_applydefaultstyle(obj);

    switch (ft) {
        case FT_ld_n:
        case FT_ld_c:
            obj.ld = {hash: {}, ticksize: 5, topheight: 100};
            break;
        case FT_weaver_c:
            obj.weaver = {};
            for (var n in oobj.weaver) {
                obj.weaver[n] = oobj.weaver[n];
            }
            if (oobj.reciprocal) {
                obj.reciprocal = oobj.reciprocal;
            }
            if (!obj.qtc.stackheight) {
                obj.qtc.stackheight = weavertkstackheight;
            }
            break;
        case FT_matplot:
            if (!oobj.tracks) fatalError('.tracks missing from matplot registry object: ' + name);
            obj.tracks = [];
            /* registry obj .tracks are only names
             when adding matplot by loading member tk anew, will only use name
             if making matplot from menu by combining existing member tk,
             must replace name with display obj of member tk
             */
            for (var i = 0; i < oobj.tracks.length; i++) {
                var _o = this.findTrack(oobj.tracks[i]);
                if (_o) {
                    obj.tracks.push(_o);
                } else {
                    obj.tracks.push(oobj.tracks[i]);
                }
            }
            obj.qtc.height = Math.min(150, 30 * obj.tracks.length);
            obj.qtc.thtype = scale_auto;
            break;
        case FT_cm_c:
            if (!oobj.cm) fatalError('.cm missing from methylC registry object');
            var c = oobj.cm;
            if (!c.color) fatalError('.color missing from methylC registry object');
            if (!c.bg) fatalError('.bg missing from methylC registry object');
            var s = {isfirst: true};
            for (var k in c.set) {
                s[k] = c.set[k];
            }
            obj.cm = {
                set: s,
                combine: (c.combine == undefined ? false : c.combine),
                combine_chg: (c.combine_chg == undefined ? false : c.combine_chg),
                scale: (c.scale == undefined ? false : c.scale),
                filter: (c.filter == undefined ? 0 : c.filter),
                color: c.color, bg: c.bg
            };
            break;
        case FT_catmat:
            obj.rowheight = oobj.rowheight;
            obj.rowcount = oobj.rowcount;
            obj.qtc.height = 1 + obj.rowheight * obj.rowcount;
            break;
    }

    /* override default style
     */
    if (oobj.qtc) {
        qtc_paramCopy(oobj.qtc, obj.qtc);
    }

    if (obj.qtc.defaultmode) {
        obj.defaultmode = obj.qtc.defaultmode;
        delete obj.qtc.defaultmode;
    }

    if (oobj.cateInfo) {
        obj.cateInfo = {};
        cateInfo_copy(oobj.cateInfo, obj.cateInfo);
    }
    if (oobj.public) {
        obj.public = true;
    }
    if (oobj.showscoreidx != undefined) {
        obj.showscoreidx = oobj.showscoreidx;
        if (oobj.scorenamelst) {
            obj.scorenamelst = oobj.scorenamelst;
        }
        if (oobj.scorescalelst) {
            obj.scorescalelst = oobj.scorescalelst;
        }
        if (!obj.scorenamelst) fatalError('.scorenamelst missing');
        if (!obj.scorescalelst || obj.scorescalelst.length == 0) {
            // this happens for native anno tracks
            obj.scorescalelst = [];
            for (var i = 0; i < obj.scorenamelst.length; i++) {
                obj.scorescalelst.push({type: scale_auto});
            }
        }
    }
    if (oobj.queryUrl) {
        obj.queryUrl = oobj.queryUrl;
    }
    if (oobj.mastertk) {
        obj.mastertk = this.findTrack(oobj.mastertk);
    }
    if (oobj.issnp) {
        obj.issnp = true;
    }
    if (oobj.dbsearch) {
        obj.dbsearch = true;
    }
    if (oobj.querytrack) {
        obj.querytrack = oobj.querytrack;
        obj.querytrack.mode = tkdefaultMode(obj.querytrack);
    }

    if (oobj.horizontallines) {
        obj.horizontallines = oobj.horizontallines;
    }
    return obj;
};


Browser.prototype.trackdom2holder = function () {
    /* track dom elements (canvas or labels) insert to holder
     */
    var inghmlst = [], outghmlst = [], hidden = [];
    for (var i = 0; i < this.tklst.length; i++) {
        var tk = this.tklst[i];
        if (tkishidden(tk)) {
            hidden.push(tk);
            continue;
        }
        if (tk.where == 1) {
            inghmlst.push(tk);
            if (this.hmdiv && tk.canvas) this.hmdiv.appendChild(tk.canvas);
            if (this.mcm && tk.atC) {
                this.mcm.tkholder.appendChild(tk.atC);
                tk.atC.style.display = 'block';
            }
            if (this.hmheaderdiv && tk.header) this.hmheaderdiv.appendChild(tk.header);
        } else {
            outghmlst.push(tk);
            if (this.decordiv && tk.canvas) this.decordiv.appendChild(tk.canvas);
            if (tk.atC) tk.atC.style.display = 'none';
            if (this.decorheaderdiv && tk.header) this.decorheaderdiv.appendChild(tk.header);
        }
    }
    inghmlst = inghmlst.concat(outghmlst);
    inghmlst = inghmlst.concat(hidden);
    this.tklst = inghmlst;
    this.trackHeightChanged();
};


function mergeStackdecor(sink, source, ft, direction, offsetShift) {
    /* if is sam file:
     merge sink/source reads that have same id (make them a paired end)
     else, if source item also exists in sink (tell by item id), skip
     else, push it into sink

     args:
     - sink: array of bed items of "sink" region
     - source: array of bed items of "source" region
     - direction, offsetShift: from Browser.move

     ** beware **
     if move left, need to shift sink box start using move.offsetShift
     if move right, need to shift source box start using sink region length
     */
    if (direction != 'l' && direction != 'r') fatalError("mergeStackdecor: move direction error");
    if (direction == 'l') {
        // shift sink
        for (var i = 0; i < sink.length; i++) {
            sink[i].boxstart += offsetShift;
        }
    } else {
        // shift source
        for (var i = 0; i < source.length; i++) {
            var t = source[i];
            if (!t.boxstart) {
                t.boxstart = offsetShift;
            } else {
                t.boxstart += offsetShift;
            }
        }
    }
    var isSam = ft == FT_bam_n || ft == FT_bam_c;
// make lookup table for items in sink
    var lookup = {}; // key: item id, val: item array
    for (var i = 0; i < sink.length; i++) {
        lookup[sink[i].id] = sink[i];
    }
    for (var i = 0; i < source.length; i++) {
        var _item = lookup[source[i].id];
        if (_item) {
            if (isSam) {
                if (!_item.hasmate) {
                    // the sink read is not paired yet
                    sink.push(source[i]);
                }
            } else if (ft == FT_weaver_c) {
                delete _item.hsp;
                _item.genomealign = source[i].genomealign;
            }
        } else {
            sink.push(source[i]);
        }
    }
}


function menu_multipleselect_cancel() {
    gflag.menu.bbj.multipleselect_cancel();
    menu_hide();
}
Browser.prototype.multipleselect_cancel = function () {
    var bbj = this;
    if (bbj.trunk) bbj = bbj.trunk;
    for (var i = 0; i < bbj.tklst.length; i++) {
        var t = bbj.tklst[i];
        t.menuselected = false;
        if (t.header) {
            t.header.style.backgroundColor = '';
        }
    }
    gflag.menu.tklst = [];
};


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

Browser.prototype.track_click_multiselect = function (tkname, cotton) {
    /* must be called on a trunk
     */
    var tk = this.findTrack(tkname, cotton);
    if (!tk) {
        print2console(tkname + ' went missing', 2);
        return;
    }
// refresh gflag.menu.tklst, use only selected
    gflag.menu.tklst = [];
    for (var i = 0; i < this.tklst.length; i++) {
        var t = this.tklst[i];
        if (t.menuselected) {
            // only preserve those that are real and selected
            gflag.menu.tklst.push(t);
        }
    }
    var isnew = true;
    var tcn = tkname + cotton;
    for (var i = 0; i < gflag.menu.tklst.length; i++) {
        var t = gflag.menu.tklst[i];
        if (t.name + t.cotton == tcn) {
            // this track was selected, de-select it
            isnew = false;
            gflag.menu.tklst.splice(i, 1);
            tk.header.style.backgroundColor = '';
            tk.menuselected = false;
            break;
        }
    }
    if (isnew) {
        tk.menuselected = true;
        tk.header.style.backgroundColor = 'yellow';
        gflag.menu.tklst.push(tk);
    }
};

Genome.prototype.customgenomeparam = function () {
    if (!this.iscustom) return '';
    var lst = [];
    for (var n in this.scaffold.len) {
        lst.push(n);
        lst.push(this.scaffold.len[n]);
    }
    return '&iscustomgenome=on&scaffoldlen=' + lst.join(',');
};


Browser.prototype.ajax_addtracks = function (lst) {
    /* must provide tkobj, works for mixture of native/custom tracks
     custom track might be un-registered
     but if adding compound tracks, member tracks must be registered!
     */
    if (lst.length == 0) {
        return;
    }
    var olst = [];
    for (var i = 0; i < lst.length; i++) {
        var o = lst[i];
        if (o.ft == undefined || !FT2verbal[o.ft]) {
            print2console('missing or wrong ft', 2);
            continue;
        }
        if (o.ft == FT_cm_c) {
            if (!o.cm || !o.cm.set) {
                o = this.genome.hmtk[o.name];
                if (!o) {
                    print2console('registry object missing for a cmtk', 2);
                    continue;
                }
            }
            for (var k in o.cm.set) {
                var n = o.cm.set[k];
                var t = this.genome.hmtk[n];
                if (!t) {
                    print2console('registry object missing for cmtk member: ' + k, 2);
                } else {
                    olst.push({name: n, url: t.url, ft: t.ft, label: t.label, mode: M_show, qtc: {}});
                }
            }
            /* this cmtk won't go into olst
             but upon ajax return it should be rebuilt
             push it to init param
             TODO should be like matplot
             */
            if (!this.init_bbj_param) {
                this.init_bbj_param = {cmtk: []};
            }
            if (!this.init_bbj_param.cmtk) {
                this.init_bbj_param.cmtk = [];
            }
            this.init_bbj_param.cmtk.push(o);
            continue;
        } else if (o.ft == FT_matplot) {
            if (!o.tracks) {
                o = this.genome.hmtk[o.name];
                if (!o) {
                    print2console('registry obj missing for matplot', 2);
                    continue;
                }
            }
            for (var j = 0; j < o.tracks.length; j++) {
                var n = o.tracks[j];
                var t = this.genome.getTkregistryobj(n);
                if (!t) {
                    print2console('matplot member missing: ' + n, 2);
                } else {
                    var m = tkdefaultMode(t);
                    if (m != M_show) {
                        m = M_den;
                    }
                    olst.push({name: n, url: t.url, ft: t.ft, label: t.label, mode: m, qtc: {}});
                }
            }
            this.tklst.push(this.makeTrackDisplayobj(o.name, o.ft));
            continue;
        }
        if (!o.mode) {
            o.mode = tkdefaultMode(o);
        }
        olst.push(o);
    }
    this.cloak();
    this.shieldOn();
    var bbj = this;
// allow custom genome
    this.ajax(this.displayedRegionParamPrecise() + '&addtracks=on&' +
    'dbName=' + this.genome.name +
    this.genome.customgenomeparam() +
    trackParam(olst), function (data) {
        bbj.ajax_addtracks_cb(data);
    });
};

Browser.prototype.ajax_addtracks_cb = function (data) {
    if (!data) {
        print2console('server crashed, please refresh and start over', 2);
        return;
    }
    var count = this.tklst.length;
    this.jsonAddtracks(data);
    if (count < this.tklst.length) {
        print2console('Tracks added', 1);
    }
    this.unveil();
    this.shieldOff();
    this.ajax_loadbbjdata(this.init_bbj_param);
};

Browser.prototype.jsonAddtracks = function (data) {
    /* first, need to register those that are new customs */
    if (data.brokenbeads) {
        print2console('Failed to load following tracks:', 0);
        var lst = data.brokenbeads;
        for (var i = 0; i < lst.length; i++) {
            var w = '<span style="background-color:red;color:white;">&nbsp;' + FT2verbal[lst[i].ft] + '&nbsp;</span> ' +
                (isCustom(lst[i].ft) ? lst[i].url : '');
            print2console(w, 2);
            var d = document.createElement('div');
            this.refreshcache_maketkhandle(d, lst[i]);
            alertbox_addmsg({text: w, refreshcachehandle: d});
        }
    }
    var lst = data.tkdatalst;
    /* pre-process json data
     */
    for (var i = 0; i < lst.length; i++) {
        if (!lst[i].data) {
            // no data, wrong track
            print2console('Error adding ' + FT2verbal[lst[i].ft] + ' track "' + lst[i].label + '"', 3);
            continue;
        }
        if (!isCustom(lst[i].ft)) continue;
        if (lst[i].name in this.genome.hmtk) continue;
        /* unregistered custtk, register it here
         what's the possibilities??
         */
        this.genome.registerCustomtrack(lst[i]);
    }
    /* now all tracks should be registered, add them */
    var tknamelst = this.jsonTrackdata(data);
    for (var i = 0; i < tknamelst.length; i++) {
        if (!tknamelst[i][1]) continue;
        // newly added tk
        var t = this.findTrack(tknamelst[i][0]);
        /*
         if(this.weaver && this.weaver.iscotton) {
         // cottonbbj adding a new track, must put to target
         this.weaver.target.tklst.push(t);
         }
         */
        if (t.mastertk && t.mastertk.ft == FT_matplot) {
            // new tk belongs to matplot, assemble matplot
            var nlst = [];
            for (var j = 0; j < t.mastertk.tracks.length; j++) {
                var o = t.mastertk.tracks[j];
                if (typeof(o) == 'string') {
                    nlst.push(this.findTrack(o));
                } else {
                    nlst.push(o);
                }
            }
            t.mastertk.tracks = nlst;
        }
    }

    if (!this.init_bbj_param) {
        var someingroup = false;
        for (var i = 0; i < tknamelst.length; i++) {
            if (this.findTrack(tknamelst[i][0]).group != undefined) {
                someingroup = true;
                break;
            }
        }
        if (someingroup) {
            this.drawTrack_browser_all();
        } else {
            // nobody in group, only draw involved ones
            for (var i = 0; i < tknamelst.length; i++) {
                var o = this.findTrack(tknamelst[i][0]);
                if (!o) continue;
                if (o.mastertk) {
                    this.drawTrack_browser(o.mastertk);
                } else {
                    this.stack_track(o, 0);
                    this.drawTrack_browser(o);
                }
            }
        }

        if (!this.weaver || !this.weaver.iscotton) {
            this.prepareMcm();
            this.drawMcm();
            this.trackHeightChanged();
        }

        var newlst = []; // names of newly added tracks
        for (var i = 0; i < tknamelst.length; i++) {
            if (tknamelst[i][1]) {
                newlst.push(tknamelst[i][0]);
            }
        }
        this.aftertkaddremove(newlst);
        if (this.trunk) {
            /* !!! this is a splinter, sync track style and order, no facet
             */
            var nk = this.trunk;
            for (var i = 0; i < this.tklst.length; i++) {
                var t0 = this.tklst[i];
                if (tkishidden(t0)) continue;
                var t = nk.findTrack(t0.name);
                if (!t) {
                    // might not be error because when deleting track from trunk
                    print2console('track missing from trunk ' + t0.label, 2);
                    continue;
                }
                qtc_paramCopy(t.qtc, t0.qtc);
            }
            var newlst = [];
            for (var i = 0; i < nk.tklst.length; i++) {
                var t = nk.tklst[i];
                if (tkishidden(t)) continue;
                for (var j = 0; j < this.tklst.length; j++) {
                    var t2 = this.tklst[j];
                    if (t2.name == t.name) {
                        t2.where = t.where;
                        newlst.push(t2);
                        this.tklst.splice(j, 1);
                        break;
                    }
                }
            }
            this.tklst = newlst.concat(this.tklst);
            this.trackdom2holder();
        }
    }

// add new cottontk to target, do this after tracks are rendered
    if (this.weaver && this.weaver.iscotton) {
        var target = this.weaver.target;
        for (var i = 0; i < tknamelst.length; i++) {
            if (!tknamelst[i][1]) continue;
            var t = this.findTrack(tknamelst[i][0]);
            target.tklst.push(t);
        }
        target.trackdom2holder();
        target.prepareMcm();
        target.drawMcm();
    }

    if (this.splinterTag) return;

    var hassp = false;
    for (var a in this.splinters) {
        hassp = true;
        break;
    }
    if (!hassp) return;
// this is a trunk with splinters
    var singtk = [], // singular tk
        cmtk = [];
    for (var i = 0; i < tknamelst.length; i++) {
        var t = this.findTrack(tknamelst[i][0]);
        if (t.ft == FT_cm_c) {
            for (var a in t.cm.set) {
                singtk.push(t.cm.set[a]);
            }
            cmtk.push(t);
        } else {
            singtk.push(t);
        }
    }
// by adding cmtk for trunk, cmtk won't show up in tknamelst, but in .init_bbj_param
    if (this.init_bbj_param && this.init_bbj_param.cmtk) {
        for (var i = 0; i < this.init_bbj_param.cmtk.length; i++) {
            cmtk.push(this.init_bbj_param.cmtk[i]);
        }
    }
    for (var k in this.splinters) {
        var b = this.splinters[k];
        if (cmtk.length > 0) {
            if (!b.init_bbj_param) b.init_bbj_param = {};
            if (!b.init_bbj_param.cmtk) b.init_bbj_param.cmtk = [];
            for (var i = 0; i < cmtk.length; i++) {
                b.init_bbj_param.cmtk.push(cmtk[i]);
            }
        }
        b.ajax_addtracks(singtk);
    }
};


Browser.prototype.aftertkaddremove = function (namelst) {
    switch (gflag.menu.context) {
        case 10:
            // clicked a grid cell, or a list cell
            this.facetclickedcell_remake();
            return;
        case 9:
            facet_term_selectall();
            break;
        case 23:
            tkkwsearch();
            break;
        case 22:
            menu_custtk_showall();
            break;
        case 1:
        case 2:
            break;
    }
    if (namelst.length > 0 && (!this.trunk)) {
        this.generateTrackselectionLayout();
    }
};


Browser.prototype.jsonTrackdata = function (data) {
    /* parse track data from json object
     will create display object if the track is new
     handles *panning*
     preprocessing of weaver hsp
     do not render
     */
    var lst = data.tkdatalst;
    if (lst.length == 0) return [];

    var tknames = [];
    var hasnewtk = false;
    var weavertk = [];
    for (var i = 0; i < lst.length; i++) {
        if (!lst[i].data) continue;
        var obj = this.findTrack(lst[i].name);
        if (!obj) {
            obj = this.makeTrackDisplayobj(lst[i].name, lst[i].ft);
            this.tklst.push(obj);
            tknames.push([lst[i].name, true]);
            hasnewtk = true;
        } else {
            tknames.push([lst[i].name, false]);
        }

        /* a few attributes of display object need to be recovered from the json data object
         e.g. decor track mode, long range track filtering scores
         TODO tidy up logic, obj should carry these attributes already, unless that's something changed by cgi
         */
        if (!isHmtk(obj.ft)) {
            // decor track's stuff
            if ('mode' in lst[i]) obj.mode = lst[i].mode;
            if (obj.ft == FT_lr_c) {
                if ('pfilterscore' in lst[i]) obj.qtc.pfilterscore = lst[i].pfilterscore;
                if ('nfilterscore' in lst[i]) obj.qtc.nfilterscore = lst[i].nfilterscore;
            }
        }
        // work out the data
        var dj = lst[i].data; // data from json
        if (isNumerical(obj) || isHmtk(obj.ft) || obj.ft == FT_catmat || obj.ft == FT_qcats) {
            // numerical or cat
            var smooth = (obj.qtc && obj.qtc.smooth);
            if (!this.move.direction) {
                if (smooth) {
                    obj.data_raw = dj;
                    if (!obj.data) {
                        smooth_tkdata(obj);
                    }
                } else {
                    obj.data = dj;
                }
            } else {
                var v = smooth ? obj.data_raw : obj.data;
                if (this.move.direction == 'l') {
                    if (this.move.merge) {
                        v[0] = dj[dj.length - 1].concat(v[0]);
                        dj.pop();
                    }
                    v = dj.concat(v);
                } else {
                    if (this.move.merge) {
                        var idx = v.length - 1;
                        v[idx] = v[idx].concat(dj[0]);
                        dj.shift();
                    }
                    v = v.concat(dj);
                }
                if (smooth) {
                    obj.data_raw = v;
                } else {
                    obj.data = v;
                }
            }
            obj.skipped = undefined;
        } else if (obj.mode == M_thin || obj.mode == M_full || obj.mode == M_arc || obj.mode == M_trihm || obj.mode == M_bar) {
            // stack data
            var is_ld = obj.ft == FT_ld_c || obj.ft == FT_ld_n;
            if (!this.move.direction) {
                if (is_ld) {
                    obj.ld.data = dj;
                } else {
                    obj.data = dj;
                }
                if (lst[i].skipped == undefined) {
                    obj.skipped = 0;
                } else {
                    obj.skipped = lst[i].skipped;
                }
            } else {
                if (is_ld) {
                    // no need to do .boxstart offset shift
                    if (this.move.direction == 'l') {
                        if (this.move.merge) {
                            mergeStackdecor(obj.ld.data[0], dj[dj.length - 1], obj.ft, this.move.direction);
                            dj.pop();
                        }
                        obj.ld.data = dj.concat(obj.ld.data);
                    } else {
                        if (this.move.merge) {
                            mergeStackdecor(obj.ld.data[obj.ld.data.length - 1], dj[0], obj.ft, this.move.direction);
                            dj.shift();
                        }
                        obj.ld.data = obj.ld.data.concat(dj);
                    }
                } else {
                    if (this.move.direction == 'l') {
                        if (this.move.merge) {
                            mergeStackdecor(obj.data[0], dj[dj.length - 1], obj.ft, this.move.direction, this.move.offsetShift);
                            dj.pop();
                        }
                        obj.data = dj.concat(obj.data);
                    } else {
                        if (this.move.merge) {
                            mergeStackdecor(obj.data[obj.data.length - 1], dj[0], obj.ft, this.move.direction, this.move.offsetShift);
                            dj.shift();
                        }
                        obj.data = obj.data.concat(dj);
                    }
                    if (lst[i].skipped != undefined) {
                        if (obj.skipped == undefined) obj.skipped = 0;
                        obj.skipped += lst[i].skipped;
                    }
                }
            }
        } else {
            fatalError('jsonTrackdata: unknown display mode');
        }
        if (obj.ft == FT_weaver_c) {
            weavertk.push(obj);
        }
    }
// done making obj.data
    if (weavertk.length > 0) {
        /* weaving
         sort out alignment data from weaver tk
         */
        if (!this.move.direction) {
            // clear data, TODO don't clear when adding new weaver
            this.weaver.insert = [];
            for (var i = 0; i < this.regionLst.length; i++) {
                this.weaver.insert.push({});
            }
        }
        var bpl = this.entire.atbplevel;
        for (var wid = 0; wid < weavertk.length; wid++) {
            var wtk = weavertk[wid];
            var querygenome = wtk.cotton;
            if (!querygenome) fatalError('.cotton missing from weaver tk');
            if (!(querygenome in this.weaver.q)) fatalError(querygenome + ' missing from browser.weaver');
            this.weaver.q[querygenome].weaver.track = wtk;

            for (var rid = 0; rid < this.regionLst.length; rid++) {
                var thisregion = this.regionLst[rid];
                for (var aid = 0; aid < wtk.data[rid].length; aid++) {
                    // one alignment
                    var item = wtk.data[rid][aid];
                    if (item.hsp) {
                        // moving, old item has got hsp
                        continue;
                    }
                    var aln = item.genomealign;
                    if (!aln) {
                        print2console('.genomealign missing: ' + wtk.label + ' ' + rid + ' ' + aid, 2);
                        continue;
                    }
                    /* hsp based on this alignment */
                    var samestrand = aln.strand == '+'; // +/+ alignment
                    var hsp = {
                        querystart: aln.start,
                        querystop: aln.stop,
                        querychr: aln.chr,
                        strand: aln.strand,
                        queryseq: aln.queryseq,
                        targetseq: aln.targetseq,
                        targetrid: rid,
                        gap: {},
                        insert: {},
                    };
                    delete item.genomealign;
                    item.hsp = hsp;

                    if (wtk.weaver.mode == W_rough) {
                        // may detect cases without sequence
                        hsp.targetstart = item.start;
                        hsp.targetstop = item.stop;
                        continue;
                    }

                    var chewid = 0; // common idx to chew on target/query alignment
                    var targetstart = item.start;
                    // chew up alignment in front of region
                    while (targetstart < thisregion[3]) {
                        if (hsp.targetseq[chewid] != '-') {
                            targetstart++;
                        }
                        if (hsp.queryseq[chewid] != '-') {
                            if (samestrand) {
                                hsp.querystart++;
                            } else {
                                hsp.querystop--;
                            }
                        }
                        chewid++;
                    }
                    hsp.chew_start = chewid;
                    hsp.targetstart = targetstart;
                    if (samestrand) {
                        // hsp stop awaits to be determined
                        hsp.querystop = hsp.querystart;
                    } else {
                        // hsp start awaits
                        hsp.querystart = hsp.querystop;
                    }
                    // chew up alignment in view range (according to target), detect gap on target/query
                    hsp.targetstop = Math.min(item.stop, thisregion[4]);
                    var targetcoord = targetstart,
                        targetgapcount = 0,
                        querygapcount = 0;
                    while (targetcoord < hsp.targetstop) {
                        if (hsp.targetseq[chewid] == '-') {
                            targetgapcount++;
                        } else {
                            if (targetgapcount > 0) {
                                // gap opens on target, treat as insertion to query for this hsp
                                // only gapwidth>1px will be considered
                                if (targetcoord in this.weaver.insert[rid]) {
                                    this.weaver.insert[rid][targetcoord] = Math.max(this.weaver.insert[rid][targetcoord], targetgapcount);
                                } else {
                                    this.weaver.insert[rid][targetcoord] = targetgapcount;
                                }
                                // register insert in hsp
                                hsp.insert[targetcoord] = targetgapcount;
                                targetgapcount = 0;
                            }
                            targetcoord++;
                        }
                        if (hsp.queryseq[chewid] == '-') {
                            querygapcount++;
                        } else {
                            if (querygapcount > 0) {
                                // treat as deletion from query, private to this query
                                if (samestrand) {
                                    hsp.gap[hsp.querystop] = querygapcount;
                                } else {
                                    hsp.gap[hsp.querystart] = querygapcount;
                                }
                                querygapcount = 0;
                            }
                            if (samestrand) {
                                hsp.querystop++;
                            } else {
                                hsp.querystart--;
                            }
                        }
                        chewid++;
                    }
                    hsp.chew_stop = chewid;
                }
            }
            // done making hsp for this wtk
        }
        if (this.weaver.mode == W_fine) {
            // not changing summarysize but the entire onscreen span
            // don't do this for stitch
            var i = this.regionLst.length - 1;
            this.entire.spnum = this.cumoffset(i, this.regionLst[i][4]);
            if (this.move.direction != 'r') {
                // unless moving right, need to recalculate styleLeft, preserve existing vstart
                var d = this.dspBoundary;
                var x = this.cumoffset(d.vstartr, d.vstartc);
                if (!x) fatalError('lost vstartr after weaving');
                this.placeMovable(-parseInt(x));
            }
            this.updateDspBoundary();
        }
    }
    if (hasnewtk) {
        this.trackdom2holder();
    }
    return tknames;
};


/*** __track__ ends ***/

