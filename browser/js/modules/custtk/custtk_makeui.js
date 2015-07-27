/**
 * ===BASE===// custtk // custtk_makeui.js
 * @param __Genome.prototype__
 * @param 
 */

Genome.prototype.custtk_makeui = function (ft, holder) {
    var d = make_headertable(holder);
    d.style.position = 'absolute';
    d.style.left = 0;
    d.style.top = 0;
    d._c.style.padding = '20px 30px';
    var ftname;
    switch (ft) {
        case FT_bedgraph_c:
            d._h.innerHTML = 'bedGraph track | <a href=http://washugb.blogspot.com/2012/09/generate-tabix-files-from-bigwig-files.html target=_blank>help</a>';
            ftname = 'bedGraph';
            break;
        case FT_cat_c:
            d._h.innerHTML = 'Categorical track | <a href=http://washugb.blogspot.com/2013/08/v23-custom-categorical-track.html target=_blank>help</a>';
            ftname = 'categorical';
            break;
        case FT_bed_c:
            d._h.innerHTML = 'Bed track | <a href=http://washugb.blogspot.com/2012/09/generate-tabix-files-from-bigbed-files.html target=_blank>help</a>';
            ftname = 'BED';
            break;
        case FT_anno_c:
            d._h.innerHTML = 'Hammock track | <a href=' + FT2noteurl[FT_anno_n] + ' target=_blank>help</a>';
            ftname = 'hammock';
            break;
        case FT_lr_c:
            d._h.innerHTML = 'Pairwise interaction track <a href=http://washugb.blogspot.com/2012/09/prepare-custom-long-range-interaction.html target=_blank>help</a>';
            ftname = 'long-range interaction';
            break;
        case FT_sam_c:
            d._h.innerHTML = '<a href=http://washugb.blogspot.com/2012/09/generate-tabix-file-from-bam-file.html target=_blank>help</a>';
            ftname = 'SAM';
            break;
        case FT_huburl:
            d._h.innerHTML = 'Data hub | <a href=' + FT2noteurl[FT_huburl] + ' target=_blank>JSON format preferred</a>, <a href=http://washugb.blogspot.com/2013/11/v29-2-of-4-displaying-track-hubs-from.html target=_blank>UCSC format partially supported</a>';
            ftname = 'Datahub';
            break;
        case FT_bigwighmtk_c:
            d._h.innerHTML = 'bigWig track | <a href=http://genome.ucsc.edu/goldenPath/help/bigWig.html target=_blank>help</a>';
            ftname = 'bigWig';
            break;
        case FT_bam_c:
            d._h.innerHTML = 'BAM track | <a href=http://washugb.blogspot.com/2013/05/v18-new-page-look-bam-file-support.html target=_blank>help</a>';
            ftname = 'BAM';
            break;
        case FT_weaver_c:
            d._h.innerHTML = 'Genomealign track | <a href=' + FT2noteurl[FT_weaver_c] + ' target=_blank>help</a>';
            ftname = 'Genomealign';
            break;
    }

    var table = dom_create('table', d._c);
    table.style.whiteSpace = 'nowrap';
    table.cellSpacing = 10;
// row 1
    var tr = table.insertRow(0);
    var td = tr.insertCell(0);
    td.align = 'right';
    td.innerHTML = ftname + ' file URL';
    var td = tr.insertCell(1);
    var inp = dom_create('input', td);
    inp.type = 'text';
    inp.size = 40;
    d.input_url = inp;
    if (ft == FT_huburl) {
        // tabular or json?
        d.select = dom_addselect(td, null, [
            {value: 'json', text: 'JSON', selected: true},
            {value: 'ucsctrackdb', text: 'UCSC data hub'}]);
    }
// row 2
    tr = table.insertRow(-1);
    td = tr.insertCell(0);
    td.align = 'right';
    if (ft != FT_huburl) {
        td.innerHTML = ft == FT_weaver_c ? 'Query genome name' : 'Track name';
    }
    td = tr.insertCell(1);
    if (ft == FT_huburl) {
    } else {
        inp = dom_create('input', td);
        inp.type = 'text';
        inp.size = 20;
        d.input_name = inp;
    }
    dom_addbutt(td, 'Clear', function () {
        d.input_url.value = '';
        if (d.input_name) d.input_name.value = '';
    });
// row 3
    if (ft == FT_anno_c || ft == FT_bed_c || ft == FT_lr_c || ft == FT_sam_c || ft == FT_bam_c) {
        tr = table.insertRow(-1);
        td = tr.insertCell(0);
        td.align = 'right';
        td.innerHTML = 'Show as';
        td = tr.insertCell(1);
        var options = [
            {value: M_full, text: 'full'},
            {value: M_thin, text: 'thin'},
        ];
        if (ft == FT_anno_c || ft == FT_bed_c || ft == FT_sam_c || ft == FT_bam_c) {
            options.push({value: M_den, text: 'density'});
        } else if (ft == FT_lr_c) {
            options.unshift({value: M_trihm, text: 'heatmap'});
            options.unshift({value: M_arc, text: 'arc'});
        }
        d.mode = dom_addselect(td, null, options);
    }
// row 4-5
    if (ft == FT_anno_c) {
        tr = table.insertRow(-1);
        td = tr.insertCell(0);
        td.align = 'right';
        td.innerHTML = 'JSON descriptions<br><span style="font-size:70%;opacity:.7;">required when "category" or "scorelst"<br>attributes are used<br><a href=' + FT2noteurl[FT_anno_n] + '#Compound_attributes target=_blank>learn more</a></span>';
        td = tr.insertCell(1);
        inp = dom_create('textarea', td);
        inp.rows = 4;
        inp.cols = 20;
        d.input_json = inp;
    }
    if (ft == FT_lr_c) {
        tr = table.insertRow(-1);
        td = tr.insertCell(0);
        td.align = 'right';
        td.innerHTML = 'Positive score cutoff';
        td = tr.insertCell(1);
        inp = dom_create('input', td);
        d.input_pscore = inp;
        inp.type = 'text';
        inp.size = 3;
        inp.value = 2;
        dom_addtext(td, 'only applies to positively-scored items', '#858585');
        tr = table.insertRow(-1);
        td = tr.insertCell(0);
        td.align = 'right';
        td.innerHTML = 'Negative score cutoff';
        td = tr.insertCell(1);
        inp = dom_create('input', td);
        d.input_nscore = inp;
        inp.type = 'text';
        inp.size = 3;
        inp.value = -2;
        dom_addtext(td, 'only applies to negatively-scored items', '#858585');
    }
    if (ft == FT_cat_c) {
        tr = table.insertRow(-1);
        td = tr.insertCell(0);
        td.align = 'right';
        td.innerHTML = 'Number of categories';
        td = tr.insertCell(1);
        var ip = dom_create('input', td);
        ip.type = 'text';
        ip.value = 5;
        ip.size = 5;
        ip.addEventListener('change', custcate_idnum_change_input, false);
        d.category_idnum = ip;
        dom_addbutt(td, 'set', custcate_idnum_change_input);
        tr = table.insertRow(-1);
        td = tr.insertCell(0);
        td.colSpan = 2;
        var d2 = dom_create('div', td, 'display:table;margin:5px 100px;padding:5px 15px;border:solid 1px #ccc;');
        dom_addtext(d2, 'Define categories of this track');
        d.category_table = dom_create('table', d2, 'display:block;margin-top:10px;');
    }
    tr = table.insertRow(-1);
    if (ft == FT_weaver_c) {
        td = tr.insertCell(0);
        td.align = 'right';
        td.innerHTML = 'Prebuilt alignments<div style="font-size:80%">source: <a href=http://genome.ucsc.edu target=_blank>UCSC Genome Browser</a></div>';
        d.weavertkholder = tr.insertCell(1);
        tr = table.insertRow(-1);
        tr.insertCell(0);
        td = tr.insertCell(1);
        d.submit_butt = dom_addbutt(td, 'SUBMIT', submitCustomtrack);
        d.submit_butt.ft = ft;
    } else {
        td = tr.insertCell(0);
        td.align = 'right';
        d.examplebutt = dom_addbutt(td, 'Use example', function () {
            custtk_useexample(ft);
        });
        td = tr.insertCell(1);
        d.submit_butt = dom_addbutt(td, 'SUBMIT', submitCustomtrack);
        d.submit_butt.ft = ft;
    }
    d.style.display = 'none';
    return d;
};

