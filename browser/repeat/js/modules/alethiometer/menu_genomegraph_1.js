/**
 * From menu option, render graph for a given context
 */

function menu_genomegraph_1()
{
    /* from menu option, render graph for a given context
     */
    menu_hide();
    for(var key in apps.gg.view) {
        var v=apps.gg.view[key];
        if(v.type==1 && v.subfamid==gflag.menu.subfamid) {
            view_gg(key);
            return;
        }
    }
// only draw copies
    gflag.subfamid=gflag.menu.subfamid;
    cloakPage();
    browser.ajax('repeatbrowser=on&getsubfamcopiesonly=on'+subfamtrackparam(gflag.subfamid),function(data){
        var chr2data={};
        var lst=apps.gg.chrlst;
        for(var i=0; i<lst.length; i++)
            chr2data[lst[i]]=[];
        //var min=0, max=0;
        for(i=0; i<data.genomecopies.length; i++) {
            var x=data.genomecopies[i];
            chr2data[x[0]].push([x[1],x[2],x[3]]);
            /* smith-waterman score
             var sw=x[4];
             if(sw>max) max=sw;
             else if(sw<min) min=sw;
             */
        }
        var sid=gflag.subfamid;
        var vobj={
            type:1,
            subfamid:sid,
            bev:{ data:chr2data, // minv:min, maxv:max, scoreType:'SW score'
            },
        };
        // make ui
        var key=init_newgg(vobj);

        dom_addtext(vobj.header,'Showing '+id2subfam[sid].copycount+' copies of&nbsp;&nbsp;');
        vobj.header.appendChild(make_subfamhandle(sid));

        vobj.bev.holder=vobj.content;
        make_genomebev_base(vobj,key);
        draw_genomebev_1(key);
        view_gg(key);
        panelFadein(apps.gg.main,50,20);
        document.getElementById('viewlstbutt').style.display='inline';
        var c=document.getElementById('viewcount');
        c.innerHTML=parseInt(c.innerHTML)+1;
    });
}