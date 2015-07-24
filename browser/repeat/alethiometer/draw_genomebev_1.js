/**
 * show genome location of one subfam
 * @param key
 */

function draw_genomebev_1(key)
{
// show genome location of one subfam
    var clst=apps.gg.chrlst;
    var vobj=apps.gg.view[key];
    var chr2xpos={};
    for(var i=0; i<clst.length; i++) {
        var c=vobj.bev.chr2canvas[clst[i]];
        var ctx=c.getContext('2d');
        ctx.clearRect(0,0,c.width,c.height);
        var dd=vobj.bev.data[clst[i]];
        var xpos=[];
        for(var j=0; j<dd.length; j++) {
            // [ start, stop, strand ]
            var x=apps.gg.sf*dd[j][0];
            ctx.fillStyle='white';
            ctx.fillRect(x,0,1,c.height);
            xpos.push(x);
        }
        chr2xpos[clst[i]]=xpos;
    }
    vobj.bev.chr2xpos=chr2xpos;
}