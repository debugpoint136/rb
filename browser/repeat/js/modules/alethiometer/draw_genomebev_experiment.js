/**
 * draw bev graph on which the TEs from a subfam is plotted , colored by experiment assay data
 * @param vobj
 * @param bev
 */

function draw_genomebev_experiment(vobj,bev)
{
    /* draw bev graph on which the TEs from a subfam is plotted
     colored by experiment assay data
     */
    var chr2xpos={};
    var basev=bev.csbj.baseline;
    var num=0;
    var clst=apps.gg.chrlst;
    for(var i=0; i<clst.length; i++) {
        var c=bev.chr2canvas[clst[i]];
        var ctx=c.getContext('2d');
        ctx.clearRect(0,0,c.width,c.height);
        var dd=bev.data[clst[i]];
        var xpos=[];
        for(var j=0; j<dd.length; j++) {
            // [ start, stop, strand, swscore ]
            var v=dd[j][(vobj.type==1?3:4)];
            var x=apps.gg.sf*dd[j][0];
            if(v<basev) {
                ctx.fillStyle='rgba(0,0,255,'+((basev-v)/(basev-bev.minv))+')';
            } else {
                num++;
                ctx.fillStyle='rgba(255,255,0,'+((v-basev)/(bev.maxv-basev))+')';
            }
            ctx.fillRect(x,0,1,c.height);
            xpos.push(x);
        }
        chr2xpos[clst[i]]=xpos;
    }
    bev.chr2xpos=chr2xpos;

// number of repeats beyond cutoff, only for main experiment
    if(bev.ismain) {
        vobj.colorscale.numAboveThreshold.innerHTML=num;
        var s=vobj.rank.beambutt;
        s.innerHTML='view in WashU Browser';
        s.className='clb4';
        s.addEventListener('click',beam_rankitem,false);
    }
    /*over*/
}