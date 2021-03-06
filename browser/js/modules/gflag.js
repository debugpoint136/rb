/**
 * @Constructor
 */

var gflag = {
    allow_packhide_tkdata:false,
    browser:undefined,
    minichrjumping:false,
    hasgene:true, // TODO move to genome
    allowjuxtaposition:true,
    cpmove:{dom:null,oldx:0,oldy:0},
    movebbj:null,
    mcmtermmove:{},
    headerMove:{inuse:false}, // press on tk header and move vertically
    arrowpan:{}, // animated panning by clicking arrow
    /* for custom track to be submitted, key is url, not name
     because during urlparam parsing, genome is not there so name can't be made
     */
// for categorical track configuration
    cateTk:{which:-1,
        itemidx:null, // category idx
        item: null, // the color blob for the itemidx in config panel
    },
// querying sam read info when clicking on a sam track
    samread:{},
// moving terms horizontally in mcm metadata colormap
    zoomin:{}, // for zoom in
    zoomout:{}, // for zoom out
    animate_zoom:{},
    mdlst:[],
    mdp:{}, // invoking metadata vocabular panel
    gsm:{},
    tsp:{invoke:{type:-1},}, // invoking track selection panel, for purpose of submission
    /* type -1: not applicable
     1 native, clicking cell in big grid or sub-table
     2 native, clicking cell in the single criterion tree
     3 native, clicking "select all" option when mouse over a term in the big grid
     4 native, keyword search
     5 custom, clicking a cell in custom track grid

     ** gflag.tsp cannot be merged to apps.hmtk.type **
     */
    menu:{ // context menu
        catetk: {}, // categorical track
        tklst:[],
    },
    ctmae:{}, // custom track md anno editing
    splinter: null, // set to not null for splintering
    splinter_todolst:[], // fill content to indicate splinters come from restoring session or urlparam
// use bbj object for syncing (pan,zoom,jump)
    syncviewrange:null,
    shakedom:null,
    is_cors:false,
    cors_host:'',
    __pageMakeDom_called:false,
    dspstat_showgenomename: false,
    bbj_x_updating: {},
    dump:[],
    badjson:[],
    applst:[],
};
