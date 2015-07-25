/**
 * GLOBAL SETTINGS
 */

var bb, cc;
var horcrux={};
var washUver='39.3.6';
var washUtag='\
<span style="color:#3a81ba;">W<span style="font-size:80%;">ASH</span>U</span> \
<span style="color:#ff9900;">E<span style="font-size:80%;">PI</span></span>\
<span style="color:#38761d;">G<span style="font-size:80%;">ENOME</span></span> \
<span style="color:#cc4125;">B<span style="font-size:80%;">ROWSER</span></span>';


// gflag declaration

var maxHeight_menu='1600px';
var literal_imd='internalmd';
var literal_imd_genome='Genome';
var literal_sample='Sample';
var literal_assay='Assay';
var literal_no_term='no';
var literal_snpurl='http://www.ncbi.nlm.nih.gov/projects/SNP/snp_ref.cgi?rs=';
var literal_facet_nouse='&nbsp;&nbsp;&nbsp;';

var densitydecorpaddingtop = 3; // density decor track padding top...
var tkAttrColumnWidth = 18;
var regionSpacing = {width:1,color:'#ccc'};
var thinStackHeight = 2;
var fullStackHeight = 11;
var instack_padding = 2;
var instack_arrowwidth = 3;
var instack_arrowspacing = 5;

var weavertkalnh=10;
var weavertkpad=5;
var weavertkseqh=fullStackHeight;
var weavertk_hspdist_strpad=5;
var weavertk_hspdist_strh=10;
var weavertkstackheight=weavertkseqh*2+weavertkalnh+1;
var weavertkcolor_target='#004D99';
var weavertkcolor_query='#99004D';
var gs_size_limit=1000; // max size of gene set
var rungsv_size_limit=200; // max size to run gsv
var trackitemnumAlert=5000;

var svgt_no=-1,
    svgt_rect_notscrollable=1, // not subject to move.styleLeft
    svgt_rect=8,
    svgt_circle=2,
    svgt_line=3,
    svgt_line_notscrollable=7,
    svgt_path=4,
    svgt_text=5,
    svgt_text_notscrollable=6,
    svgt_arc=9,
    svgt_trihm=10,
    svgt_polygon=11;
var min_hmspan=700;
var max_initial_qtkheight=50;
var max_viewable_chrcount=200;

var FT_nottk=-1,
    FT_bed_n=0,
    FT_bed_c=1,
    FT_bedgraph_n=2,
    FT_bedgraph_c=3,
    FT_sam_n=4,
    FT_sam_c=5,
    FT_pwc=6,
    FT_htest=7,
    FT_qdecor_n=8, // not in use
    FT_lr_n=9,
    FT_lr_c=10,
    FT_tkgrp=11,
    FT_cat_n=12, // categorical hmtk
    FT_cat_c=13,
    FT_bigwighmtk_n=14,
    FT_bigwighmtk_c=15,
    FT_matplot=16,
    FT_bam_n=17,
    FT_bam_c=18,
    FT_gs=19, // gene set, in bev
    FT_catmat=20,
    FT_weaver_c=21,
    FT_cm_c=22, // cytosin methylation
    FT_ld_c=23,
    FT_ld_n=26,
    FT_anno_n=24,
    FT_anno_c=25,
    FT_qcats=27,
    FT_huburl=100;
var FT2native=[];
FT2native[FT_bed_n]='bed';
FT2native[FT_bedgraph_n]='bedgraph';
FT2native[FT_bigwighmtk_n]='bigwig';
FT2native[FT_bam_n]='bam';
FT2native[FT_anno_n]='annotation';
FT2native[FT_ld_n]='ld';
var FT2noteurl={md:'http://wiki.wubrowse.org/Metadata'};
FT2noteurl[FT_weaver_c]='http://wiki.wubrowse.org/Genome_alignment';
FT2noteurl[FT_cm_c]='http://wiki.wubrowse.org/MethylC_track';
FT2noteurl[FT_matplot]='http://wiki.wubrowse.org/Matplot';
FT2noteurl[FT_huburl]='http://wiki.wubrowse.org/Datahub';
FT2noteurl[FT_anno_c]=FT2noteurl[FT_anno_n]='http://wiki.wubrowse.org/Hammock';
FT2noteurl[FT_catmat]='http://wiki.wubrowse.org/CategoricalMatrix';
FT2noteurl[FT_qcats]='http://wiki.wubrowse.org/QuantitativeCategorySeries';

var ftfilter_ordinary={}, ftfilter_numerical={};
// this converts ft to hub tk type
var FT2verbal = ['bed', 'bed', 'bedgraph', 'bedgraph', 'sam', 'sam', 'pwc', 'htest',
    'bigwig', 'interaction','interaction',
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
    'hammock','hammock',
    'ld',
    'quantitativecategoryseries',
];

var M_hide=0,
    M_show=1,
    M_thin=2,
    M_full=3,
    M_arc=4,
    M_trihm=5,
    M_den=6,
    M_bar=7,
    M_invalid=-1;
var mode2str=['hide', 'show', 'thin', 'full', 'arc', 'heatmap', 'density','barplot'];
var W_fine=1,
    W_rough=2;
var W_togglethreshold=10;

var month2str=[null,'January','February','March','April','May','June','July','August','September','October','November','December'];
var month2sstr=[null,'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];


var RM_genome=0,
    RM_jux_n=1, // juxtaposing over native bed
    RM_jux_c=2, // custom bed
    RM_gsv_c=3, // gene set, soft!
    RM_gsv_kegg=4, // not in use
    RM_rpbr_beam=5, // similar as gsv_c but rpbr only
    RM_yearmonthday=6, // time data, day as units, juxtapose using a bed track encoding the calenda
    RM_protein=7; // protein view
var RM2verbal=['genome',
    'juxtaposition',
    'juxtaposition',
    'gene set view',
    'KEGG pathway',
    'dark matter',
    'temporal data'];


var ideoHeight = 14, // for plotting ideogram
    cbarHeight = 9,
    browser_scalebar_height=27;


var MAXbpwidth=6;
var MAXbpwidth_bold=10;

var gsselect = {which:0}; // gene struct selection stuff


// colorCentral.js declaration

var urllenlimit = 4000; // url string length limit

var apps={};

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
var smear1,smear2;
var alertbox;
var msgconsole=undefined;