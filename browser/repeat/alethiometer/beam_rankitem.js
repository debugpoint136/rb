/**
 * Rank plot
 * @param event
 */

function beam_rankitem(event)
{
    /* called by pressing <span>, executes once for each rank view
     */
    var butt=event.target;
    var v=apps.gg.view[butt.key];

    var n=parseInt(v.colorscale.numAboveThreshold.innerHTML);
    if(!butt.sukngsv) {
        // print coord of all items
        var d=window.open().document;
        for(var i=0; i<n; i++) {
            var t = v.rank.rarr[i];
            var j=v.bev.data[t[0]][t[1]];
            d.write(t[0]+':'+j[0]+'-'+j[1]+'<br>');
        }
        return;
    }

    var gi=id2geo[v.geoid];
    var si=id2subfam[v.subfamid];
    var subfamfile=si.cls+si.fam+si.name;


    butt.removeEventListener('click',beam_rankitem,false);
    butt.className='';
    butt.innerHTML='processing...';

    var jlst=[];
    var wlst=[];
    for(i=0; i<gi.treatment.length; i++) {
        var fn=gi.treatment[i];
        jlst.push({type:'bedgraph',
            name:(gi.input==null?'track '+(i+1):'treatment '+(i+1)),
            url:url_genomebedgraph+fn+'.gz',
            qtc:qtc_treat_u,
            mode:'show'});
    }
    if(gi.input!=null) {
        for(i=0; i<gi.input.length; i++) {
            var fn=gi.input[i];
            jlst.push({type:'bedgraph',
                name:'input '+(i+1),
                url:url_genomebedgraph+fn+'.gz',
                qtc:qtc_input_u,
                mode:'show'});
        }
    }
    jlst.push({type:'bed',name:si.name,url:url_subfambed+subfamfile+'.gz',mode:'full'});
    jlst.push({type:'native_track',list:[{name:'refGene',mode:'full'}]});

    var lastTEid=Math.min(299,n-1);
//var flankbp=parseInt(v.rank.flankSelect.options[v.rank.flankSelect.selectedIndex].value);
    var flankbp=5000;
    var itemlst=[];
    for(var i=0; i<=lastTEid; i++) {
        var t = v.rank.rarr[i];
        var j=v.bev.data[t[0]][t[1]];
        itemlst.push({c:t[0],
            a:j[0],a1:j[0],
            b:j[1],b1:j[1],
            isgene:false,
            name:t[0]+':'+j[0]+'-'+j[1],
            strand:j[2],
        });
    }
    var gsobj={lst:itemlst,gss_down:flankbp,gss_up:flankbp,gss_opt:'custom',gss_origin:'genebody'};
    browser.genome.gsm_setcoord_gss(gsobj);
    var _t=itemlst[10];
    jlst.push({ type:'run_genesetview', list:gsobj.lst,viewrange:[itemlst[0].name,itemlst[0].a,_t.name,_t.b]});
    ajaxPost('json\n'+JSON.stringify(jlst),function(key){
        v.rank.beambutt.innerHTML='<a href='+url_base+'?genome='+browser.genome.name+
            '&datahub_jsonfile='+url_base+'t/'+key+' target=_blank>Click to view ranked list &#8599;</a>';
    });
}
