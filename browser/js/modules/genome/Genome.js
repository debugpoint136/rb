/**
 * @Constructor
 * @param param
 * @return this<br><br><br>
 */

var genome = {}; // key: genome name (dbName), val: Genome object

function Genome(param) {
// page components must be ready
    this.init_genome_param = param; // need to keep it, some components will only be made after loading genome data
    this.hmtk = {};
    this.pending_custtkhash = {};
    this.temporal_ymd = null; // temporal data, at day-precision

    this.mdselect = {};
    var d = document.createElement('div');
    this.mdselect.main = d;
    if (param.custom_track) {
        this.custtk = {
            names: [],
        };

        // submission ui
        var d = document.createElement('div'); // overal wrapper
        d.style.position = 'relative';
        this.custtk.main = d;
        // launch buttons
        var d2 = dom_create('div', d, 'display:block;position:absolute;left:0px;top:0px;width:800px;');
        dom_create('div', d2, 'margin:15px 0px;color:white;').innerHTML = 'Tracks need to be hosted on a web server that is accessible by this browser server.';
        this.custtk.buttdiv = d2;
        var d3 = dom_create('div', d2);
        d3.className = 'largebutt';
        d3.addEventListener('click', function () {
            custtkpanel_show(FT_bedgraph_c);
        }, false);
        d3.innerHTML = 'bedGraph<div style="color:inherit;font-weight:normal;font-size:70%;">quantitative data</div>';

        d3 = dom_create('div', d2);
        d3.className = 'largebutt';
        d3.addEventListener('click', function () {
            custtkpanel_show(FT_bigwighmtk_c);
        }, false);
        d3.innerHTML = 'bigWig';

        d3 = dom_create('div', d2);
        d3.className = 'largebutt';
        d3.addEventListener('click', function () {
            custtkpanel_show(FT_cat_c);
        }, false);
        d3.innerHTML = 'Categorical';

        dom_create('br', d2);

        d3 = dom_create('div', d2);
        d3.className = 'largebutt';
        d3.addEventListener('click', function () {
            custtkpanel_show(FT_anno_c);
        }, false);
        d3.innerHTML = 'Hammock<div style="color:inherit;font-weight:normal;font-size:70%;">annotation data</div>';
        d3 = dom_create('div', d2);
        d3.className = 'largebutt';
        d3.addEventListener('click', function () {
            custtkpanel_show(FT_weaver_c);
        }, false);
        d3.innerHTML = 'Genomealign<div style="color:inherit;font-weight:normal;font-size:70%;">Genome alignment</div>';

        d3 = dom_create('div', d2);
        d3.className = 'largebutt';
        d3.addEventListener('click', function () {
            custtkpanel_show(FT_lr_c);
        }, false);
        d3.innerHTML = 'Interaction<div style="color:inherit;font-weight:normal;font-size:70%;">pairwise interaction</div>';

        d3 = dom_create('div', d2);
        d3.className = 'largebutt';
        d3.addEventListener('click', function () {
            custtkpanel_show(FT_bed_c);
        }, false);
        d3.innerHTML = 'BED';

        d3 = dom_create('div', d2);
        d3.className = 'largebutt';
        d3.addEventListener('click', function () {
            custtkpanel_show(FT_bam_c);
        }, false);
        d3.innerHTML = 'BAM';
        dom_create('br', d2);
        d3 = dom_create('div', d2, 'color:rgb(81,118,96);');
        d3.className = 'largebutt';
        d3.addEventListener('click', function () {
            custtkpanel_show(FT_huburl);
        }, false);
        var butt = dom_create('input', d2, 'display:none');
        butt.type = 'file';
        butt.addEventListener('change', jsonhub_choosefile, false);
        d3.innerHTML = 'Datahub<div style="color:inherit;font-weight:normal;">by URL link</div>';
        d3 = dom_create('div', d2, 'color:rgb(81,118,96);');
        d3.className = 'largebutt';
        d3.addEventListener('click', jsonhub_upload, false);
        d3.innerHTML = 'Datahub<div style="color:inherit;font-weight:normal;">by upload</div>';
        dom_create('div', d2, 'margin:15px 0px;color:white;').innerHTML = 'Got text files instead? <span class=clb3 onclick="toggle7_2();toggle27()">Upload them from your computer.</span>' +
            '<br><br>To submit <a href=' + FT2noteurl[FT_cm_c] + ' target=_blank>methylC</a> or <a href=' + FT2noteurl[FT_matplot] + ' target=_blank>matplot</a> track, use Datahub.';
        // submission ui
        d2 = dom_create('div', d, 'position:absolute;display:none;');
        this.custtk.ui_submit = d2;
        this.custtk.ui_bedgraph = this.custtk_makeui(FT_bedgraph_c, d2);
        this.custtk.ui_hammock = this.custtk_makeui(FT_anno_c, d2);
        this.custtk.ui_weaver = this.custtk_makeui(FT_weaver_c, d2);
        this.custtk.ui_bed = this.custtk_makeui(FT_bed_c, d2);
        this.custtk.ui_lr = this.custtk_makeui(FT_lr_c, d2);
        this.custtk.ui_bigwig = this.custtk_makeui(FT_bigwighmtk_c, d2);
        this.custtk.ui_cat = this.custtk_makeui(FT_cat_c, d2);
        this.custcate_idnum_change(5);
        this.custtk.ui_bam = this.custtk_makeui(FT_bam_c, d2);
        this.custtk.ui_hub = this.custtk_makeui(FT_huburl, d2);
    }

    this.scaffold = {};
    this.defaultStuff = {};

    /*** bird's eye view
     track canvas's height will be .qtc.height, with no padding
     but will have 4px top margin

     "data" points to a hash of tracks
     key: track name
     value: {}
     'data': the data vector, addressed by chr name
     'tr': <tr> in bev_dataregistry
     'min', 'max': threshold values
     'minspan', 'maxspan': place to write threshold values in <tr>
     'canvas':{'chr1':<canvas>,...}
     "ongoing" indicates the track that's been computed
     could be undefined, to indicate that all vectors are under focus...
     "pressedChr" the chr name that is used for zoom in
     'scfd' is a partial replicate of global object scaffold
     ***/
    this.bev = {};
    return this;
}