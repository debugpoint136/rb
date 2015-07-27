/**
 * ===BASE===// drawTk // menu_update_track.js
 * @param 
 */

function menu_update_track(updatecontext) {
    /* splinter tk no longer shares qtc with trunk tk
     all style changes are applied on trunk
     and must be copied to splinter, what a labor
     calling drawTrack_browser(trunk_tk) will automatically redraw splinter
     */
    var bbj = gflag.menu.bbj;
    switch (gflag.menu.context) {
        case 1:
        case 2:
            // always switch to trunk
            if (bbj.splinterTag) {
                bbj = bbj.trunk;
            }
            var _lst = bbj.tklstfrommenu();
            var A = false, // will re-issue ajax
                A_tklst = [];
            var groupScaleChange = []; // array idx is group idx, ele: {scale: min: max:}
            var takelog = false;
            for (var i = 0; i < _lst.length; i++) {
                // just in case it's splinter's tk
                var tk = bbj.findTrack(_lst[i].name);
                if (!tk || tk.mastertk) {
                    continue;
                }
                var tkreg = bbj.genome.getTkregistryobj(tk.name);
                if (!tkreg) {
                    print2console('registry object not found: ' + tk.label, 2);
                }
                // when changing y scale, need to tell if is numerical, apart from isNumerical also if using score
                var useScore = (tk.showscoreidx != undefined && tk.showscoreidx >= 0);
                var U = false, // re-rendering
                    M = false, // update config menu on tk
                    H = false; // tk height changed
                switch (updatecontext) {
                    case 1:
                        var c = menu.c50.color1.style.backgroundColor;
                        if (isNumerical(tk)) {
                            var x = colorstr2int(c);
                            tk.qtc.pr = x[0];
                            tk.qtc.pg = x[1];
                            tk.qtc.pb = x[2];
                            tkreg.qtc.pr = x[0];
                            tkreg.qtc.pg = x[1];
                            tkreg.qtc.pb = x[2];
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.pr = x[0];
                                tk2.qtc.pg = x[1];
                                tk2.qtc.pb = x[2];
                            }
                            U = true;
                        }
                        break;
                    case 2:
                        var c = menu.c50.color2.style.backgroundColor;
                        if (isNumerical(tk)) {
                            var x = colorstr2int(c);
                            tk.qtc.nr = x[0];
                            tk.qtc.ng = x[1];
                            tk.qtc.nb = x[2];
                            tkreg.qtc.nr = x[0];
                            tkreg.qtc.ng = x[1];
                            tkreg.qtc.nb = x[2];
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.nr = x[0];
                                tk2.qtc.ng = x[1];
                                tk2.qtc.nb = x[2];
                            }
                            U = true;
                        }
                        break;
                    case 3:
                        if (isNumerical(tk)) {
                            tk.qtc.pth = menu.c50.color1_1.style.backgroundColor;
                            tkreg.qtc.pth = tk.qtc.pth;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.pth = tk.qtc.pth;
                            }
                            U = true;
                        }
                        break;
                    case 4:
                        if (isNumerical(tk)) {
                            tk.qtc.nth = menu.c50.color2_1.style.backgroundColor;
                            tkreg.qtc.nth = tk.qtc.nth;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.nth = tk.qtc.nth;
                            }
                            U = true;
                        }
                        break;
                    case 5:
                        var v = parseInt(menu.c51.select.options[menu.c51.select.selectedIndex].value);
                        // should not be scale_fix
                        if (isNumerical(tk) || tk.ft == FT_matplot) {
                            tk.qtc.thtype = v;
                            tkreg.qtc.thtype = v;
                            if (v == scale_percentile) {
                                tk.qtc.thpercentile = parseInt(menu.c51.percentile.says.innerHTML);
                                tkreg.qtc.thpercentile = tk.qtc.thpercentile;
                            }
                            qtc_thresholdcolorcell(tk.qtc);
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.thtype = v;
                                if (v == scale_percentile) {
                                    tk2.qtc.thpercentile = tk.qtc.thpercentile;
                                }
                            }
                            U = true;
                            if (tk.group != undefined) {
                                groupScaleChange[tk.group] = {scale: scale_auto};
                            }
                        } else if (useScore) {
                            // "Apply to all" spilling over
                            // no matter if auto or percentile, force to auto
                            tk.scorescalelst[tk.showscoreidx].type = scale_auto;
                            tkreg.scorescalelst[tk.showscoreidx].type = scale_auto;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.scorescalelst[tk.showscoreidx].type = scale_auto;
                            }
                            U = true;
                            if (tk.group != undefined) {
                                groupScaleChange[tk.group] = {scale: scale_auto};
                            }
                        }
                        break;
                    case 6:
                        if (isNumerical(tk) || tk.ft == FT_matplot) {
                            tk.qtc.thtype = scale_fix;
                            tk.qtc.thmin = parseFloat(menu.c51.fix.min.value);
                            tk.qtc.thmax = parseFloat(menu.c51.fix.max.value);
                            tkreg.qtc.thtype = tk.qtc.thtype;
                            tkreg.qtc.thmin = tk.qtc.thmin;
                            tkreg.qtc.thmax = tk.qtc.thmax;
                            qtc_thresholdcolorcell(tk.qtc);
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.thtype = scale_fix;
                                tk2.qtc.thmin = tk.qtc.thmin;
                                tk2.qtc.thmax = tk.qtc.thmax;
                            }
                            U = true;
                            if (tk.group != undefined) {
                                groupScaleChange[tk.group] = {scale: scale_fix, min: tk.qtc.thmin, max: tk.qtc.thmax};
                            }
                        } else if (useScore) {
                            // "Apply to all" spilling over
                            var scale = tk.scorescalelst[tk.showscoreidx];
                            scale.type = scale_fix;
                            scale.min = parseFloat(menu.c51.fix.min.value);
                            scale.max = parseFloat(menu.c51.fix.max.value);
                            var s2 = tk.scorescalelst[tk.showscoreidx];
                            s2.type = scale_fix;
                            s2.min = scale.min;
                            s2.max = scale.max;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                s2 = tk2.scorescalelst[tk.showscoreidx];
                                s2.type = scale_fix;
                                s2.min = scale.min;
                                s2.max = scale.max;
                            }
                            U = true;
                            if (tk.group != undefined) {
                                groupScaleChange[tk.group] = {scale: scale_fix, min: scale.min, max: scale.max};
                            }
                        }
                        break;
                    case 7:
                        if (isNumerical(tk) || tk.ft == FT_matplot) {
                            tk.qtc.thtype = scale_percentile;
                            tk.qtc.thpercentile = parseInt(menu.c51.percentile.says.innerHTML);
                            tkreg.qtc.thtype = tk.qtc.thtype;
                            tkreg.qtc.thpercentile = tk.qtc.thpercentile;
                            qtc_thresholdcolorcell(tk.qtc);
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.thtype = scale_percentile;
                                tk2.qtc.thpercentile = tk.qtc.thpercentile;
                            }
                            U = true;
                            if (tk.group != undefined) {
                                // but is forced to auto for group
                                groupScaleChange[tk.group] = {scale: scale_auto};
                            }
                        } else if (useScore) {
                            // "Apply to all" spilling over
                            tk.scorescalelst[tk.showscoreidx].type = scale_auto;
                            tkreg.scorescalelst[tk.showscoreidx].type = scale_auto;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.scorescalelst[tk.showscoreidx].type = scale_auto;
                            }
                            U = true;
                            if (tk.group != undefined) {
                                groupScaleChange[tk.group] = {scale: scale_auto};
                            }
                        }
                        break;
                    case 8:
                        var windowsize = parseInt(menu.c46.says.innerHTML);
                        if (isNumerical(tk)) {
                            if (menu.c46.checkbox.checked) {
                                // apply smoothing, no matter whether it is already smoothed or not
                                tk.qtc.smooth = windowsize;
                                tkreg.qtc.smooth = windowsize;
                                if (!tk.data_raw) {
                                    tk.data_raw = tk.data;
                                }
                                for (var a in bbj.splinters) {
                                    var tk2 = bbj.splinters[a].findTrack(tk.name);
                                    if (!tk2) continue;
                                    tk2.qtc.smooth = windowsize;
                                    if (!tk2.data_raw) {
                                        tk2.data_raw = tk2.data;
                                    }
                                }
                                U = true;
                            } else {
                                // remove smoothing effect
                                if (tk.qtc.smooth) {
                                    tk.qtc.smooth = undefined;
                                    tkreg.qtc.smooth = undefined;
                                    tk.data = tk.data_raw;
                                    delete tk.data_raw;
                                    for (var a in bbj.splinters) {
                                        var tk2 = bbj.splinters[a].findTrack(tk.name);
                                        if (!tk2) continue;
                                        tk2.qtc.smooth = undefined;
                                        tk2.data = tk2.data_raw;
                                        delete tk2.data_raw;
                                    }
                                    U = true;
                                }
                            }
                        } else if (tk.ft == FT_cm_c) {
                            var rdf = tk.cm.set.rd_f;
                            var rdr = tk.cm.set.rd_r;
                            if (!rdf) continue;
                            if (menu.c46.checkbox.checked) {
                                // apply for cmtk
                                rdf.qtc.smooth = windowsize;
                                var _reg = bbj.genome.getTkregistryobj(rdf.name);
                                if (!_reg) fatalError('regobj missing for forward read depth');
                                _reg.qtc.smooth = windowsize;
                                if (rdr) {
                                    rdr.qtc.smooth = windowsize;
                                    var _reg = bbj.genome.getTkregistryobj(rdr.name);
                                    if (!_reg) fatalError('regobj missing for reverse read depth');
                                    _reg.qtc.smooth = windowsize;
                                }
                                if (!rdf.data_raw) {
                                    rdf.data_raw = rdf.data;
                                    if (rdr) {
                                        rdr.data_raw = rdr.data;
                                    }
                                }
                                for (var a in bbj.splinters) {
                                    var tk2 = bbj.splinters[a].findTrack(tk.name);
                                    if (!tk2) continue;
                                    rdf = tk2.cm.set.rd_f;
                                    rdr = tk2.cm.set.rd_r;
                                    rdf.qtc.smooth = windowsize;
                                    if (rdr) {
                                        rdr.qtc.smooth = windowsize;
                                    }
                                    if (!rdf.data_raw) {
                                        rdf.data_raw = rdf.data;
                                        if (rdr) {
                                            rdr.data_raw = rdr.data;
                                        }
                                    }
                                }
                                U = true;
                            } else {
                                // cmtk cancel
                                if (!rdf.qtc.smooth) continue;
                                rdf.qtc.smooth = undefined;
                                rdf.data = rdf.data_raw;
                                delete rdf.data_raw;
                                var _reg = bbj.genome.getTkregistryobj(rdf.name);
                                if (!_reg) fatalError('regobj missing for forward read depth');
                                _reg.qtc.smooth = undefined;
                                if (rdr) {
                                    rdr.qtc.smooth = undefined;
                                    rdr.data = rdr.data_raw;
                                    delete rdr.data_raw;
                                    var _reg = bbj.genome.getTkregistryobj(rdr.name);
                                    if (!_reg) fatalError('regobj missing for reverse read depth');
                                    _reg.qtc.smooth = undefined;
                                }
                                for (var a in bbj.splinters) {
                                    var tk2 = bbj.splinters[a].findTrack(tk.name);
                                    if (!tk2) continue;
                                    rdf = tk2.cm.set.rd_f;
                                    rdr = tk2.cm.set.rd_r;
                                    rdf.qtc.smooth = undefined;
                                    rdf.data = rdf.data_raw;
                                    delete rdf.data_raw;
                                    if (rdr) {
                                        rdr.qtc.smooth = undefined;
                                        rdr.data = rdr.data_raw;
                                        delete rdr.data_raw;
                                    }
                                }
                                U = true;
                            }
                        } else if (tk.ft == FT_matplot) {
                            print2console('matplot smoothing not available yet', 2);
                        }
                        break;
                    case 9:
                        if (isNumerical(tk)) {
                            tk.qtc.logtype = parseInt(menu.c52.select.options[menu.c52.select.selectedIndex].value);
                            tkreg.qtc.logtype = tk.qtc.logtype;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.logtype = tk.qtc.logtype;
                            }
                            U = true;
                            takelog = true;
                        }
                        break;
                    case 10:
                        if (tk.qtc.bedcolor) {
                            tk.qtc.bedcolor = menu.bed.color.style.backgroundColor;
                            if (!tkreg.qtc) tkreg.qtc = {};
                            tkreg.qtc.bedcolor = tk.qtc.bedcolor;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.bedcolor = tk.qtc.bedcolor;
                            }
                            U = true;
                        }
                        break;
                    case 11:
                        if (tk.qtc.textcolor) {
                            tk.qtc.textcolor = menu.font.color.style.backgroundColor;
                            if (!tkreg.qtc) tkreg.qtc = {};
                            tkreg.qtc.textcolor = tk.qtc.textcolor;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.textcolor = tk.qtc.textcolor;
                            }
                            U = true;
                        }
                        break;
                    case 12:
                        if (tk.qtc.fontfamily) {
                            var s = menu.font.family;
                            tk.qtc.fontfamily = s.options[s.selectedIndex].value;
                            if (!tkreg.qtc) tkreg.qtc = {};
                            tkreg.qtc.fontfamily = tk.qtc.fontfamily;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.fontfamily = tk.qtc.fontfamily;
                            }
                            U = true;
                        }
                        break;
                    case 13:
                        if (tk.qtc.fontbold != undefined) {
                            tk.qtc.fontbold = menu.font.bold.checked;
                            if (!tkreg.qtc) tkreg.qtc = {};
                            tkreg.qtc.fontbold = tk.qtc.fontbold;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.fontbold = tk.qtc.fontbold;
                            }
                            U = true;
                        }
                        break;
                    case 14:
                        if (tk.qtc.fontsize) {
                            var s = parseInt(tk.qtc.fontsize);
                            s += menu.font.sizeincrease ? 1 : -1;
                            if (s <= 5) s = 5;
                            tk.qtc.fontsize = s + 'pt';
                            if (!tkreg.qtc) tkreg.qtc = {};
                            tkreg.qtc.fontsize = tk.qtc.fontsize;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.fontsize = tk.qtc.fontsize;
                            }
                            U = true;
                        }
                        break;
                    case 15:
                        if (tk.qtc.forwardcolor) {
                            tk.qtc.forwardcolor = menu.bam.f.style.backgroundColor;
                            if (!tkreg.qtc) tkreg.qtc = {};
                            tkreg.qtc.forwardcolor = tk.qtc.forwardcolor;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.forwardcolor = tk.qtc.forwardcolor;
                            }
                            U = true;
                        }
                        break;
                    case 16:
                        if (tk.qtc.reversecolor) {
                            tk.qtc.reversecolor = menu.bam.r.style.backgroundColor;
                            if (!tkreg.qtc) tkreg.qtc = {};
                            tkreg.qtc.reversecolor = tk.qtc.reversecolor;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.reversecolor = tk.qtc.reversecolor;
                            }
                            U = true;
                        }
                        break;
                    case 17:
                        if (tk.qtc.mismatchcolor) {
                            tk.qtc.mismatchcolor = menu.bam.m.style.backgroundColor;
                            if (!tkreg.qtc) tkreg.qtc = {};
                            tkreg.qtc.mismatchcolor = tk.qtc.mismatchcolor;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.mismatchcolor = tk.qtc.mismatchcolor;
                            }
                            U = true;
                        }
                        break;
                    case 18:
                        if (tk.qtc.thtype != undefined) {
                            tk.qtc.thtype = menu.lr.autoscale.checked ? scale_auto : scale_fix;
                            tkreg.qtc.thtype = tk.qtc.thtype;
                            if (menu.lr.autoscale.checked) {
                                menu.lr.pcscoresays.innerHTML =
                                    menu.lr.ncscoresays.innerHTML = 'auto';
                            } else {
                                menu.lr.pcscore.value = tk.qtc.pcolorscore;
                                menu.lr.ncscore.value = tk.qtc.ncolorscore;
                            }
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.thtype = tk.qtc.thtype;
                            }
                            U = true;
                        }
                        break;
                    case 19:
                        if (tk.ft == FT_lr_n || tk.ft == FT_lr_c) {
                            var c = colorstr2int(menu.lr.pcolor.style.backgroundColor);
                            tk.qtc.pr = c[0];
                            tk.qtc.pg = c[1];
                            tk.qtc.pb = c[2];
                            tkreg.qtc.pr = c[0];
                            tkreg.qtc.pg = c[1];
                            tkreg.qtc.pb = c[2];
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.pr = c[0];
                                tk2.qtc.pg = c[1];
                                tk2.qtc.pb = c[2];
                            }
                            U = true;
                        }
                        break;
                    case 20:
                        if (tk.ft == FT_lr_n || tk.ft == FT_lr_c) {
                            var c = colorstr2int(menu.lr.ncolor.style.backgroundColor);
                            tk.qtc.nr = c[0];
                            tk.qtc.ng = c[1];
                            tk.qtc.nb = c[2];
                            tkreg.qtc.nr = c[0];
                            tkreg.qtc.ng = c[1];
                            tkreg.qtc.nb = c[2];
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.nr = c[0];
                                tk2.qtc.ng = c[1];
                                tk2.qtc.nb = c[2];
                            }
                            U = true;
                        }
                        break;
                    case 21:
                        if (tk.qtc.pcolorscore != undefined) {
                            tk.qtc.pcolorscore = parseFloat(menu.lr.pcscore.value);
                            tkreg.qtc.pcolorscore = tk.qtc.pcolorscore;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.pcolorscore = tk.qtc.pcolorscore;
                            }
                            U = true;
                        }
                        break;
                    case 22:
                        if (tk.qtc.ncolorscore != undefined) {
                            tk.qtc.ncolorscore = parseFloat(menu.lr.ncscore.value);
                            tkreg.qtc.ncolorscore = tk.qtc.ncolorscore;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.ncolorscore = tk.qtc.ncolorscore;
                            }
                            U = true;
                        }
                        break;
                    case 23:
                        if (tk.qtc.pfilterscore != undefined) {
                            tk.qtc.pfilterscore = parseFloat(menu.lr.pfscore.value);
                            tkreg.qtc.pfilterscore = tk.qtc.pfilterscore;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.pfilterscore = tk.qtc.pfilterscore;
                            }
                            A = true;
                            U = H = M = false;
                            A_tklst.push(tk);
                        }
                        break;
                    case 24:
                        if (tk.qtc.nfilterscore != undefined) {
                            tk.qtc.nfilterscore = parseFloat(menu.lr.nfscore.value);
                            tkreg.qtc.nfilterscore = tk.qtc.nfilterscore;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.nfilterscore = tk.qtc.nfilterscore;
                            }
                            A = true;
                            U = H = M = false;
                            A_tklst.push(tk);
                        }
                        break;
                    case 25:
                        var check = menu.c45.combine.checked;
                        menu.c45.combine_chg.div.style.display = 'none';
                        if (tk.ft == FT_cm_c && tk.cm.combine != check) {
                            tk.cm.combine = check;
                            tkreg.cm.combine = check;
                            if (tk.cm.combine && tk.cm.set.chg_f && tk.cm.set.chg_r) {
                                menu.c45.combine_chg.div.style.display = 'block';
                                menu.c45.combine_chg.checkbox.checked = tk.cm.combine_chg;
                            }
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.cm.combine = check;
                            }
                            U = true;
                            H = true;
                        }
                        break;
                    case 26:
                        var check = menu.c45.scale.checked;
                        if (tk.ft == FT_cm_c && tk.cm.scale != check) {
                            tk.cm.scale = check;
                            tkreg.cm.scale = check;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.cm.scale = check;
                            }
                            U = true;
                        }
                        break;
                    case 27:
                        if (tk.ft == FT_cm_c) {
                            var c = gflag.menu.cmtk_colorcell;
                            var cc = c.style.backgroundColor;
                            if (c.bg) {
                                tk.cm.bg[c.which] = cc;
                                tkreg.cm.bg[c.which] = cc;
                            } else {
                                tk.cm.color[c.which] = cc;
                                tkreg.cm.color[c.which] = cc;
                            }
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                if (c.bg) {
                                    tk2.cm.bg[c.which] = cc;
                                } else {
                                    tk2.cm.color[c.which] = cc;
                                }
                            }
                            U = true;
                        }
                        break;
                    case 28:
                        if (useScore) {
                            var scale = tk.scorescalelst[tk.showscoreidx];
                            scale.type = scale_fix;
                            scale.min = gflag.menu.hammock_focus.min;
                            scale.max = gflag.menu.hammock_focus.max;
                            var s2 = tk.scorescalelst[tk.showscoreidx];
                            s2.type = scale_fix;
                            s2.min = scale.min;
                            s2.max = scale.max;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                s2 = tk2.scorescalelst[tk.showscoreidx];
                                s2.type = scale_fix;
                                s2.min = gflag.menu.hammock_focus.min;
                                s2.max = gflag.menu.hammock_focus.max;
                            }
                            U = true;
                            if (tk.group != undefined) {
                                groupScaleChange[tk.group] = {scale: scale_fix, min: scale.min, max: scale.max};
                            }
                        } else if (isNumerical(tk)) {
                            // "Apply to all" spilling over
                            tk.qtc.thtype = scale_fix;
                            tk.qtc.thmin = gflag.menu.hammock_focus.min;
                            tk.qtc.thmax = gflag.menu.hammock_focus.max;
                            tkreg.qtc.thtype = scale_fix;
                            tkreg.qtc.thmin = tk.qtc.thmin;
                            tkreg.qtc.thmax = tk.qtc.thmax;
                            qtc_thresholdcolorcell(tk.qtc);
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.thtype = scale_fix;
                                tk2.qtc.thmin = tk.qtc.thmin;
                                tk2.qtc.thmax = tk.qtc.thmax;
                            }
                            U = true;
                            if (tk.group != undefined) {
                                groupScaleChange[tk.group] = {scale: scale_fix, min: tk.qtc.thmin, max: tk.qtc.thmax};
                            }
                        }
                        break;
                    case 29:
                        // must be calling with auto scale
                        if (useScore) {
                            tk.scorescalelst[tk.showscoreidx].type = scale_auto;
                            tkreg.scorescalelst[tk.showscoreidx].type = scale_auto;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.scorescalelst[tk.showscoreidx].type = scale_auto;
                            }
                            U = true;
                            M = true;
                            if (tk.group != undefined) {
                                groupScaleChange[tk.group] = {scale: scale_auto};
                            }
                        } else if (isNumerical(tk)) {
                            // "Apply to all" spilling over
                            tk.qtc.thtype = scale_auto;
                            tkreg.qtc.thtype = scale_auto;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.thtype = scale_auto;
                            }
                            U = true;
                            if (tk.group != undefined) {
                                groupScaleChange[tk.group] = {scale: scale_auto};
                            }
                        }
                        break;
                    case 30:
                        if (tk.showscoreidx != undefined) {
                            tk.showscoreidx = gflag.menu.hammock_focus.scoreidx;
                            tkreg.showscoreidx = tk.showscoreidx;
                            if (tk.ft == FT_ld_c || tk.ft == FT_ld_n) {
                                bbj.stack_track(tk, 0);
                            }
                            for (var a in bbj.splinters) {
                                var b2 = bbj.splinters[a];
                                var tk2 = b2.findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.showscoreidx = tk.showscoreidx;
                                if (tk.ft == FT_ld_c || tk.ft == FT_ld_n) {
                                    b2.stack_track(tk2, 0);
                                }
                            }
                            U = true;
                            M = true;
                            if (tk.group != undefined) {
                                if (bbj.tkgroup[tk.group].scale == scale_auto) {
                                    // need updating group scale
                                    groupScaleChange[tk.group] = {scale: scale_auto};
                                }
                            }
                        }
                        break;
                    case 31:
                        if (menu.c45.filter.checkbox.checked) {
                            menu.c45.filter.div.style.display = 'block';
                            var fv = parseInt(menu.c45.filter.input.value);
                            if (isNaN(fv) || fv <= 0) print2console('Filter read depth value must be positive integer', 2);
                            if (tk.ft == FT_cm_c) {
                                tk.cm.filter = fv;
                                tkreg.cm.filter = fv;
                                for (var a in bbj.splinters) {
                                    var tk2 = bbj.splinters[a].findTrack(tk.name);
                                    if (!tk2) continue;
                                    tk2.cm.filter = fv;
                                }
                                U = true;
                            }
                        } else {
                            menu.c45.filter.div.style.display = 'none';
                            if (tk.ft == FT_cm_c) {
                                tk.cm.filter = 0;
                                tkreg.cm.filter = 0;
                                for (var a in bbj.splinters) {
                                    var tk2 = bbj.splinters[a].findTrack(tk.name);
                                    if (!tk2) continue;
                                    tk2.cm.filter = 0;
                                }
                                U = true;
                            }
                        }
                        break;
                    case 32:
                        if (isNumerical(tk)) {
                            // need to escape cmtk?
                            tk.qtc.summeth = parseInt(menu.c59.select.options[menu.c59.select.selectedIndex].value);
                            tkreg.qtc.summeth = tk.qtc.summeth;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.summeth = tk.qtc.summeth;
                            }
                            A = true;
                            U = H = M = false;
                            A_tklst.push(tk);
                        }
                        break;
                    case 33:
                        tk.qtc.bg = palette.output;
                        if (!tkreg.qtc) tkreg.qtc = {};
                        tkreg.qtc.bg = tk.qtc.bg;
                        for (var a in bbj.splinters) {
                            var tk2 = bbj.splinters[a].findTrack(tk.name);
                            if (!tk2) continue;
                            tk2.qtc.bg = tk.qtc.bg;
                        }
                        U = true;
                        break;
                    case 38:
                        var usebg = menu.c44.checkbox.checked;
                        tk.qtc.bg = usebg ? menu.c44.color.style.backgroundColor : null;
                        if (!tkreg.qtc) tkreg.qtc = {};
                        tkreg.qtc.bg = tk.qtc.bg;
                        for (var a in bbj.splinters) {
                            var tk2 = bbj.splinters[a].findTrack(tk.name);
                            if (!tk2) continue;
                            tk2.qtc.bg = tk.qtc.bg;
                        }
                        U = true;
                        break;
                    case 34:
                        if (tk.ft != FT_cat_n && tk.ft != FT_cat_c) continue;
                        tk.cateInfo[gflag.menu.catetk.itemidx][1] = palette.output;
                        for (var a in bbj.splinters) {
                            var tk2 = bbj.splinters[a].findTrack(tk.name);
                            if (!tk2) continue;
                            tk2.cateInfo[gflag.menu.catetk.itemidx][1] = palette.output;
                        }
                        U = true;
                        break;
                    case 35:
                        // restoring cate color on available for native tracks
                        if (tk.ft != FT_cat_n) continue;
                        var _o = bbj.genome.getTkregistryobj(tk.name, tk.ft);
                        if (!_o) continue;
                        cateInfo_copy(_o.cateInfo, tk.cateInfo);
                        cateCfg_show(tk, false);
                        for (var a in bbj.splinters) {
                            var tk2 = bbj.splinters[a].findTrack(tk.name);
                            if (!tk2) continue;
                            cateInfo_copy(_o.cateInfo, tk2.cateInfo);
                        }
                        U = true;
                        break;
                    case 37:
                        if (tk.ft != FT_bedgraph_n && tk.ft != FT_bedgraph_c) continue;
                        var usebg = menu.c29.checkbox.checked;
                        tk.qtc.barplotbg = usebg ? menu.c29.color.style.backgroundColor : null;
                        tkreg.qtc.barplotbg = tk.qtc.barplotbg;
                        for (var a in bbj.splinters) {
                            var tk2 = bbj.splinters[a].findTrack(tk.name);
                            if (!tk2) continue;
                            tk2.qtc.barplotbg = tk.qtc.barplotbg;
                        }
                        U = true;
                        break;
                    case 36:
                        if (tk.ft != FT_bedgraph_n && tk.ft != FT_bedgraph_c) continue;
                        tk.qtc.barplotbg = palette.output;
                        tkreg.qtc.barplotbg = tk.qtc.barplotbg;
                        for (var a in bbj.splinters) {
                            var tk2 = bbj.splinters[a].findTrack(tk.name);
                            if (!tk2) continue;
                            tk2.qtc.barplotbg = tk.qtc.barplotbg;
                        }
                        U = true;
                        break;
                    case 39:
                        var check = menu.c45.combine_chg.checkbox.checked;
                        if (tk.ft == FT_cm_c && tk.cm.set.chg_f && tk.cm.set.chg_r && tk.cm.combine_chg != check) {
                            tk.cm.combine_chg = check;
                            tkreg.cm.combine_chg = check;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.cm.combine_chg = check;
                            }
                            U = true;
                            H = true;
                        }
                        break;
                    case 40:
                        if (tk.ft == FT_bigwighmtk_n || tk.ft == FT_bigwighmtk_c || tk.ft == FT_bedgraph_n || tk.ft == FT_bedgraph_c) {
                            tk.qtc.curveonly = menu.c66.checkbox.checked;
                            U = true;
                        }
                        break;
                    // eee
                    default:
                        fatalError('bbj tk: unknown update context');
                }
                if (U) {
                    bbj.updateTrack(tk, H);
                }
                if (M) {
                    config_dispatcher(tk);
                }
            }
            for (var groupid = 0; groupid < groupScaleChange.length; groupid++) {
                var x = groupScaleChange[groupid];
                if (!x) continue;
                var y = bbj.tkgroup[groupid];
                if (!y) {
                    print2console('bbj.tkgroup[' + groupid + '] missing', 2);
                    bbj.tkgroup[groupid] = {scale: scale_auto, min: 0, min_show: 0, max: 1, max_show: 1};
                    y = bbj.tkgroup[groupid];
                }
                if (x.scale != undefined) {
                    y.scale = x.scale;
                }
                if (y.scale == scale_auto) {
                    bbj.tkgroup_setYscale(groupid);
                } else {
                    if (x.min == undefined || x.max == undefined) fatalError('not getting min/max for fixed group y scale');
                    y.min = y.min_show = x.min;
                    y.max = y.max_show = x.max;
                }
                for (var i = 0; i < bbj.tklst.length; i++) {
                    var t = bbj.tklst[i];
                    if (t.group == groupid) {
                        bbj.drawTrack_browser(t);
                    }
                }
            }
            if (takelog) {
                if (bbj.onupdatex) {
                    bbj.onupdatex();
                    menu_hide();
                }
            }
            if (A) {
                if (A_tklst.length == 0) {
                    print2console('A set to true A_tklst is empty', 2);
                } else {
                    bbj.ajax_addtracks(A_tklst);
                }
                return;
            }
            return;
        case 15:
            var hvobj = apps.circlet.hash[gflag.menu.viewkey];
            switch (updatecontext) {
                case 19:
                    hvobj.callingtk.pcolor = colorstr2int(menu.lr.pcolor.style.backgroundColor).join(',');
                    break;
                case 20:
                    hvobj.callingtk.ncolor = colorstr2int(menu.lr.ncolor.style.backgroundColor).join(',');
                    break;
                case 21:
                    hvobj.callingtk.pscore = parseFloat(menu.lr.pcscore.value);
                    break;
                case 22:
                    hvobj.callingtk.nscore = parseFloat(menu.lr.ncscore.value);
                    break;
                default:
                    fatalError('circlet callingtk: unknown update context');
            }
            hengeview_draw(gflag.menu.viewkey);
            return;
        case 19:
            // track idx identified in gflag.menu.wreathIdx
            var tk = apps.circlet.hash[gflag.menu.viewkey].wreath[gflag.menu.wreathIdx];
            switch (updatecontext) {
                case 1:
                    var c = colorstr2int(menu.c50.color1.style.backgroundColor);
                    tk.qtc.pr = c[0];
                    tk.qtc.pg = c[1];
                    tk.qtc.pb = c[2];
                    break;
                case 2:
                    var c = colorstr2int(menu.c50.color2.style.backgroundColor);
                    tk.qtc.nr = c[0];
                    tk.qtc.ng = c[1];
                    tk.qtc.nb = c[2];
                    break;
                case 3:
                    tk.qtc.pth = menu.c50.color1_1.style.backgroundColor;
                    break;
                case 4:
                    tk.qtc.nth = menu.c50.color2_1.style.backgroundColor;
                    break;
                case 34:
                    hvobj.cateInfo[gflag.menu.catetk.itemidx][1] = palette.output;
                    break;
                default:
                    fatalError('wreath tk: unknown update context');
            }
            hengeview_draw(gflag.menu.viewkey);
            return;
        case 20:
            var tk = bbj.genome.bev.tklst[gflag.menu.bevtkidx];
            switch (updatecontext) {
                case 1:
                    var c = colorstr2int(menu.c50.color1.style.backgroundColor);
                    tk.qtc.pr = c[0];
                    tk.qtc.pg = c[1];
                    tk.qtc.pb = c[2];
                    break;
                case 2:
                    var c = colorstr2int(menu.c50.color2.style.backgroundColor);
                    tk.qtc.nr = c[0];
                    tk.qtc.ng = c[1];
                    tk.qtc.nb = c[2];
                    break;
                case 3:
                    tk.qtc.pth = menu.c50.color1_1.style.backgroundColor;
                    break;
                case 4:
                    tk.qtc.nth = menu.c50.color2_1.style.backgroundColor;
                    break;
                case 5:
                    var v = parseInt(menu.c51.select.options[menu.c51.select.selectedIndex].value);
                    tk.qtc.thtype = v;
                    if (v == scale_percentile) {
                        tk.qtc.thpercentile = parseInt(menu.c51.percentile.says.innerHTML);
                    }
                    qtc_thresholdcolorcell(tk.qtc);
                    break;
                case 6:
                    tk.qtc.thtype = scale_fix;
                    tk.qtc.thmin = parseFloat(menu.c51.fix.min.value);
                    tk.qtc.thmax = parseFloat(menu.c51.fix.max.value);
                    qtc_thresholdcolorcell(tk.qtc);
                    break;
                case 32:
                    tk.qtc.summeth = parseInt(menu.c59.select.options[menu.c59.select.selectedIndex].value);
                    bbj.bev_ajax([tk]);
                    return;
                case 34:
                    tk.cateInfo[gflag.menu.catetk.itemidx][1] = palette.output;
                    break;
                default:
                    fatalError('bev tk: unknown update context');
            }
            bbj.genome.bev_draw_track(tk);
            return;
        default:
            fatalError('unknown menu context');
    }
}

