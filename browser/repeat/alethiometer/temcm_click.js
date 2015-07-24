/**
 * Clicking on a repeat mcm header
 * @param {string} event - first attribute is length <br> rest is class, different sorting method!!
 */

function temcm_click(event) {
    /* clicking on a repeat mcm header
     first attribute is length
     rest is class, different sorting method!!
     */
    if(event.target.idx==0) {
        var len2id={};
        for(var i=0; i<col_runtime.length; i++) {
            var j=col_runtime[i];
            var L=id2subfam[j].genomelen;
            if(L in len2id)
                len2id[L].push(j);
            else
                len2id[L]=[j];
        }
        var numlst=[];
        for(var n in len2id) numlst.push(n);
        numlst.sort(numSort2);
        col_runtime=[];
        for(i=0; i<numlst.length; i++) {
            for(var j=0; j<len2id[numlst[i]].length; j++)
                col_runtime.push(len2id[numlst[i]][j]);
        }
        drawBigmap(false);
        return;
    }
    var hitlst=[], restlst=[];
    var hitclass=temcm_attrlst[event.target.idx];
    for(var i=0; i<col_runtime.length; i++) {
        var j=col_runtime[i];
        if(id2subfam[j].cls==hitclass)
            hitlst.push(j);
        else
            restlst.push(j);
    }
// group hitlst together
    var fam2id={};
    for(i=0; i<hitlst.length; i++) {
        var fam=id2subfam[hitlst[i]].fam;
        if(fam in fam2id)
            fam2id[fam].push(hitlst[i]);
        else
            fam2id[fam]=[hitlst[i]];
    }
    var newhitlst=[];
    for(var fam in fam2id)
        newhitlst=newhitlst.concat(fam2id[fam]);
    col_runtime=newhitlst.concat(restlst);
    drawBigmap(false);
}