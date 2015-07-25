/**
 * @param v
 * @param max
 * @param min
 */

function htmltext_bigmapcell(v,max,min) {
    return '<div class=squarecell style="display:inline-block;background-color:'+
        ((v>0)?'rgba('+pr+','+pg+','+pb+','+(v/max)+');':'rgba('+nr+','+ng+','+nb+','+(v/min)+');')+
        '"> </div> '+v.toFixed(3);
}