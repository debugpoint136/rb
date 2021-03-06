/**
 * @Constructor
 */

var colorCentral = {
// the longlst can be altered by user, a copy will be made for default setting
    longlst:["rgb(255,255,0)",
        "rgb(255,153,0)","rgb(51,102,255)","rgb(255,102,255)","rgb(220,41,94)",
        "rgb(51,102,0)","rgb(0,153,255)","rgb(255,153,255)","rgb(0,204,0)",
        "rgb(255,102,0)","rgb(0,51,255)","rgb(255,51,255)","rgb(255,204,0)",
        "rgb(255,0,0)","rgb(0,204,255)","rgb(255,204,255)","rgb(51,255,0)",
        "rgb(51,153,153)","rgb(153,0,102)","rgb(153,204,51)","rgb(204,102,102)",
        "rgb(143,143,255)","rgb(82,82,255)","rgb(255,82,171)","rgb(214,0,111)",
        "rgb(162,82,255)","rgb(134,20,255)","rgb(214,104,0)","rgb(0,11,214)",
        "rgb(102,51,51)","rgb(176,99,176)","rgb(102,51,102)","rgb(184,46,0)",
        "rgb(245,61,0)","rgb(184,138,0)","rgb(0,138,184)","rgb(100,61,255)",
        "rgb(153,0,0)","rgb(153,77,0)","rgb(214,107,0)","rgb(153,153,0)"
    ],
    foreground:'#000000',
    fg_r:0, fg_g:0, fg_b:0,
    foregroundDim:'#ccc',
    background:'#ffffff',
    bg_faint:'rgba(100,100,100,.1)',
//pagebg:'rgba(217,217,206,0.7)',
    pagebg:'#f1ede8',
    iconbackground: "#AA839C", // light purple, manual button bg color
    iconfill:'#956584',
    tkentryfill:'rgba(204,204,255,0.5)',
    magenta7:'rgba(153,51,153,0.7)',
    magenta5:'rgba(153,51,153,0.5)',
    magenta2:'rgba(153,51,153,0.2)',
    magenta1:'rgba(153,51,153,0.1)',
};
var gapfillcolor=colorCentral.background;

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
var cytoWordColor = [0,0,255,255,255,255,0,255,255];
var centromereColor = "rgb(141,64,52)";
var ntbcolor = {g:'#3899c7', c:'#e05144', t:'#9238c7', a:'#89c738', n:'#858585'};

/* qtc  constant */
var scale_auto=0,
    scale_fix=1,
    scale_percentile=2,
    log_no=1,
    log_2=2,
    log_e=3,
    log_10=4,
    summeth_mean=1,
    summeth_max=2,
    summeth_min=3,
    summeth_sum=4;

/* default quantitative track style, will be copied over to their instances
 note height is for **plot height** not including top/bottom padding!
 */
var defaultQtcStyle = {
    heatmap:{pr:255,pg:0,pb:0,nr:0,ng:0,nb:230,pth:'#800000',nth:'#000099', thtype:scale_auto,thmin:0,thmax:10,thpercentile:90,height:15,summeth:summeth_mean},
    ft3:{pr:0,pg:0,pb:230,nr:255,ng:0,nb:0,pth:'#000099',nth:'#800000', thtype:scale_auto,thmin:0,thmax:10,thpercentile:90,height:15,summeth:summeth_mean},
    ft8:{pr:115,pg:0,pb:230,nr:179,ng:0,nb:179,pth:'#400080',nth:'#4d004d', thtype:scale_auto,thmin:0,thmax:10,thpercentile:95,height:50,summeth:summeth_mean},
    anno:{ textcolor:'#000000',
        fontsize:'8pt',
        fontfamily:'sans-serif',
        fontbold:false,
        bedcolor:'#336666'
    },
    ft5:{ textcolor:'#000000',
        fontsize:'8pt',
        fontfamily:'sans-serif',
        fontbold:false,
        forwardcolor:'rgb(0,0,153)',
        reversecolor:'rgb(153,0,0)',
        mismatchcolor:'rgb(255,255,0)',
    },
    interaction:{ textcolor:'#000000',
        thtype:scale_auto,
        fontsize:'8pt',
        fontfamily:'sans-serif',
        fontbold:false,
        pr:184,pg:0,pb:138,
        nr:0,ng:99,nb:133,
        pcolorscore:10,
        ncolorscore:-10,
        pfilterscore:0,
        nfilterscore:0,
        height:50, // for density mode
        anglescale:1,
    },
    // categorical
    ft12:{height:15},
    ft13:{height:15},
    // bev tracks
    bev:{pr:115,pg:0,pb:230,nr:179,ng:0,nb:179,pth:'#4d0099',nth:'#4D004d', thtype:scale_auto,thmin:0,thmax:10,thpercentile:95,height:30,summeth:summeth_mean},
    density:{pr:0,pg:77,pb:0,nr:0,ng:0,nb:230,pth:'#800000',nth:'#000099', thtype:scale_auto,thmin:0,thmax:10,thpercentile:95,height:50,summeth:summeth_mean},
};