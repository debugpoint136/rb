function htmltext_colorscale(minv, maxv, bg, nr, ng, nb, pr, pg, pb, nth, pth) {
    /* minv,maxv
     bg: background color
     nr,ng,nb, pr,pg,pb,
     nth,pth: color beyond p/n threshold, optional
     */
    if (maxv <= 0) {
        // only show negative bar
        return (nth == undefined ? '' : '<div style="width:10px;height:12px;display:inline-block;background-color:' + nth + ';"></div> ') +
            neatstr(minv) +
            ' <div style="width:50px;height:12px;display:inline-block;' +
            'background:-webkit-gradient(linear,left top,right top,from(rgb(' + nr + ',' + ng + ',' + nb + ')),to(' + bg + '));' +
            'background:-moz-linear-gradient(left,rgb(' + nr + ',' + ng + ',' + nb + '),' + bg + ');"></div> ' +
            neatstr(maxv);
    }
    if (minv >= 0) {
        // only show positive bar
        return neatstr(minv) +
            ' <div style="width:50px;height:12px;display:inline-block;' +
            'background:-webkit-gradient(linear,left top,right top,from(' + bg + '),to(rgb(' + pr + ',' + pg + ',' + pb + ')));' +
            'background:-moz-linear-gradient(left,' + bg + ',rgb(' + pr + ',' + pg + ',' + pb + '));"></div> ' +
            neatstr(maxv) +
            (pth == undefined ? '' : ' <div style="width:10px;height:12px;display:inline-block;background-color:' + pth + ';"></div>');
    }
// show both bars
    return (nth == undefined ? '' : '<div style="width:10px;height:12px;display:inline-block;background-color:' + nth + ';"></div> ') +
        neatstr(minv) +
        ' <div style="width:50px;height:12px;display:inline-block;' +
        'background:-webkit-gradient(linear,left top,right top,from(rgb(' + nr + ',' + ng + ',' + nb + ')),to(' + bg + '));' +
        'background:-moz-linear-gradient(left,rgb(' + nr + ',' + ng + ',' + nb + '),' + bg + ');' +
        '"></div> 0 <div style="width:50px;height:12px;display:inline-block;' +
        'background:-webkit-gradient(linear,left top,right top,from(' + bg + '),to(rgb(' + pr + ',' + pg + ',' + pb + ')));' +
        'background:-moz-linear-gradient(left,' + bg + ',rgb(' + pr + ',' + pg + ',' + pb + '));' +
        '"></div> ' + neatstr(maxv) +
        (pth == undefined ? '' : ' <div style="width:10px;height:12px;display:inline-block;background-color:' + pth + ';"></div>');
}