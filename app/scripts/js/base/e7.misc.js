/**
 * Created by dpuru on 2/27/15.
 */


/** __misc__ */
function blog_facet() {
    window.open("http://washugb.blogspot.com/2013/09/v24-3-of-3-facet-panel.html");
}
function blog_session() {
    window.open("http://washugb.blogspot.com/2014/01/v31-2-of-3-sessions.html");
}
function blog_fud() {
    window.open("http://washugb.blogspot.com/2014/01/v31-3-of-3-file-upload.html");
}
function blog_publichub() {
    window.open("http://washugb.blogspot.com/2013/07/v22-2-of-3-public-datahubs.html");
}
function blog_geneset() {
    window.open("http://washugb.blogspot.com/2013/07/v21-creating-and-managing-multiple-gene.html");
}
function blog_circlet() {
    window.open('http://washugb.blogspot.com/2013/04/v17-circlet-view.html');
}
function app_get_sequence(event) {
    var bbj = gflag.menu.bbj;
    var lst = menu.apppanel.getseq.input.value.split('\n');
    if (lst.length == 0) {
        print2console('No coordinates given', 2);
        return;
    }
    var gc = [],
        lc = []; // for looking
    for (var i = 0; i < lst.length; i++) {
        var c = bbj.genome.parseCoordinate(lst[i], 2);
        if (c && c[0] == c[2]) {
            if (c[3] - c[1] > 5000) {
                print2console('Sequence was trimmed to 5kb', 2);
                c[3] = c[1] + 5000;
            }
            gc.push(c[0] + ',' + c[1] + ',' + c[3]);
            lc.push(c[0] + ':' + c[1] + '-' + c[3]);
        }
    }
    if (gc.length == 0) {
        print2console('No acceptable coordinates, please check your input', 2);
        return;
    }
    event.target.disabled = true;
    bbj.ajax("getChromseq=on&regionlst=" + gc.join(',') + '&dbName=' + bbj.genome.name, function (data) {
        app_showseq(data, lc);
    });
}
function app_showseq(data, coordlst) {
    menu.apppanel.getseq.butt.disabled = false;
    if (!data || !data.lst) {
        print2console('Error retrieving sequence, please try again.', 2);
        return;
    }
    menu.apppanel.getseq.main.style.display = 'none';
    menu.c32.style.display = 'block';
    stripChild(menu.c32, 0);
    var d = dom_create('div', menu.c32, 'width:500px;margin:15px;');
    for (var i = 0; i < data.lst.length; i++) {
        dom_create('div', d, 'opacity:.7').innerHTML = '>' + coordlst[i];
        dom_create('div', d, 'word-wrap:break-word;font-family:Courier;font-size:80%;').innerHTML = data.lst[i];
    }
    placePanel(menu);
}
/** __misc__ */