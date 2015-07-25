/**
 *
 */

function repeatbrowser_load(data)
{
    if(!data) {
        alert('Failed to init browser: server error!');
        return;
    }
    browser.genome=new Genome(browser.init_genome_param);
    browser.genome.name=basedb;
    browser.genome.jsonGenome(data);
    var s=browser.genome.scaffold;
    browser.genome.border={lname:s.current[0],
        lpos:0,
        rname:s.current[s.current.length-1],
        rpos:s.len[s.current[s.current.length-1]]};

// must manually init facet
    /*
     browser.makeui_facet_panel();
     browser.facetlst=[];
     browser.facet.main.tab_td.style.display='none'; //dpuru - salvaging from tmp1
     */

    browser.migratedatafromgenome();

    var lst=browser.genome.scaffold.current;
    apps.gg.chrlst=[];
// exclude chrM??
    for(var i=0; i<lst.length; i++) {
        if(lst[i]!='chrM') apps.gg.chrlst.push(lst[i]);
    }
    lst=apps.gg.chrlst;
    var maxlen=0;
    for(i=0; i<lst.length; i++) {
        maxlen=Math.max(browser.genome.scaffold.len[lst[i]],maxlen);
    }
    apps.gg.sf=apps.gg.width/maxlen;

    /* all the TE subfam */
    for(var i=0; i<data.subfam.length; i++) {
        var v=data.subfam[i];
        subfam2id[v[0]]=v[1];
        id2subfam[v[1]]={
            name:v[0],
            genomelen:v[2],
            fam:v[3],
            cls:v[4],
            consensuslen:v[5],
            copycount:v[6]
        };
        col_runtime.push(v[1]);
        col_runtime_all.push(v[1]);
    }
// calculate weight
    var maxbp=0;
    for(i in id2subfam) {
        maxbp=Math.max(id2subfam[i].genomelen,maxbp);
    }
    for(i in id2subfam) {
        id2subfam[i].weight=id2subfam[i].genomelen/maxbp;
    }

    /* entire set of geo */
    for(i=0; i<data.geo.length; i++) {
        var v=data.geo[i];
        // geo, id, label, treatFiles, inputFiles
        geo2id[v[0]]=v[1];
        id2geo[v[1]]={
            acc:v[0],
            label:v[2],
            treatment:v[3].split(','),
            input:(v[4].length==0?null:v[4].split(','))
        };
    }

    // -- * test code : dpuru : 07/25/2015 : try to inject user choice to select public hubs here
    cloakPage();
    // gflag.browser=this;
    var d=dom_create('div',document.body,'position:absolute;z-index:100;');
    gflag.askabouttrack=d;
    dom_create('div',d,'color:white;font-size:150%;padding-bottom:20px;text-align:center;').innerHTML=
        'The "'+browser.genome.name+'" genome has been loaded.<br><br>'+
        'Would you like to go to ...';
    /*	dom_create('div',d,'display:inline-block;margin-right:20px;',{c:'whitebar',
     t:'<span style="font-size:140%">C</span>USTOM tracks',
     clc:toggle7_2});*/
    if(browser.genome.publichub.lst.length>0) {
        dom_create('div',d,'display:inline-block;margin-right:20px;',{c:'whitebar',t:'<span style="font-size:140%">P</span>UBLIC hubs <span style="font-size:80%">(30 available)</span>',clc:toggle8_2});
    }
    dom_create('div',d,'display:inline-block;',{c:'whitebar',t:'<span style="font-size:140%">G</span>ENOME browser &#187;',clc:toggle9});
    panelFadein(d,window.innerWidth/2-270,window.innerHeight/2-100);
// -- *
    repeatbrowser_loadhub_recursive();
}