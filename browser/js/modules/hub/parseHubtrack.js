/**
 * @param obj
 * a very centralized place to parse/validate hub track attributes
 - works for both custom and native tracks
 - do not handle cmtk member tracks, they were put in init_bbj_param.tklst already
 */

function parseHubtrack(obj) {
    /* a very centralized place to parse/validate hub track attributes
     works for both custom and native tracks
     do not handle cmtk member tracks, they were put in init_bbj_param.tklst already
     */

// showscoreidx needs to be validated first then it can be used to validate scorenamelst, scorescalelst
    for (var k1 in obj) {
        var k = k1.toLowerCase();
        var v = obj[k1];
        if (k == 'showscoreidx') {
            var n = parseInt(v);
            if (isNaN(n) || n < 0) {
                print2console('Invalid showscoreidx for track ' + obj.name, 2);
                obj.showscoreidx = 0;
            } else {
                obj.showscoreidx = n;
            }
        }
    }

// check the rest
    var tq = {}; // temp, to be appended as obj.qtc
    for (var k1 in obj) {

        var k = k1.toLowerCase();
        var v = obj[k1];
        var d = false;
        var err = null;
        var gray = 115; // gray color to apply to any error values
        var grayc = 'rgb(' + gray + ',' + gray + ',' + gray + ')';
        switch (k) {
            case 'color':
            // supposedly for the ruling color of query genome in weavertk, process into bedcolor
            case 'boxcolor':
                if (!isNaN(colorstr2int(v)[0])) {
                    tq.bedcolor = v;
                } else {
                    err = 'wrong value';
                    tq.bedcolor = grayc;
                }
                d = true;
                break;
            case 'strokecolor':
                if (!isNaN(colorstr2int(v)[0])) {
                    tq.strokecolor = v;
                } else {
                    err = 'wrong value';
                    tq.strokecolor = colorCentral.foreground;
                }
                d = true;
                break;
            case 'textcolor':
                if (!isNaN(colorstr2int(v)[0])) {
                    tq.textcolor = v;
                } else {
                    err = 'wrong value';
                    tq.textcolor = colorCentral.foreground;
                }
                d = true;
                break;
            case 'colorforward':
                if (!isNaN(colorstr2int(v)[0])) {
                    tq.forwardcolor = v;
                } else {
                    err = 'wrong value';
                    tq.forwardcolor = grayc;
                }
                d = true;
                break;
            case 'colorreverse':
                if (!isNaN(colorstr2int(v)[0])) {
                    tq.reversecolor = v;
                } else {
                    err = 'wrong value';
                    tq.reversecolor = grayc;
                }
                d = true;
                break;
            case 'colormismatch':
                if (!isNaN(colorstr2int(v)[0])) {
                    tq.mismatchcolor = v;
                } else {
                    err = 'wrong value';
                    tq.mismatchcolor = grayc;
                }
                d = true;
                break;
            case 'colorpositive':
                // color below threshold / beyond threshold
                var t = v.split('/');
                var c = colorstr2int(t[0]);
                if (!isNaN(c[0]) && !isNaN(c[1]) && !isNaN(c[2])) {
                    tq.pr = c[0];
                    tq.pg = c[1];
                    tq.pb = c[2];
                } else {
                    err = 'wrong value';
                    tq.pr = tq.pg = tq.pb = gray;
                }
                if (t[1]) {
                    c = colorstr2int(t[1]);
                    if (!isNaN(c[0]) && !isNaN(c[1]) && !isNaN(c[2])) {
                        tq.pth = 'rgb(' + c.join(',') + ')';
                    } else {
                        tq.pth = grayc;
                        err = 'wrong value';
                    }
                } else {
                    tq.pth = darkencolor(c, .3);
                }
                d = true;
                break;
            case 'colornegative':
                var t = v.split('/');
                var c = colorstr2int(t[0]);
                if (!isNaN(c[0]) && !isNaN(c[1]) && !isNaN(c[2])) {
                    tq.nr = c[0];
                    tq.ng = c[1];
                    tq.nb = c[2];
                } else {
                    err = 'wrong value';
                    tq.nr = tq.ng = tq.nb = gray;
                }
                if (t[1]) {
                    c = colorstr2int(t[1]);
                    if (!isNaN(c[0]) && !isNaN(c[1]) && !isNaN(c[2])) {
                        tq.nth = 'rgb(' + c.join(',') + ')';
                    } else {
                        err = 'wrong value';
                        tq.nth = grayc;
                    }
                } else {
                    tq.nth = darkencolor(c, .3);
                }
                d = true;
                break;
            case 'positivefilterthreshold':
                var v2 = parseFloat(v);
                if (!isNaN(v2) && v2 >= 0) {
                    tq.pfilterscore = v2;
                } else {
                    err = 'wrong value';
                    tq.pfilterscore = 0;
                }
                d = true;
                break;
            case 'negativefilterthreshold':
                var v2 = parseFloat(v);
                if (!isNaN(v2) && v2 <= 0) {
                    tq.nfilterscore = v2;
                } else {
                    err = 'wrong value';
                    tq.nfilterscore = 0;
                }
                d = true;
                break;
            case 'height':
                var n = parseInt(v);
                if (!isNaN(n)) {
                    tq.height = Math.max(10, n);
                } else {
                    err = 'wrong value';
                    tq.height = 15;
                }
                d = true;
                break;
            case 'summarymethod':
                var _s = v.toLowerCase();
                var _v = null;
                if (_s == 'average' || _s == 'mean') {
                    _v = summeth_mean;
                } else if (_s == 'max') {
                    _v = summeth_max;
                } else if (_s == 'min') {
                    _v = summeth_min;
                } else if (_s == 'total' || _s == 'sum') {
                    _v = summeth_sum;
                }
                if (_v == null) {
                    err = 'wrong value';
                    _v = summeth_mean;
                }
                tq.summeth = _v;
                d = true;
                break;
            case 'fixedscale':
                /* this will alter .qtc
                 but for hammock, also apply to .scorescalelst if that's not given
                 */
                if ('min' in v && typeof(v.min) == 'number') {
                    if ('max' in v && typeof(v.max) == 'number') {
                        tq.thtype = scale_fix;
                        tq.thmin = v.min;
                        tq.thmax = v.max;
                    } else {
                        tq.thtype = scale_auto;
                        tq.min_fixed = v.min;
                    }
                } else if ('max' in v && typeof(v.max) == 'number') {
                    tq.thtype = scale_auto;
                    tq.max_fixed = v.max;
                } else {
                    err = 'wrong value';
                }
                d = true;
                break;
            case 'barplot_bg':
                if (!isNaN(colorstr2int(v)[0])) {
                    tq.barplotbg = v;
                } else {
                    err = 'wrong value';
                    tq.barplotbg = grayc;
                }
                d = true;
                break;
            case 'backgroundcolor':
                if (!isNaN(colorstr2int(v)[0])) {
                    tq.bg = v;
                } else {
                    err = 'wrong value';
                }
                d = true;
                break;
            case 'smoothwindow':
                var n = parseInt(v);
                if (isNaN(n) || n < 3) {
                    err = 'wrong value';
                    tq.smooth = 5;
                } else {
                    if (n % 2 == 0) n++;
                    tq.smooth = n;
                }
                d = true;
                break;
            case 'scorenamelst':
                if (obj.showscoreidx == undefined) {
                    d = true;
                    err = 'showscoreidx is missing';
                } else if (!Array.isArray(v)) {
                    d = true;
                    err = 'scorenamelst value should be an array of strings';
                } else if (obj.showscoreidx >= v.length) {
                    d = true;
                    err = 'scorenamelst has wrong array size';
                }
                break;
            case 'scorescalelst':
                if (obj.showscoreidx == undefined) {
                    d = true;
                    err = 'showscoreidx is missing';
                } else if (!Array.isArray(v)) {
                    d = true;
                    err = 'scorescalelst value should be an array';
                } else if (obj.showscoreidx >= v.length) {
                    d = true;
                    err = 'scorescalelst has wrong array size';
                } else {
                    for (var i = 0; i < v.length; i++) {
                        if (v[i].type != scale_auto && v[i].type != scale_fix) {
                            err = 'scorescalelst item type value should be ' + scale_auto + ' (automatic scale) or ' + scale_fix + ' (fixed scale)';
                            v[i].type = scale_auto;
                        }
                        if (v[i].type == scale_fix) {
                            if (v[i].min == undefined || v[i].max == undefined) {
                                err = 'min or max value missing from scorescalelst item';
                                d = true;
                                break;
                            } else if (v[i].min >= v[i].max) {
                                err = 'scorescalelst item has wrong min/max values';
                            }
                        }
                    }
                }
                break;
            case 'horizontallines':
                var lst = [];
                for (var j = 0; j < v.length; j++) {
                    var a = v[j];
                    if ('value' in a && typeof(a.value) == 'number') {
                        if (!a.color) a.color = grayc;
                        lst.push(a);
                    } else {
                        err = 'Incorrect value setting';
                    }
                }
                if (lst.length > 0) {
                    obj.horizontallines = lst;
                } else {
                    d = true;
                }
                break;
            case 'defaultmode':
                var tmp = parse_tkmode(obj.defaultmode);
                if (tmp[1]) {
                    err = tmp[1];
                }
                if (tmp[0] != M_hide) {
                    obj.defaultmode = tmp[0];
                } else {
                    d = true;
                }
                break;
        }
        if (err) {
            var msg = 'Track error (' + obj.label + ') : at attribute "' + k + '", ' + err;
            print2console(msg, 2);
            alertbox_addmsg({text: msg});
        }
        if (d) {
            delete obj[k1];
        }
    }
// done looping, attach qtc

    if (!obj.qtc) {
        obj.qtc = {};
    }
    for (var k in tq) {
        obj.qtc[k] = tq[k];
    }
    if (obj.showscoreidx != undefined) {
        if (!obj.scorenamelst) {
            alertbox_addmsg({text: 'scorenamelst mising from track (' + obj.label + ')'});
            delete obj.showscoreidx;
        } else if (!obj.scorescalelst) {
            // fill in, also consider "fixedscale" setting
            obj.scorescalelst = [];
            for (var i = 0; i < obj.scorenamelst.length; i++) {
                if (tq.thtype == scale_fix) {
                    obj.scorescalelst.push({
                        type: scale_fix,
                        min: tq.thmin,
                        max: tq.thmax
                    });
                } else {
                    obj.scorescalelst.push({
                        type: scale_auto,
                        min_fixed: tq.min_fixed,
                        max_fixed: tq.max_fixed
                    });
                }
            }
        }
    }
    if (isNumerical(obj)) {
        if (!obj.qtc) {
            obj.qtc = {};
        }
        if (obj.qtc.thtype == undefined) {
            obj.qtc.thtype = scale_auto;
        }
    }
}