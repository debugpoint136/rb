/**
 * mouse over a chrom graph
 * @param event
 */

function genomebev_tooltip_mousemove(event)
{
// mouse over a chrom graph
    if(gflag.zoomin.inuse) {
        pica_hide();
        return;
    }
    var vobj=apps.gg.view[event.target.key];
    var pos=absolutePosition(event.target);
    pos[1]-=document.body.scrollTop;
    var x=event.clientX-pos[0];
    var chr=event.target.chrom;
    var lst=vobj.bev.chr2xpos[chr];
    var idlst=[];
    for(var i=0; i<lst.length; i++) {
        var d=Math.abs(lst[i]-x);
        if(Math.abs(lst[i]-x)<=1) {
            idlst.push(i);
        } else if(lst[i]>x+1) {
            break;
        }
    }
    if(idlst.length==0) {
        // no hit
        picasays.innerHTML = chr + ' ' + parseInt(x / apps.gg.sf);
        pica_go(event.clientX, pos[1]+apps.gg.chrbarheight);
    } else {
        var text=['<table><tr>'];
        for(var i=0; i<idlst.length; i++) {
            var t=vobj.bev.data[chr][idlst[i]];
            var tmp= '<table><tr><td class=tph>start</td><td>'+t[0]+'</td></tr>'+
                '<tr><td class=tph>stop</td><td>'+t[1]+'</td></tr>'+
                '<tr><td class=tph>length</td><td>'+(t[1]-t[0])+' bp</td></tr>'+
                '<tr><td class=tph>strand</td><td>'+t[2]+'</td></tr>'+
                '</table></td>';
            //'<tr><td class=tph>SW score</td><td>'+t[3]+'</td></tr></table></td>';
            if(vobj.type==1) {
                text.push('<td>'+tmp);
            } else {
                text.push('<td>'+htmltext_bigmapcell(t[4],vobj.bev.maxv,vobj.bev.minv)+'<br>'+tmp);
            }
        }
        picasays.innerHTML=text.join('')+'</tr></table>';
        pica_go(event.clientX, pos[1]+apps.gg.chrbarheight);
    }
}