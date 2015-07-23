/**
 * Created by dpuru on 3/20/15.
 */


function Browser() {

    /** -- create session Id --**/
    var s = [];
    var i = 0;
    while (i < 10) {
        var j = 48 + parseInt(75 * Math.random());
        if (j <= 57) {
            s.push(j);
            i++;
        } else if (j >= 65 && j <= 90) {
            s.push(j);
            i++;
        } else if (j >= 97) {
            s.push(j);
            i++;
        }
        if (i == 10) break;
    }
    var s2 = [];
    for (var i = 0; i < 10; i++) s2.push(String.fromCharCode(s[i]));
    this.sessionId = s2.join('');

    /**-- create session Id ends --**/

    this.statusId = 1;
    this.urloffset = 0;
    this.highlight_regions = [];

    this.horcrux = Math.random().toString();
    horcrux[this.horcrux] = this;

    this.hmSpan = 1;
    this.regionLst = [];
    this.border = {lname: '', lpos: 0, rname: '', rpos: 0};

    this.tklst = [];

    /* doms */
    this.scalebar = {};

// md terms on rows/columns of track selection grid
    this.mcm = {
        lst: [], // sequence of terms in colormap, ele: [term, mdidx]
        sortidx: 0,
        holder: null, // holder of vertical term names, .attop tells header position
        tkholder: null, // holder of mcm canvas for tracks in ghm
        manuallysorted: false,
    };

    this.move = {
        direction: null, // l/r, null for indicating not moving
        merge: false, // if new data should be merged with old data for the same region
        offsetShift: 0, // use when merge is true, only for stack decor
        styleLeft: 0, // .style.left for movables
        oldpos: 0,
        moved: false,
        mousex: 0
    };
    this.entire = {
        length: 0,
        spnum: 0,
        summarySize: 0,
        atbplevel: false,
        bpwidth: 0
    };
    this.dspBoundary = {};
// critical paramter juxtaposition, set to null to indicate non-functional browser, e.g. golden pillar
    this.juxtaposition = {};
    this.ideogram = {
        canvas: null,
        band: [],
        chr: null,
        minihash: {},
        minirulerhash: {},
        longhash: {},
        minicanvaswidth: 0,
        minicanvasheight: 14,
        minirulerheight: 15,
        previous: [],
        cross: {sf: 0, lenlst: [], namelst: [],}
    };
    this.navigator = {
        canvas: null,
        chrbarheight: 14,
        rulerheight: 20, // set to 0 for not drawing, including spacing
        hlspacing: 2,
    };
    this.correlation = {
        targetft: -1, // target track file type, universal
        where: 0, // in case of bigwig, it need to know whether is 0 heatmap or 1 decor it belongs to
        targetname: '', // target track name
        rawdata: [],
        rankeddata: [],
        qtc: {pr: 255, pg: 50, pb: 50, nr: 50, ng: 50, nb: 255, pth: '#800000', nth: '#000099'},
        inuse: false,
        holder: null
    };
    this.htest = {
        pvalue: [],
        inuse: false,
        grpnum: 0,
        // only pcolor, ncolor are effective
        qtc: {
            pr: 255, pg: 77, pb: 77,
            nr: 255, ng: 77, nb: 77,
            pth: '#b30000', nth: '#b30000', thtype: 0, logtype: log_10, height: 50
        },
    };
    /* pairwise comparison central object */
    this.pwc = {
        inuse: false,
        qtc: {
            pr: 230, pg: 0, pb: 0, nr: 0, ng: 204, nb: 0,
            pth: '#800000', nth: '#008000',
            thtype: 0, thmin: -3, thmax: 3, thpercentile: 95,
            logtype: log_no,
            height: 50
        },
        gtn1: [], gtn2: [],
    };

    this.notes = [];

// a list of splinters
    this.splinters = {};
    this.trunk = null;
    this.splinterTag = null; // set to null to tell this is not a splinter

    this.animate_zoom_stat = 0;
    /* 0 for not zooming, or data ready for rendering
     1 for doing animated zooming, or ajax data not ready yet
     */

    this.tkgroup = [];
    /* group id 1,2,3 as array index
     ele: {scale, max, min, max_show, min_show}
     */
    this.weaver = null;
    this.__hubmdvlookup = {};
    this.__hubfailedmdvurl = {};
    return this;
}
