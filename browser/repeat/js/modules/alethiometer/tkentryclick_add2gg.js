/**
 * clicking a tkentry, add an experiment to gg
 */

function tkentryclick_add2gg(event)
{
    /* clicking a tkentry, add an experiment to gg
     */
    var vobj=apps.gg.view[gflag.add2go_key];
    var b=vobj.add_experiment_butt;
    b.disabled=true;
    b.innerHTML='&nbsp;&nbsp;&nbsp;Running...&nbsp;&nbsp;&nbsp;';
    // var tk=browser.findTrack(event.target.tkname);
    var tk=browser.findTrack(event.target.tkobj.name); // was tkname - was not working : dpuru : 07/01/2015

    if(tk.geoid==vobj.geoid) {
        shake_dom(menu);
        return;
    }
    menu_hide();
    var t=duplicateTkobj(tk);
    t.geoid=tk.geoid;
    vobj.tklst.push(t);
    /* request data from this experiment over this subfam
     a bit replicates menu_genomegraph_2
     */
    browser.ajax('repeatbrowser=on&getsubfamcopieswithtk=on'+subfamtrackparam(vobj.subfamid)+'&geo='+id2geo[tk.geoid].acc+'&viewkey='+gflag.add2go_key,function(data){
        var vobj=apps.gg.view[data.key];
        var b=vobj.add_experiment_butt;
        b.disabled=false;
        b.innerHTML='Add another experiment';

        var tkobj=vobj.tklst[vobj.tklst.length-1]; // shaky
        tkobj.bev={ismain:false};

        parseData_exp_bev(data,vobj,tkobj.bev);

        make_bevcolorscale(vobj,tkobj.bev,data.key);
        tkobj.bev.csbj.header.appendChild(make_geohandle(tkobj.geoid,'experiment'));
        s=dom_addtext(tkobj.bev.csbj.header,'delete');
        s.addEventListener('click',delete_bev_experiment,false);
        s.geoid=tkobj.geoid;
        s.vobj=vobj;
        s.bev=tkobj.bev;

        tkobj.bev.chr2canvas={};
        for(var chr in tkobj.bev.data) {
            var c=dom_create('canvas',vobj.bev.chr2holder[chr]);
            c.style.display='block';
            c.chrom=chr;
            c.key=data.key;
            tkobj.bev.chr2canvas[chr]=c;
            c.width=apps.gg.sf*browser.genome.scaffold.len[chr];
            c.height=apps.gg.chrbarheight;
            c.className='clb5';
            var ctx=c.getContext('2d');
            ctx.fillStyle='black';
            ctx.fillRect(0,0,c.width,c.height);
            c.addEventListener('mousemove', genomebev_tooltip_mousemove, false);
            c.addEventListener('mouseout', pica_hide, false);
            c.addEventListener('mousedown', genomebev_zoomin_md, false);
        }
        draw_genomebev_experiment(vobj,tkobj.bev);
    });
    /*over*/
}
