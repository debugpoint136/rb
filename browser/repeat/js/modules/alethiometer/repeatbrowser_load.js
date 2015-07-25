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
    repeatbrowser_loadhub_recursive();
}