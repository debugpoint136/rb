var bb, cc;
var horcrux = {};
var washUver = '39.3.5';
var washUtag = '\
<span style="color:#3a81ba;">W<span style="font-size:80%;">ASH</span>U</span> \
<span style="color:#ff9900;">E<span style="font-size:80%;">PI</span></span>\
<span style="color:#38761d;">G<span style="font-size:80%;">ENOME</span></span> \
<span style="color:#cc4125;">B<span style="font-size:80%;">ROWSER</span></span>';


var gflag;
gflag = {
    allow_packhide_tkdata: false,
    browser: undefined,
    minichrjumping: false,
    hasgene: true, // TODO move to genome
    allowjuxtaposition: true,
    cpmove: {dom: null, oldx: 0, oldy: 0},
    movebbj: null,
    mcmtermmove: {},
    headerMove: {inuse: false}, // press on tk header and move vertically
    arrowpan: {}, // animated panning by clicking arrow
    /* for custom track to be submitted, key is url, not name
     because during urlparam parsing, genome is not there so name can't be made
     */
// for categorical track configuration
    cateTk: {
        which: -1,
        itemidx: null, // category idx
        item: null, // the color blob for the itemidx in config panel
    },
// querying sam read info when clicking on a sam track
    samread: {},
// moving terms horizontally in mcm metadata colormap
    zoomin: {}, // for zoom in
    zoomout: {}, // for zoom out
    animate_zoom: {},
    mdlst: [],
    mdp: {}, // invoking metadata vocabular panel
    gsm: {}, //Gene Set Model
    tsp: {invoke: {type: -1},}, // invoking track selection panel, for purpose of submission
    /* type -1: not applicable
     1 native, clicking cell in big grid or sub-table
     2 native, clicking cell in the single criterion tree
     3 native, clicking "select all" option when mouse over a term in the big grid
     4 native, keyword search
     5 custom, clicking a cell in custom track grid

     ** gflag.tsp cannot be merged to apps.hmtk.type ** //?dpuru: what is hmtk? histoneModification track??
     */
    menu: { // context menu
        catetk: {}, // categorical track
        tklst: [],
    },
    ctmae: {}, // custom track md anno editing
    splinter: null, // set to not null for splintering
    splinter_todolst: [], // fill content to indicate splinters come from restoring session or urlparam
// use bbj object for syncing (pan,zoom,jump)
    syncviewrange: null,
    shakedom: null,
    is_cors: false,
    cors_host: '',
    __pageMakeDom_called: false,
    dspstat_showgenomename: false,
    bbj_x_updating: {}, //what is bbj//?dpuru
    dump: [],
    badjson: [],
    applst: []
};

var maxHeight_menu = '1600px';
var literal_imd = 'internalmd';
var literal_imd_genome = 'Genome';
var literal_sample = 'Sample';
var literal_assay = 'Assay';
var literal_no_term = 'no';
var literal_snpurl = 'http://www.ncbi.nlm.nih.gov/projects/SNP/snp_ref.cgi?rs=';
var literal_facet_nouse = '&nbsp;&nbsp;&nbsp;';

var densitydecorpaddingtop = 3; // density decor track padding top...
var tkAttrColumnWidth = 18;
var regionSpacing = {width: 1, color: '#ccc'};
var thinStackHeight = 2;
var fullStackHeight = 11;
var instack_padding = 2;
var instack_arrowwidth = 3;
var instack_arrowspacing = 5;

var weavertkalnh = 10; //where is weaver//?dpuru
var weavertkpad = 5;
var weavertkseqh = fullStackHeight;
var weavertk_hspdist_strpad = 5;
var weavertk_hspdist_strh = 10;
var weavertkstackheight = weavertkseqh * 2 + weavertkalnh + 1;
var weavertkcolor_target = '#004D99';
var weavertkcolor_query = '#99004D';
var gs_size_limit = 1000; // max size of gene set
var rungsv_size_limit = 200; // max size to run gsv
var trackitemnumAlert = 5000;

/*what is the below section for*///?dpuru
var svgt_no = -1,
    svgt_rect_notscrollable = 1, // not subject to move.styleLeft
    svgt_rect = 8,
    svgt_circle = 2,
    svgt_line = 3,
    svgt_line_notscrollable = 7,
    svgt_path = 4,
    svgt_text = 5,
    svgt_text_notscrollable = 6,
    svgt_arc = 9,
    svgt_trihm = 10,
    svgt_polygon = 11;
var min_hmspan = 700;
var max_initial_qtkheight = 50;
var max_viewable_chrcount = 200;

/*FT: track format , _n for numberical _c for categorical
  giving each track format a unique identifier*///dpuru
