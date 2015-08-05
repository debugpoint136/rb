/**
 * GlobalSettings
 */

/** special notice, nasty quick fix, D'Arvit
 1.
 in db table ratiomatrix it uses geoid but not track name
 in browser it converts geo to a matching track
 but this tkobj remembers its geo
 2.
 subfam bed track are not officially in sukn
 but can be sneaked in and displayed in splinters
 as their tabix files are in /subtleKnife/hg19/
 but those tracks can't be shown as natives in sukn
 so they have to be represented as custom bed in hubs

 **/


// default and constant values
var browser;
var infodb='hg19repeat';
var basedb='hg19';
/*var datahuburllst=[ 'http://vizhub.wustl.edu/public/hg19/roadmap', 'http://vizhub.wustl.edu/public/hg19/encode'
 ];*/ // * -- dpuru -- *
var datahuburllst=[ 'http://vizhub.wustl.edu/public/hg19/encode'
];
var defaultGeneTrack='refGene';

// this is for hg19 only
var url_base='http://epigenomegateway.wustl.edu/browser/';
var url_genomebedgraph=url_base+'repeat/_d/genome_bedgraph/';
var url_subfambed=url_base+'repeat/_d/subfam_bed/';

var geneTrackColor='#00A4DB';
var defaultRepeatEnsembleTrack='rmsk_ensemble';
//var geopreload='GSM733769,GSM733708,GSM945188,GSM733772,GSM733664,GSM733677,GSM733758,GSM945196,GSM733771,GSM733679,GSM945212,GSM733736,GSM733642,GSM733767,GSM736620,GSM816665,GSM733752,GSM749706,GSM822312,GSM935611,GSM803355,GSM822270,GSM935386,GSM803485,GSM935612,GSM935608,GSM733734,GSM733682,GSM945201,GSM798322,GSM1003480,GSM733756,GSM733696,GSM945208,GSM733684,GSM733711,GSM945230,GSM733669,GSM733689,GSM1003483,GSM1003520,GSM736564,GSM816633,GSM816643,GSM733785,GSM749739,GSM822285,GSM733759,GSM803533,GSM822273,GSM935395,GSM935360,GSM935383';
var geopreload='GSM935580';

var apply_weight=false;

var pr=255,pg=0,pb=0,// dpuru : switching yellow to red
    nr=0,ng=0,nb=255;

// to configure the behavior, adjustable
var rowlabelwidth=150; // width
var cellwidth=2;
var cellwidth_zoomout=2;
var cellheight=10;


var wiggleheight=40;
var qtc_treat_a={pr:255,pg:255,pb:0,thtype:0,height:50,uselog:false};
var qtc_treat_u={pr:234,pg:145,pb:23,thtype:0,height:50,uselog:false};
var qtc_input_a={pr:37,pg:234,pb:23,thtype:0,height:50,uselog:false};
var qtc_input_u={pr:77,pg:129,pb:73,thtype:0,height:50,uselog:false};
var qtc_density={pr:194,pg:105,pb:114,thtype:0,height:50,uselog:false};

//var mdlst_row=['Sample','Epigenetic Mark','Transcription Regulator']; // dpuru : 06/30/2015
var mdlst_row=[];
var temcm_attrlst=['total bp #',
    'SINE','LINE','LTR','DNA',
    'Simple_repeat','Low_complexity','Satellite',
    'RNA','Other','Unknown']; /* subfam and temcm: repeat metadata colormap on top */
var temcm_cellheight=11; // TE mcm cell height
var subfamlabelheight=30;
var tkAttrColumnwidth=18;
var colorscalewidth=200;


// globals
var geo2id={};
var id2geo={};
var geoid2realtrack={};
var realtrack2geoid={};
/* quick fix, realtrack is the ones in sukn trackdb, linked to the geo here for querying info */
var subfam2id={};
var id2subfam={};
var col_runtime=[]; // run time
var col_runtime_all=[]; // all of the sub families
// var geo2md={}; // md transfered from hmtk to geo
var highlight_subfamid=null; // the id of the subfam to be highlighted

// doms
var colheader_holder;
var pica, picasays;
var pane;

var useRatioIdx=0; // 0 for ratio_1 (all reads), 2 for ratio_2 (unique only)



