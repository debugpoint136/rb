/**
 * Draws the big map
 * @param       {boolean} recordtkminmax - if true, means displaying data for all subfam, will compute min/max and record as .minv .maxv;
                                            if false, means displaying data for a subset of subfam, won't compute min/max
 */

function drawBigmap(recordtkminmax)
{

    stripChild(browser.mcm.tkholder,0);
    stripChild(browser.hmheaderdiv,0);
    stripChild(colheader_holder,0);
    stripChild(browser.hmdiv,0);


    for(var i=0; i<browser.tklst.length; i++) {
        var tk=browser.tklst[i];

        tk.canvas.width=col_runtime.length * cellwidth;
        tk.canvas.height=cellheight;
        browser.hmdiv.appendChild(tk.canvas);

        tk.header.width=rowlabelwidth;
        tk.header.height=cellheight;
        tk.header.alethiometer=true;
        var ctx=tk.header.getContext('2d');
        ctx.fillStyle='white';
        ctx.fillText(tk.label,5,cellheight);
        browser.hmheaderdiv.appendChild(tk.header);

        tk.atC.width=browser.mcm.lst.length*tkAttrColumnwidth;
        tk.atC.height=cellheight;
        browser.mcm.tkholder.appendChild(tk.atC);
    }

    colheader_holder.style.width=col_runtime.length*cellwidth;
    colheader_holder.style.height=
        colheader_holder.parentNode.style.height= temcm_attrlst.length*temcm_cellheight+subfamlabelheight;
    browser.mcm.tkholder.parentNode.style.width=browser.mcm.lst.length*tkAttrColumnwidth;
    browser.hmheaderdiv.parentNode.style.width=rowlabelwidth;


    /* temcm, prepare attribute data for each repeat subfam
     this is not part of the browser object
     */
    var ctxlst=[];
    for(var i=0; i<col_runtime.length; i++) {
        var c=document.createElement('canvas');
        c.width=cellwidth;
        c.height=subfamlabelheight+temcm_attrlst.length*temcm_cellheight;
        c.oncontextmenu=menu_temcm;
        colheader_holder.appendChild(c);
        var ctx= c.getContext('2d');
        ctxlst.push(ctx);
        // highlight need to be applied before any drawing
        if(highlight_subfamid!=null) {
            if(highlight_subfamid==col_runtime[i]) {
                // fill a faint red
                ctx.fillStyle='rgba(255,0,0,0.5)';
                ctx.fillRect(0,0,cellwidth,c.height);
            }
        }
        // draw a separating line
        ctx.fillStyle='#22223A';
        ctx.fillRect(0,cellwidth,1,c.height);
        // if enough width, draw name
        if(cellwidth>=10) {
            ctx.fillStyle='white';
            ctx.font='10px Sans-serif';
            ctx.rotate(Math.PI*1.5);
            ctx.fillText(id2subfam[col_runtime[i]].name, -c.height+2, 10);
            ctx.rotate(-Math.PI*1.5);
        }
    }

// first, draw total bp # color gradient
    var max=0;
    for(i=0; i<col_runtime.length; i++) max=Math.max(id2subfam[col_runtime[i]].genomelen,max); // get the longest sequence : e.g. max = 42905137
    for(i=0; i<col_runtime.length; i++) {
        ctxlst[i].fillStyle='rgba('+pr+','+pg+','+pb+','+id2subfam[col_runtime[i]].genomelen/max+')'; // longer the genome length - less transparentt it would
        ctxlst[i].fillRect(0,0,cellwidth,temcm_cellheight);
    }
// then, draw attributes in temcm
    for(i=1; i<temcm_attrlst.length; i++) {
        // must start from 1, 0 is total bp
        var attr2color=[];
        for(var j=0; j<col_runtime.length; j++) {
            var info=id2subfam[col_runtime[j]];
            if(info.cls==temcm_attrlst[i]) {
                // check color
                var color=null;
                for(var k=0; k<attr2color.length; k++) {
                    if(attr2color[k][0]==info.fam) {
                        color=attr2color[k][1];
                        break;
                    }
                }
                if(color==null) {
                    color= colorCentral.longlst[attr2color.length % (colorCentral.longlst.length-1)];
                    attr2color.push([info.fam, color]);
                }
                ctxlst[j].fillStyle=color;
                ctxlst[j].fillRect(0, i*temcm_cellheight, cellwidth, temcm_cellheight);
            }
        }
    }


// remaining, one row for a geo, as a track in browser.tklst
    for(i=0; i<browser.tklst.length; i++) {
        var tkobj=browser.tklst[i];

        ctx=tkobj.canvas.getContext('2d');
        // useRatioIdx = 0, useRatioIdx = 1 gets log odds Ratio
        var vlst=[];
        for(var j=0; j<col_runtime.length; j++) {
            var vv=tkobj.data[col_runtime[j]][useRatioIdx];

            if(apply_weight) vv*=id2subfam[col_runtime[j]].weight;

            vlst.push(vv);
        }
        var max=0, min=0;
        if(recordtkminmax) {
            // summarize max/min
            for(var j=0; j<vlst.length; j++) {
                var vv=vlst[j];
                if(vv>max) max=vv;
                else if(vv<min) min=vv;
            }
            tkobj.minv=min;
            tkobj.maxv=max;
        } else {
            max=tkobj.maxv;
            min=tkobj.minv;
        }
        /*
         * Greater than 0 = blue
         * Lesser than 0 = yellow
         */
        for(j=0; j<vlst.length; j++) {
            if(vlst[j]>0) {
                ctx.fillStyle='rgba('+pr+','+pg+','+pb+','+(vlst[j]/max)+')';
                ctx.fillRect(cellwidth*j, 0, cellwidth,cellheight);
            } else if(vlst[j]<0) {
                ctx.fillStyle='rgba('+nr+','+ng+','+nb+','+(vlst[j]/min)+')';
                ctx.fillRect(cellwidth*j, 0, cellwidth,cellheight);
            }
        }
    }
    browser.prepareMcm();
    browser.drawMcm(false);
}