var FT_nottk = -1,
    FT_bed_n = 0,
    FT_bed_c = 1,
    FT_bedgraph_n = 2,
    FT_bedgraph_c = 3,
    FT_sam_n = 4,
    FT_sam_c = 5,
    FT_pwc = 6,
    FT_htest = 7,
    FT_qdecor_n = 8, // not in use
    FT_lr_n = 9,
    FT_lr_c = 10,
    FT_tkgrp = 11,
    FT_cat_n = 12, // categorical hmtk
    FT_cat_c = 13,
    FT_bigwighmtk_n = 14,
    FT_bigwighmtk_c = 15,
    FT_matplot = 16,
    FT_bam_n = 17,
    FT_bam_c = 18,
    FT_gs = 19, // gene set, in bev
    FT_catmat = 20,
    FT_weaver_c = 21,
    FT_cm_c = 22, // cytosin methylation
    FT_ld_c = 23,
    FT_ld_n = 26,
    FT_anno_n = 24,
    FT_anno_c = 25,
    FT_qcats = 27,
    FT_huburl = 100;
var FT2native = [];
FT2native[FT_bed_n] = 'bed';
FT2native[FT_bedgraph_n] = 'bedgraph';
FT2native[FT_bigwighmtk_n] = 'bigwig';
FT2native[FT_bam_n] = 'bam';
FT2native[FT_anno_n] = 'annotation';
FT2native[FT_ld_n] = 'ld';
var FT2noteurl = {md: 'http://wiki.wubrowse.org/Metadata'};
FT2noteurl[FT_weaver_c] = 'http://wiki.wubrowse.org/Genome_alignment';
FT2noteurl[FT_cm_c] = 'http://wiki.wubrowse.org/MethylC_track';
FT2noteurl[FT_matplot] = 'http://wiki.wubrowse.org/Matplot';
FT2noteurl[FT_huburl] = 'http://wiki.wubrowse.org/Datahub';
FT2noteurl[FT_anno_c] = FT2noteurl[FT_anno_n] = 'http://wiki.wubrowse.org/Hammock';
FT2noteurl[FT_catmat] = 'http://wiki.wubrowse.org/CategoricalMatrix';
FT2noteurl[FT_qcats] = 'http://wiki.wubrowse.org/QuantitativeCategorySeries';

var ftfilter_ordinary = {}, ftfilter_numerical = {};
// this converts ft to hub tk type
var FT2verbal = ['bed', 'bed', 'bedgraph', 'bedgraph', 'sam', 'sam', 'pwc', 'htest',
    'bigwig', 'interaction', 'interaction',
    'track group mysql table',
    'categorical', 'categorical',
    'bigwig', 'bigwig',
    'matplot',
    'bam', 'bam',
    'bev gs',
    'categorymatrix',
    'genomealign',
    'methylc',
    'ld',
    'hammock', 'hammock',
    'ld',
    'quantitativecategoryseries',
];

//dpuru : different track modes :  unique mode ids
var M_hide = 0,
    M_show = 1,
    M_thin = 2,
    M_full = 3,
    M_arc = 4,
    M_trihm = 5,
    M_den = 6,
    M_bar = 7,
    M_invalid = -1;
var mode2str = ['hide', 'show', 'thin', 'full', 'arc', 'heatmap', 'density', 'barplot'];
var W_fine = 1,
    W_rough = 2;
var W_togglethreshold = 10;

