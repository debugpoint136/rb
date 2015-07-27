/**
 * ===BASE===// preqtc // tkinfo_show.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.tkinfo_show = function (arg) {
// registry obj for accessing md
    var tk;
    if (typeof(arg) == 'string') {
        tk = this.genome.getTkregistryobj(arg);
        if (!tk) fatalError('no registry object found');
    } else {
        tk = arg;
    }
    menu_blank();
    var d = dom_create('div', menu.c32, 'margin:10px;width:500px;');
    if (tk.md && tk.md.length > 0) {
        dom_create('div', d, 'font-style:italic;color:' + colorCentral.foreground_faint_5).innerHTML = 'Metadata annotation';
        var d2 = dom_create('div', d, 'margin:10px');
        for (var i = 0; i < tk.md.length; i++) {
            if (!tk.md[i]) continue;
            // i is mdidx
            var voc = gflag.mdlst[i];
            for (var term in tk.md[i]) {
                mdterm_print(d2, term, voc);
            }
        }
    }
// general
    if (tk.details) {
        var d2 = dom_create('div', d, 'margin-bottom:15px;width:480px;');
        tkinfo_print(tk.details, d2);
    }
// processing
    if (tk.details_analysis) {
        var d2 = dom_create('div', d, 'margin-bottom:15px;width:480px;');
        tkinfo_print(tk.details_analysis, d2);
    }
    var reg = this.genome.getTkregistryobj(tk.name);
    if (reg && reg.detail_url) {
        var d9 = dom_create('div', d, 'margin-bottom:15px;width:480px;');
        d9.innerHTML = 'loading...';
        this.ajaxText('loaddatahub=on&url=' + reg.detail_url, function (text) {
            var j = parse_jsontext(text);
            if (!j) {
                d9.innerHTML = 'Cannot read file at ' + reg.detail_url;
                return;
            }
            d9.style.overflowX = 'scroll';
            stripChild(d9, 0);
            var table = dom_create('table', d9, 'zoom:0.8;');
            var c = 0;
            for (var n in j) {
                var tr = table.insertRow(-1);
                if (c % 2 == 0) {
                    tr.style.backgroundColor = colorCentral.foreground_faint_1;
                }
                var td = tr.insertCell(0);
                td.innerHTML = n;
                td = tr.insertCell(1);
                td.innerHTML = j[n];
                c++;
            }
        });
    }
// other version, not in use
// geo
    if (tk.geolst) {
        var d2 = dom_create('div', d);
        d2.innerHTML = 'GEO record: ';
        for (var i = 0; i < tk.geolst.length; i++) {
            d2.innerHTML += '<a href=http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=' + tk.geolst[i] + ' target=_blank>' + tk.geolst[i] + '</a> ';
        }
    }
    if (tk.ft == FT_cm_c) {
        var t = dom_create('table', d, 'margin-top:10px;');
        var td = t.insertRow(0).insertCell(0);
        td.colSpan = 2;
        td.style.fontStyle = 'italic';
        td.style.color = colorCentral.foreground_faint_5;
        td.innerHTML = 'Member tracks:';
        for (var k in tk.cm.set) {
            // this is registry obj, value is tkname
            var x = this.findTrack(tk.cm.set[k]);
            if (!x) continue;
            var tr = t.insertRow(-1);
            tr.insertCell(0).innerHTML = x.label;
            tr.insertCell(1).innerHTML = '<a href=' + x.url + ' target=_blank>' + (x.url.length > 50 ? x.url.substr(0, 50) + '...' : x.url) + '</a>';
        }
    } else if (tk.ft == FT_matplot) {
        var t = dom_create('table', d, 'margin-top:10px;');
        var td = t.insertRow(0).insertCell(0);
        td.colSpan = 2;
        td.style.fontStyle = 'italic';
        td.style.color = colorCentral.foreground_faint_5;
        td.innerHTML = 'Member tracks:';
        for (var k = 0; k < tk.tracks.length; k++) {
            // this is registry obj, value is tkname
            var x = this.findTrack(tk.tracks[k]);
            if (!x) continue;
            var tr = t.insertRow(-1);
            tr.insertCell(0).innerHTML = x.label;
            td = tr.insertCell(1);
            if (isCustom(x.ft)) {
                td.innerHTML = '<a href=' + x.url + ' target=_blank>' + (x.url.length > 50 ? x.url.substr(0, 50) + '...' : x.url) + '</a>';
            }
        }
    }
    if (tk.url) {
        dom_create('div', d).innerHTML = 'File URL: <a href=' + tk.url + ' target=_blank>' + (tk.url.length > 50 ? tk.url.substr(0, 50) + '...' : tk.url) + '</a>';
    }
};

