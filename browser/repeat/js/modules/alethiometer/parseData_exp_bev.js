/**
 * @param data
 * @param vobj
 * @param bev
 */

function parseData_exp_bev(data,vobj,bev)
{
    var chr2data={};
    var lst=apps.gg.chrlst;
    for(var i=0; i<lst.length; i++)
        chr2data[lst[i]]=[];
    /* genomecopies: raw string from cgi forking
     parse it into fields
     */
    var Data=[];
    for(i=0; i<data.genomecopies.length; i++) {
        var lst=data.genomecopies[i].split(' ');
        var s=lst[5].split(',');
        var ts=[];
        // need to skip the last comma
        for(var j=0; j<s.length-1; j++) ts.push(parseFloat(s[j]));
        var is=[];
        if(vobj.has_input) {
            s=lst[6].split(',');
            for(j=0; j<s.length-1; j++) is.push(parseFloat(s[j]));
        }
        Data.push([lst[0],parseInt(lst[1]),parseInt(lst[2]), lst[3], parseInt(lst[4]), ts, is]);
        /* 0 chrom
         1 start
         2 stop
         3 strand
         4 bed item id
         5 [] treat score
         6 [] input score, could be empty
         */
    }
    /* figure out *baseline* value for both treatment and input in computing ratio,
     (not the baseline for color scale)
     any value lower than baseline will be replaced by baseline
     */
    var treatValueLst=[];
    var inputValueLst=[];
    var mean_t=0; // mean of treatment
    var mean_i=0; // mean of input
    var count=0; // divisor
    for(i=0; i<Data.length; i++) {
        var x=Data[i];
        count++;
        { // treat
            var s=0;
            for(var j=0; j<x[5].length; j++) s+=x[5][j];
            var v=s/j;
            treatValueLst.push(v);
            mean_t+=v;
        }
        if(vobj.has_input) {
            // input
            var s=0;
            for(var j=0; j<x[6].length; j++) s+=x[6][j];
            var v=s/j;
            inputValueLst.push(v);
            mean_i+=v;
        }
    }
    mean_t/=count;
    mean_i/=count;
    /* important change here
     if actual value is lower than mean_t/_i, replace with 1
     so that their log ratio can be 0
     */
    for(i=0; i<treatValueLst.length; i++) {
        var v=treatValueLst[i];
        treatValueLst[i]=v<mean_t?1:v;
    }
    if(vobj.has_input) {
        for(i=0; i<inputValueLst.length; i++) {
            var v=inputValueLst[i];
            inputValueLst[i]=v<mean_i?1:v;
        }
    }
    /* compute ratio for each individual repeat
     */
    var minv=0, maxv=0;
    for(i=0; i<Data.length; i++) {
        var x=Data[i];
        var v=treatValueLst[i];
        if(vobj.has_input) {
            v=Math.log(v/inputValueLst[i])/Math.log(2);
        }
        if(v>maxv) maxv=v;
        else if(v<minv) minv=v;
        chr2data[x[0]].push([x[1],x[2],x[3],x[4],v]);
        /*
         0 start
         1 stop
         2 strand
         3 bed item id
         4 log ratio
         */
    }
    /* !! this array must be sorted by chromosomal order
     or tooltipping won't work
     */
    for(var c in chr2data)
        chr2data[c].sort(coordSort);
    bev.data=chr2data;
    bev.minv=minv;
    bev.maxv=maxv;
}
