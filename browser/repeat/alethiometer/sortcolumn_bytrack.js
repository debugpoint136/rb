/**
 * sortcolumn_bytrack - called by menu option , sort columns using data from a track
 */

function sortcolumn_bytrack()
{
    /* called by menu option
     sort columns using data from a track
     */
    var data=gflag.menu.tklst[0].data;
    var hash={};
    for(var i=0; i<col_runtime.length; i++) {
        var v=data[col_runtime[i]][useRatioIdx];
        if(v in hash)
            hash[v].push(col_runtime[i]);
        else
            hash[v]=[col_runtime[i]];
    }
    var lst=[];
    for(var v in hash) lst.push(v);
    lst.sort(function(a,b){return b-a});
    col_runtime=[];
    for(var i=0; i<lst.length; i++) {
        for(var j=0; j<hash[lst[i]].length; j++)
            col_runtime.push(hash[lst[i]][j]);
    }
    menu_hide();
    drawBigmap(false);
}