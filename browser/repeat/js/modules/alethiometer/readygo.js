/**
 * Launch Sequence
 */

function readygo()
{
    colorCentral.foreground='#333333'; // dpuru : changed from #EAE3CB
    colorCentral.background='#FFFFFF'; // dpuru : changed from #3f7271
    colorCentral.fg_r=188;
    colorCentral.fg_g=201;
    colorCentral.fg_b=188;
    colorCentral.hl='#1814FD';
    colorCentral.pagebg='rgb(255, 255, 255)'; // dpuru : changed from rgb(63,102,130)
    regionSpacing.color='#333333'; // dpuru : changed from #FCF4DC

    document.body.addEventListener('keyup',page_keyup,false);
    document.getElementById('headerdiv').style.backgroundColor=colorCentral.pagebg;

    colheader_holder=document.getElementById('mapcolheader_holder');

    gflag.zoomin={x:null, atfinest:false};

    var c='rgba('+colorCentral.fg_r+','+colorCentral.fg_g+','+colorCentral.fg_b+',0.7)';

    page_makeDoms(
        {
            app_bbjconfig:true,
            cp_scatter:{
                htextcolor:c,
                htext:'Scatter plot',
                hbutt1:{text:'&#10005;',
                    bg:c,
                    fg:'black',
                    call:toggle19},
                hbutt2:{text:'Go back',
                    call:scatterplot_goback,
                    fg:'white',
                    bg:'#545454'},
            },
            cp_hmtk:{
                htextcolor:c,
                htext:'Experimental assay tracks',
                hbutt1:{text:'&#10005;',
                    bg:c,
                    fg:'black',
                    call:toggle1_2},
            },
            cp_publichub:{
                htext:'Public track hubs',
                hbutt1:{text:'&#10005;',call:toggle8_2},
                hbutt2:{text:'?', call:blog_publichub,},
            },
        }
    );

    apps.hmtk.holder.nextSibling.innerHTML='';

// hide region input from scatterplot
    var s=apps.scp;
    s.input_tr.style.display='none';
    s.dotcolor_r=s.dotcolor_g=s.dotcolor_b=255;
    s.dotcolor_span.style.backgroundColor='#ffffff';
    s.dotcolor_span.style.color='black';
    s.dot_opacity=0.2;

// make app for genome graph
    var d=make_controlpanel({htextcolor:c,
        htext:'Detailed view',
        hbutt1:{text:'&#10005;',
            bg:c,
            fg:'black',
            call:pane_hide},
        hbutt2:{}
    });
    apps.gg={main:d};
    var d2=d.__hbutt2.parentNode;
    apps.gg.handleholder=d2;
    stripChild(d2,0);
    d2.style.padding='';
    apps.gg.holder=dom_create('div',d.__contentdiv);
    apps.gg.view={};
    apps.gg.chrbarheight=14;
    apps.gg.chrwidth={};
    apps.gg.decortklst=[];
    /* viewobj.type:
     1. only shows position of genome copies of a subfam
     2. a subfam and a geo data set
     */

    pagecloak.style.backgroundColor='rgb(29, 96, 154)'; //dpuru : changed from rgb(0,30,0)
    pagecloak.style.opacity=0.85;

    menu.style.backgroundColor='rgba(245, 245, 245, 1)'; //dpuru : changed from rgba(100, 44, 10, 0.6)
    // dpuru : Added below
    menu.style.webkitBorderRadius='10px 10px 10px 10px';
    menu.border='2px solid #3b49a8';
    menu.style.webkitBoxShadow=menu.style.boxShadow='10px 10px 19px -5px rgba(168,159,168,1)';
    menu.style.borderLeftColor=menu.style.borderRightColor='rgba(133,133,133,0.9)';

    menu.removeChild(menu.c23);
    delete menu.c23;
    menu.c200=menu_addoption('&#9733;','View details',menu_genomegraph_2,menu);

    menu.removeChild(menu.c16);
    menu.c16=menu_addoption('&#9432;','Information',menu_getExperimentInfo_2,menu);

    menu.removeChild(menu.c25);
    menu.c25=menu_addoption('&#10010','Add metadata terms',menu_mcm_invokemds,menu);

    menu.c203=menu_addoption(null,'View genome copies for <span id=cmo3_says></span>',menu_genomegraph_1,menu);
    menu.infowrapper=dom_create('div',menu);
    menu.tksort=menu_addoption(null,'Sort',sortcolumn_bytrack,menu);
    menu.linkholder=dom_create('div',menu);
    var d=dom_create('div',menu.linkholder);
    d.style.padding=8;
    d.style.lineHeight=1.5;
    d.innerHTML='Human reference genome version is hg19/GRCh37<br>'+
        '<a href=http://hgdownload.soe.ucsc.edu/goldenPath/hg19/bigZips/ target=_blank>UCSC Genome Browser</a> provides RepeatMasker annotation data<br>'+
        '<a href=http://genome.ucsc.edu/ENCODE/ target=_blank>ENCODE Project</a> provides transcription factor ChIP-Seq results<br>'+
        '<a href=http://www.roadmapepigenomics.org/ target=_blank>Roadmap Epigenomics Project</a> provides epigenomics assay results<br>'+
        '<a href=http://epigenomegateway.wustl.edu target=_blank style="text-decoration:none;background-color:#333;border-radius:4px;-moz-border-radius:4px;padding:2px 5px;"><br>'+
        washUtag+'</a> powers this service';

    menu.c201=menu_addoption(null,'Find a transposon subfamily',menu_showsearchui,menu);
    menu.c202=dom_create('div',menu);
    menu.c202.style.padding=8;
    menu.c202.innerHTML='<input type=text id=find_te_input value="enter transposon name" \
onkeyup="find_te_ku(event)" \
onfocus="if(this.value==\'enter transposon name\') this.value=\'\'" \
onblur="if(this.value.length==0) this.value=\'enter transposon name\';"> \
<button type=button onclick="find_te()">Find</button><br>\
<div id=find_te_msg style="display:none;margin:10px;padding:5px;background-color:#333;"></div>';

    pica.style.borderColor='#858585';
    pica.x=0; // .x is array index of col_runtime
    picasays.style.color='';

//daofeng added
    Browser.prototype.makeui_facet_panel = function(){};
//daofeng added end

    browser=new Browser();
    var d=document.getElementById('alethiometer');
    d.ismaintable=true;
    d.onmouseover=browser_table_mover;
    d.bbj=browser;

    /*** not calling browser_makeDoms
     **/
// dpuru : 07/08/2015 : Adding facet

    browser.browser_makeDoms({
        mcm:true,
        facet:true
    });

// -- *
    for(var i=0; i<mdlst_row.length; i++) {
        browser.mcm.lst.push([mdlst_row[i],0]);
    }
    browser.mcm.holder=document.getElementById('tkmcm_headerholder');
    browser.mcm.tkholder=document.getElementById('mcm_tkholder');
    browser.hmheaderdiv=document.getElementById('hmheaderdiv');
    browser.hmdiv=document.getElementById('hmdiv');
    browser.makeui_facet_panel();

    apps.gg.width=
        browser.hmSpan=
            browser.hmdiv.parentNode.style.width=
                colheader_holder.parentNode.style.width= document.body.clientWidth-browser.mcm.lst.length*tkAttrColumnwidth-rowlabelwidth-30;

//browser.hmdiv.parentNode.style.height=
    browser.mcm.tkholder.parentNode.style.height=
        browser.hmheaderdiv.parentNode.style.height= document.body.clientHeight-200;

// things to turn off
    browser.genesetview=null;

    /*** subfam attribute header
     ***/
    var holder=document.getElementById('temcm_headerholder');
    for(var i=0; i<temcm_attrlst.length; i++) {
        var c=document.createElement('canvas');
        c.width=rowlabelwidth;
        c.height=temcm_cellheight-2;
        c.className='tkattrnamevcanvas';
        c.style.display='block';
        c.addEventListener('click', temcm_click, false);
        c.idx=i;
        holder.appendChild(c);
        var ctx=c.getContext('2d');
        ctx.font='10px Sans-serif';
        ctx.fillStyle='black'; //dpuru : changed it from 'white'
        ctx.fillText(temcm_attrlst[i], rowlabelwidth-ctx.measureText(temcm_attrlst[i]).width, 8);
    }


    gflag.browser=browser;
    browser.init_genome_param={custom_track:true};

    pagemask();

    browser.ajax('loadgenome=on&dbName='+basedb+'&rpbrDbname='+infodb+'&rpbr_init=on',function(data){repeatbrowser_load(data);});
}
