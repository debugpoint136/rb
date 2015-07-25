/**
 * called by initializing consensusPlot, and zooming <br> but not by panning, won't redraw graph
 * @param key
 */

function draw_consensusPlot(key)
{
    /* called by initializing consensusPlot, and zooming
     but not by panning, won't redraw graph
     need to set width to all scrollables
     */
    var vobj=apps.gg.view[key];
    var cp=vobj.consensusplot;

    var pxwidth=Math.ceil(cp.sf*id2subfam[vobj.subfamid].consensuslen);
    for(var i=0; i<cp.scrollable.length; i++) {
        cp.scrollable[i].width=pxwidth;
        cp.scrollable[i].style.left=cp.preset_left;
    }

    var ctx=cp.rulercanvas.getContext('2d');
    plot_ruler({horizontal:true,yoffset:0,ctx:ctx,color:'#858585',start:0,stop:cp.rulercanvas.width-1,
        min:0,max:id2subfam[vobj.subfamid].consensuslen});

    var canvaslst=[];
    for(var i=0; i<cp.treatment_all.length; i++) {
        var dd=cp.treatment_all[i];
        var canvas=cp.tk2canvas[dd[0]];
        var ctx=canvas.getContext('2d');
        canvaslst.push([canvas,ctx]);
        if(cp.assayMax == 0 && cp.assayMin == 0){
            // create a notice if there is no data - dpuru : 06/29/2015
            ctx.fillStyle = "rgb(158, 151, 142)";
            ctx.fillText("No signal detected in this assay for this TE consensus", 200, 25);
        } else {
            barplot_base(dd[1],
                0, dd[1].length,
                ctx,
                {
                    p: 'rgb(' + qtc_treat_a.pr + ',' + qtc_treat_a.pg + ',' + qtc_treat_a.pb + ')',
                    n: 'rgb(' + qtc_treat_a.pr + ',' + qtc_treat_a.pg + ',' + qtc_treat_a.pb + ')'
                },
                cp.assayMax, cp.assayMin,
                0, densitydecorpaddingtop,
                cp.sf, wiggleheight, true, false);
        }
    }

    /* overlay treat-unique */
    for(i=0; i<cp.treatment_unique.length; i++) {
        var dd=cp.treatment_unique[i];
        barplot_base(dd[1],
            0, dd[1].length,
            canvaslst[i][1],
            {p:'rgb('+qtc_treat_u.pr+','+qtc_treat_u.pg+','+qtc_treat_u.pb+')',
                n:'rgb('+qtc_treat_u.pr+','+qtc_treat_u.pg+','+qtc_treat_u.pb+')'},
            cp.assayMax,cp.assayMin,0,densitydecorpaddingtop,
            cp.sf,wiggleheight,true,false);
        plot_ruler({ctx:canvaslst[i][0].getContext('2d'),
            stop:densitydecorpaddingtop,
            start:canvaslst[i][0].height-1,
            xoffset:canvaslst[i][0].width-1,
            horizontal:false,
            color:colorCentral.foreground,
            min:cp.assayMin,
            max:cp.assayMax,
            extremeonly:true,
            max_offset:-4,
        });
    }

    if(id2geo[vobj.geoid].input!=null) {
        canvaslst=[];
        for(i=0; i<cp.input_all.length; i++) {
            var dd = cp.input_all[i];
            var canvas = cp.tk2canvas[dd[0]];
            var ctx = canvas.getContext('2d');
            canvaslst.push([canvas, ctx]);
            if (cp.assayMax == 0 && cp.assayMin == 0) {
                // create a notice if there is no data - dpuru : 06/29/2015
                ctx.fillStyle = "rgb(158, 151, 142)";
                ctx.fillText("No signal detected in this assay for this TE consensus", 200, 25);
            } else {
                barplot_base(dd[1],
                    0, dd[1].length,
                    ctx,
                    {
                        p: 'rgb(' + qtc_input_a.pr + ',' + qtc_input_a.pg + ',' + qtc_input_a.pb + ')',
                        n: 'rgb(' + qtc_input_a.pr + ',' + qtc_input_a.pg + ',' + qtc_input_a.pb + ')'
                    },
                    cp.assayMax, cp.assayMin,
                    0, densitydecorpaddingtop,
                    cp.sf, wiggleheight, true, false)
            }
        }
        // overlay input-unique
        for(i=0; i<cp.input_unique.length; i++) {
            var dd=cp.input_unique[i];
            barplot_base(dd[1],
                0,dd[1].length,
                canvaslst[i][1],
                {p:'rgb('+qtc_input_u.pr+','+qtc_input_u.pg+','+qtc_input_u.pb+')',
                    n:'rgb('+qtc_input_u.pr+','+qtc_input_u.pg+','+qtc_input_u.pb+')'},
                cp.assayMax,cp.assayMin,0,densitydecorpaddingtop,
                cp.sf,wiggleheight,true,false);
            plot_ruler({ctx:canvaslst[i][0].getContext('2d'),
                stop:densitydecorpaddingtop,
                start:canvaslst[i][0].height-1,
                xoffset:canvaslst[i][0].width-1,
                horizontal:false,
                color:colorCentral.foreground,
                min:cp.assayMin,
                max:cp.assayMax,
                extremeonly:true,
                max_offset:-4,
            });
        }
    }

    /* density */
    ctx=cp.densitycanvas.getContext('2d');
    barplot_base(cp.densitydata,0,cp.densitydata.length,
        ctx,
        {p:'rgb('+qtc_density.pr+','+qtc_density.pg+','+qtc_density.pb+')', },
        cp.densityMax,0,0,densitydecorpaddingtop,
        cp.sf,wiggleheight,true,false);
    plot_ruler({ctx:cp.densitycanvas.getContext('2d'),
        stop:densitydecorpaddingtop,
        start:cp.densitycanvas.height-1,
        xoffset:cp.densitycanvas.width-1,
        horizontal:false,
        color:colorCentral.foreground,
        min:0,
        max:cp.densityMax,
        extremeonly:true,
        max_offset:-4,
    });

    /* sequence */
    if(cp.seqcanvas) {
        ctx=cp.seqcanvas.getContext('2d');
        var x=0;
        for(var i=0; i<cp.sequence.length; i++) {
            var b=cp.sequence[i];
            ctx.fillStyle=ntbcolor[b.toLowerCase()];
            ctx.fillRect(x,0,cp.sf,ideoHeight);
            x+=cp.sf;
        }
    }
    /* over */
}