var month2str = [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var month2sstr = [null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//?dpuru: what is RM?
var RM_genome = 0,
    RM_jux_n = 1, // juxtaposing over native bed
    RM_jux_c = 2, // custom bed
    RM_gsv_c = 3, // gene set, soft!
    RM_gsv_kegg = 4, // not in use
    RM_rpbr_beam = 5, // similar as gsv_c but rpbr only
    RM_yearmonthday = 6, // time data, day as units, juxtapose using a bed track encoding the calenda
    RM_protein = 7; // protein view
var RM2verbal = ['genome',
    'juxtaposition',
    'juxtaposition',
    'gene set view',
    'KEGG pathway',
    'dark matter',
    'temporal data'];


var ideoHeight = 14, // for plotting ideogram
    cbarHeight = 9,
    browser_scalebar_height = 27;


var MAXbpwidth = 6;
var MAXbpwidth_bold = 10;

var gsselect = {which: 0}; // gene struct selection stuff

var colorCentral = {
// the longlst can be altered by user, a copy will be made for default setting
    longlst: ["rgb(255,255,0)",
        "rgb(255,153,0)", "rgb(51,102,255)", "rgb(255,102,255)", "rgb(220,41,94)",
        "rgb(51,102,0)", "rgb(0,153,255)", "rgb(255,153,255)", "rgb(0,204,0)",
        "rgb(255,102,0)", "rgb(0,51,255)", "rgb(255,51,255)", "rgb(255,204,0)",
        "rgb(255,0,0)", "rgb(0,204,255)", "rgb(255,204,255)", "rgb(51,255,0)",
        "rgb(51,153,153)", "rgb(153,0,102)", "rgb(153,204,51)", "rgb(204,102,102)",
        "rgb(143,143,255)", "rgb(82,82,255)", "rgb(255,82,171)", "rgb(214,0,111)",
        "rgb(162,82,255)", "rgb(134,20,255)", "rgb(214,104,0)", "rgb(0,11,214)",
        "rgb(102,51,51)", "rgb(176,99,176)", "rgb(102,51,102)", "rgb(184,46,0)",
        "rgb(245,61,0)", "rgb(184,138,0)", "rgb(0,138,184)", "rgb(100,61,255)",
        "rgb(153,0,0)", "rgb(153,77,0)", "rgb(214,107,0)", "rgb(153,153,0)"
    ],
    foreground: '#000000',
    fg_r: 0, fg_g: 0, fg_b: 0,
    foregroundDim: '#ccc',
    background: '#ffffff',
    bg_faint: 'rgba(100,100,100,.1)',
//pagebg:'rgba(217,217,206,0.7)',
    pagebg: '#f1ede8',
    iconbackground: "#AA839C", // light purple, manual button bg color
    iconfill: '#956584',
    tkentryfill: 'rgba(204,204,255,0.5)',
    magenta7: 'rgba(153,51,153,0.7)',
    magenta5: 'rgba(153,51,153,0.5)',
    magenta2: 'rgba(153,51,153,0.2)',
    magenta1: 'rgba(153,51,153,0.1)',
};
var gapfillcolor = colorCentral.background;

// cytoband, monotonic color
var cytoBandColor = [
    255, // gneg
    180, // gpos25
    120, // gpos50
    60, // gpos75
    0, // gpos100
    0, // gvar
    180, // stalk
    142, // gpos33
    57 // gpos66
];
var cytoWordColor = [0, 0, 255, 255, 255, 255, 0, 255, 255];
var centromereColor = "rgb(141,64,52)";
var ntbcolor = {g: '#3899c7', c: '#e05144', t: '#9238c7', a: '#89c738', n: '#858585'};

/* qtc  constant */
var scale_auto = 0,
    scale_fix = 1,
    scale_percentile = 2,
    log_no = 1,
    log_2 = 2,
    log_e = 3,
    log_10 = 4,
    summeth_mean = 1,
    summeth_max = 2,
    summeth_min = 3,
    summeth_sum = 4;

/* default quantitative track style, will be copied over to their instances
 note height is for **plot height** not including top/bottom padding!
 */
var defaultQtcStyle = {
    heatmap: {
        pr: 255,
        pg: 0,
        pb: 0,
        nr: 0,
        ng: 0,
        nb: 230,
        pth: '#800000',
        nth: '#000099',
        thtype: scale_auto,
        thmin: 0,
        thmax: 10,
        thpercentile: 90,
        height: 15,
        summeth: summeth_mean
    },
    ft3: {
        pr: 0,
        pg: 0,
        pb: 230,
        nr: 255,
        ng: 0,
        nb: 0,
        pth: '#000099',
        nth: '#800000',
        thtype: scale_auto,
        thmin: 0,
        thmax: 10,
        thpercentile: 90,
        height: 15,
        summeth: summeth_mean
    },
    ft8: {
        pr: 115,
        pg: 0,
        pb: 230,
        nr: 179,
        ng: 0,
        nb: 179,
        pth: '#400080',
        nth: '#4d004d',
        thtype: scale_auto,
        thmin: 0,
        thmax: 10,
        thpercentile: 95,
        height: 50,
        summeth: summeth_mean
    },
    anno: {
        textcolor: '#000000',
        fontsize: '8pt',
        fontfamily: 'sans-serif',
        fontbold: false,
        bedcolor: '#336666'
    },
    ft5: {
        textcolor: '#000000',
        fontsize: '8pt',
        fontfamily: 'sans-serif',
        fontbold: false,
        forwardcolor: 'rgb(0,0,153)',
        reversecolor: 'rgb(153,0,0)',
        mismatchcolor: 'rgb(255,255,0)',
    },
    interaction: {
        textcolor: '#000000',
        thtype: scale_auto,
        fontsize: '8pt',
        fontfamily: 'sans-serif',
        fontbold: false,
        pr: 184, pg: 0, pb: 138,
        nr: 0, ng: 99, nb: 133,
        pcolorscore: 10,
        ncolorscore: -10,
        pfilterscore: 0,
        nfilterscore: 0,
        height: 50, // for density mode
        anglescale: 1,
    },
    // categorical
    ft12: {height: 15},
    ft13: {height: 15},
    // bev tracks
    bev: {
        pr: 115,
        pg: 0,
        pb: 230,
        nr: 179,
        ng: 0,
        nb: 179,
        pth: '#4d0099',
        nth: '#4D004d',
        thtype: scale_auto,
        thmin: 0,
        thmax: 10,
        thpercentile: 95,
        height: 30,
        summeth: summeth_mean
    },
    density: {
        pr: 0,
        pg: 77,
        pb: 0,
        nr: 0,
        ng: 0,
        nb: 230,
        pth: '#800000',
        nth: '#000099',
        thtype: scale_auto,
        thmin: 0,
        thmax: 10,
        thpercentile: 95,
        height: 50,
        summeth: summeth_mean
    },
};

var urllenlimit = 4000; // url string length limit

var apps = {};

var pica;
var menu;
var menu2;
var picasays;
var bubble;
var invisibleBlanket;
var indicator2;
var scalebarbeam;
var pagecloak;
var waitcloak;
var glasspane;
var smear1, smear2;
var alertbox;
var msgconsole = undefined;

