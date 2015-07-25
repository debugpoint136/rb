/**
 * view an experiment over a subfam
 */

function menu_genomegraph_2()
{
    /* view an experiment over a subfam
     */
    menu_hide();
    for(var key in apps.gg.view) {
        var v=apps.gg.view[key];
        if(v.type==2 && v.geoid==gflag.menu.geoid && v.subfamid==gflag.menu.subfamid) {
            view_gg(key);
            return;
        }
    }
    var geoinfo=id2geo[gflag.menu.geoid];
    var sfinfo=id2subfam[gflag.menu.subfamid];
    var has_consensus=sfinfo.consensuslen>0;
// TODO check if this view has been made

    /* generate this view */
    var viewobj={
        type:2,
        subfamid:gflag.menu.subfamid,
        geoid:gflag.menu.geoid,
        tabs:{info:[],cons:[],bev:[],rank:[]},
        bev:{},
        rank:{},
        has_input:geoinfo.input!=null,
        tklst:[],
    };
    var key=init_newgg(viewobj);

    viewobj.header.appendChild(make_geohandle(gflag.menu.geoid));
    dom_addtext(viewobj.header,'&nbsp;&nbsp;over&nbsp;&nbsp;');
    viewobj.header.appendChild(make_subfamhandle(gflag.menu.subfamid));

    /*******
     tab headers
     **/
    var b=dom_addbutt(viewobj.header,'Description',tab_click);
    b.which=1;
    b.key=key;
    b.style.marginLeft=20;
    b.disabled=true;
    viewobj.tabs.info[0]=b;
    if(has_consensus) {
        b=dom_addbutt(viewobj.header,'Loading...',tab_click);
        b.which=2;
        b.key=key;
        viewobj.tabs.cons[0]=b;
    } else {
        viewobj.tabs.cons=[document.createElement('button'),document.createElement('div')];
    }
// bev
    b=dom_addbutt(viewobj.header,'Loading...',tab_click);
    b.key=key;
    b.which=3;
    viewobj.tabs.bev[0]=b;

    /**********
     first section: geo/tk info, consensus wiggle plot
     */
    var table=dom_create('table',viewobj.content);
    viewobj.tabs.info[1]=table;
// row 1
    var tr=table.insertRow(0);
    var td=tr.insertCell(0);
    td.className='tph';
    td.innerHTML='Experiment';
    tr.insertCell(1).appendChild(make_geohandle(gflag.menu.geoid));
// row 2
    tr=table.insertRow(-1);
    td=tr.insertCell(0);
    td.className='tph';
    td.innerHTML=viewobj.has_input==null?'Data files':'Treatment data files';
    td=tr.insertCell(1);
    for(var i=0; i<geoinfo.treatment.length; i++) {
        td.appendChild(make_filehandle(geoinfo.treatment[i], viewobj.has_input?'treatment':'file',geoinfo.treatment.length,i));
    }
// row 2.5
    if(viewobj.has_input) {
        tr=table.insertRow(-1);
        td=tr.insertCell(0);
        td.className='tph';
        td.innerHTML='Input/Control data files';
        td=tr.insertCell(1);
        for(var i=0; i<geoinfo.input.length; i++) {
            td.appendChild(make_filehandle(geoinfo.input[i], 'input', geoinfo.input.length,i));
        }
    }
// row 3
    tr=table.insertRow(-1);
    td=tr.insertCell(0);
    td.className='tph';
    td.innerHTML='Log ratio of average score';
    tr.insertCell(1).innerHTML=gflag.menu.pointdata[0]+' <span style="font-size:10px;">iteres</span><br>'+gflag.menu.pointdata[1]+' <span style="font-size:10px;">BWA</span>';
// row 4
    tr=table.insertRow(-1);
    td=tr.insertCell(0);
    td.className='tph';
    td.innerHTML='Repeat subfamily';
    tr.insertCell(1).appendChild(make_subfamhandle(viewobj.subfamid));

    /*******
     second section, consensus plot
     TODO draw for all subfams
     */
    if(sfinfo.consensuslen>0) {
        var d=dom_create('div',viewobj.content);
        d.style.display='none';
        viewobj.tabs.cons[1]=d;
        var d2=document.createElement('div');
        d.appendChild(d2);
        if(viewobj.has_input) {
            var s=document.createElement('span');
            s.innerHTML='Treatment read count&nbsp;';
            d2.appendChild(s);
            s=document.createElement('span');
            s.style.backgroundColor='rgb('+qtc_treat_a.pr+','+qtc_treat_a.pg+','+qtc_treat_a.pb+')';
            s.style.color='black';
            s.innerHTML='&nbsp;iteres&nbsp;';
            d2.appendChild(s);
            s=document.createElement('span');
            s.style.backgroundColor='rgb('+qtc_treat_u.pr+','+qtc_treat_u.pg+','+qtc_treat_u.pb+')';
            s.style.color='black';
            s.innerHTML='&nbsp;BWA&nbsp;';
            d2.appendChild(s);
            s=document.createElement('span');
            s.innerHTML='&nbsp;&nbsp;Input read count&nbsp;';
            d2.appendChild(s);
            s=document.createElement('span');
            s.style.backgroundColor='rgb('+qtc_input_a.pr+','+qtc_input_a.pg+','+qtc_input_a.pb+')';
            s.style.color='black';
            s.innerHTML='&nbsp;iteres&nbsp;';
            d2.appendChild(s);
            s=document.createElement('span');
            s.style.backgroundColor='rgb('+qtc_input_u.pr+','+qtc_input_u.pg+','+qtc_input_u.pb+')';
            s.style.color='black';
            s.innerHTML='&nbsp;BWA&nbsp;';
            d2.appendChild(s);
        } else {
            var s=document.createElement('span');
            s.innerHTML='All aligned reads by iteres&nbsp;';
            d2.appendChild(s);
            s=document.createElement('span');
            s.style.backgroundColor='rgb('+qtc_treat_a.pr+','+qtc_treat_a.pg+','+qtc_treat_a.pb+')';
            s.style.color='black';
            s.innerHTML='&nbsp;&nbsp;&nbsp;&nbsp;';
            d2.appendChild(s);
            s=document.createElement('span');
            s.innerHTML='Uniquely aligned reads by BWA&nbsp;';
            d2.appendChild(s);
            s=document.createElement('span');
            s.style.backgroundColor='rgb('+qtc_treat_u.pr+','+qtc_treat_u.pg+','+qtc_treat_u.pb+')';
            s.style.color='black';
            s.innerHTML='&nbsp;&nbsp;&nbsp;&nbsp;';
            d2.appendChild(s);
        }
        var s=document.createElement('span');
        s.innerHTML='&#10092;ALL&#10093;';
        s.className='clb4';
        s.style.display='none';
        s.style.marginLeft=50;
        s.key=key;
        s.addEventListener('click', consensusPlot_showall, false);
        viewobj.consensusplot={
            allbutt:s,
            scrollable:[],
            preset_left:0,
            tk2canvas:{},
        };
        d2.appendChild(s);

        d2=document.createElement('div');
        d.appendChild(d2);
        viewobj.consensuswigglediv=d2;
        browser.ajax('repeatbrowser=on&getconsensuswig=on&rpbrDbname='+infodb+'&geo='+geoinfo.acc+'&subfam='+sfinfo.name+'&viewkey='+key,function(data){
            /* construct canvas and scroll holders
             */
            var vobj=apps.gg.view[data.key];
            var holder=vobj.consensuswigglediv;
            var cplot=vobj.consensusplot;

            var conlen=id2subfam[vobj.subfamid].consensuslen;
            cplot.holderwidth=800;
            cplot.sf=cplot.holderwidth/conlen; // px per bp

            var table=document.createElement('table');
            table.style.marginTop=20;
            holder.appendChild(table);

            /* bp ruler */
            var tr=table.insertRow(0);
            tr.insertCell(0);
            var td=tr.insertCell(1);
            var div=document.createElement('div');
            div.className='scholder';
            div.style.width=cplot.holderwidth;
            td.appendChild(div);
            var c=document.createElement('canvas');
            c.key=data.key;
            c.className='sclb';
            c.height=div.style.height=15; // hard coded?
            c.addEventListener('mousedown',consensusPlot_ruler_md,false);
            div.appendChild(c);
            cplot.scrollable.push(c);
            cplot.rulercanvas=c;

            /* get max/min from assay tracks */
            var max=0, min=0;
            var tmp=wiggle_maxmin(data.treatment_all);
            if(max<tmp[0]) max=tmp[0];
            if(min>tmp[1]) min=tmp[1];
            tmp=wiggle_maxmin(data.treatment_unique);
            if(max<tmp[0]) max=tmp[0];
            if(min>tmp[1]) min=tmp[1];
            if(vobj.has_input) {
                tmp=wiggle_maxmin(data.input_all);
                if(max<tmp[0]) max=tmp[0];
                if(min>tmp[1]) min=tmp[1];
                tmp=wiggle_maxmin(data.input_unique);
                if(max<tmp[0]) max=tmp[0];
                if(min>tmp[1]) min=tmp[1];
            }
            cplot.assayMax=max;
            cplot.assayMin=min;

            /* wiggle treat-all */
            for(var i=0; i<data.treatment_all.length; i++) {
                var dd=data.treatment_all[i];
                var tr=table.insertRow(-1);
                var td=tr.insertCell(0);
                td.align='right';
                td.vAlign='middle';
                td.appendChild(make_filehandle(dd[0], vobj.has_input?'treatment':'file', id2geo[vobj.geoid].treatment.length, i));

                td=tr.insertCell(1);
                div=document.createElement('div');
                div.className='scholder';
                div.style.width=cplot.holderwidth;
                td.appendChild(div);

                var c=document.createElement('canvas');
                c.className='sclb';
                c.key=data.key;
                c.addEventListener('mousedown', consensusPlot_md,false);
                div.appendChild(c);
                c.height=div.style.height=wiggleheight+densitydecorpaddingtop;
                cplot.tk2canvas[dd[0]]=c;
                cplot.scrollable.push(c);
            }
            cplot.treatment_all=data.treatment_all;
            cplot.treatment_unique=data.treatment_unique;

            if(vobj.has_input) {
                // plot input-all
                for(i=0; i<data.input_all.length; i++) {
                    var dd=data.input_all[i];
                    var tr=table.insertRow(-1);
                    var td=tr.insertCell(0);
                    td.align='right';
                    td.vAlign='middle';
                    td.appendChild(make_filehandle(dd[0], 'input', id2geo[vobj.geoid].input.length, i));
                    td=tr.insertCell(1);
                    div=document.createElement('div');
                    div.className='scholder';
                    div.style.width=cplot.holderwidth;
                    td.appendChild(div);

                    var c=document.createElement('canvas');
                    c.className='sclb';
                    c.key=data.key;
                    c.addEventListener('mousedown', consensusPlot_md,false);
                    div.appendChild(c);
                    c.height=div.style.height=wiggleheight+densitydecorpaddingtop;
                    cplot.tk2canvas[dd[0]]=c;
                    cplot.scrollable.push(c);
                }
                cplot.input_all=data.input_all;
                cplot.input_unique=data.input_unique;
            }

            /* density wiggle */
            var dmax=0;
            for(i=0; i<data.density.length; i++) {
                var v=data.density[i];
                if(dmax<v) dmax=v;
            }
            cplot.densityMax=dmax;
            cplot.densitydata=data.density;

            tr=table.insertRow(-1);
            td=tr.insertCell(0);
            td.align='center';
            td.vAlign='middle';
            td.innerHTML='TE coverage';
            td=tr.insertCell(1);
            div=document.createElement('div');
            div.className='scholder';
            div.style.width=cplot.holderwidth;
            td.appendChild(div);
            c=document.createElement('canvas');
            c.className='sclb';
            c.key=data.key;
            c.addEventListener('mousedown', consensusPlot_md,false);
            div.appendChild(c);
            c.height=div.style.height=wiggleheight+densitydecorpaddingtop;
            cplot.scrollable.push(c);
            cplot.densitycanvas=c;

            /* sequence */
            if('consensusseq' in data) {
                cplot.sequence=data.consensusseq;
                tr=table.insertRow(-1);
                td=tr.insertCell(0);
                td.align='center';
                td.vAlign='middle';
                td.style.fontWeight='bold';
                td.innerHTML= '<span style="color:'+ntbcolor.a+'">A</span>'+
                    '<span style="color:'+ntbcolor.t+'">T</span>'+
                    '<span style="color:'+ntbcolor.c+'">C</span>'+
                    '<span style="color:'+ntbcolor.g+'">G</span>'+
                    '<span style="color:'+ntbcolor.n+'">N</span>';
                td=tr.insertCell(1);
                div=document.createElement('div');
                div.className='scholder';
                div.style.width=cplot.holderwidth;
                td.appendChild(div);
                c=document.createElement('canvas');
                c.className='sclb';
                c.key=data.key;
                c.addEventListener('mousedown', consensusPlot_md,false);
                div.appendChild(c);
                c.height=div.style.height=ideoHeight;
                cplot.scrollable.push(c);
                cplot.seqcanvas=c;
            }

            vobj.tabs.cons[0].innerHTML='Consensus';

            draw_consensusPlot(data.key);
        });
    }

    /********************
     third section, bev
     */
    var d=dom_create('div',viewobj.content);
    d.style.display='none';
    viewobj.tabs.bev[1]=d;
    viewobj.bev.holder=d;
    viewobj.bev.scoreType=viewobj.has_input?'Log ratio':'Track score';
    viewobj.bev.ismain=true;
    viewobj.colorscale={};
// this part is duplicated in tkentryclick_add2gg
    browser.ajax('repeatbrowser=on&getsubfamcopieswithtk=on'+subfamtrackparam(viewobj.subfamid)+'&geo='+geoinfo.acc+'&viewkey='+key,function(data){
        var vobj=apps.gg.view[data.key];
        make_genomebev_base(vobj,data.key);

        parseData_exp_bev(data,vobj,vobj.bev);

        make_bevcolorscale(vobj,vobj.bev,data.key);

        draw_genomebev_experiment(vobj,vobj.bev);

        vobj.tabs.bev[0].innerHTML='Genome';

        /* rank the repeats by assay value
         */
        var tosort=[];
        for(var chr in vobj.bev.data) {
            var lst=vobj.bev.data[chr];
            for(i=0; i<lst.length; i++)
                tosort.push([chr, i, lst[i][4]]);
            /* 0: chr, 1: in-chr array idx, 2: data
             */
        }
        tosort.sort(scoreSort);
        var _r=vobj.rank;
        _r.rarr=tosort;

    });

    simulateEvent(viewobj.tabs.info[0],'click');

    view_gg(key);
    cloakPage();
    panelFadein(apps.gg.main,50,20);
    document.getElementById('viewlstbutt').style.display='inline';
    var c=document.getElementById('viewcount');
    c.innerHTML=parseInt(c.innerHTML)+1;
    /* over, geo+subfam */
}