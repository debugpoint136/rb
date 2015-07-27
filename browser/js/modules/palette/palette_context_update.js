/**
 * ===BASE===// palette // palette_context_update.js
 * @param 
 */

function palette_context_update() {
    switch (palette.which) {
        case 1:
            stc_textcolor();
            return;
        case 2:
            stc_bedcolor();
            return;
        case 3:
            stc_forwardcolor();
            return;
        case 4:
            stc_reversecolor();
            return;
        case 5:
            stc_mismatchcolor();
            return;
        case 6:
            stc_longrange_pcolor();
            return;
        case 8:
            stc_longrange_ncolor();
            return;
        case 10:
            hengeview_arcpcolor();
            return;
        case 11:
            hengeview_arcncolor();
            return;
        case 12:
            mcm_configcolor();
            return;
        case 13:
            scatterplot_dotcolor();
            return;
        case 14:
            matplot_linecolor();
            return;
        case 15:
            tk_bgcolor();
            return;
        case 16:
            cmtk_color_set();
            return;
        case 17:
            ldtk_color_set();
            return;
        case 20:
            document.getElementById('geneplot_s4_pc').style.backgroundColor = palette.output;
            return;
        case 21:
            document.getElementById('geneplot_s4_nc').style.backgroundColor = palette.output;
            return;
        case 22:
            document.getElementById('geneplot_s1_lc').style.backgroundColor = palette.output;
            return;
        case 23:
            document.getElementById('geneplot_s2_lc').style.backgroundColor = palette.output;
            return;
        case 24:
            document.getElementById('geneplot_s3_promoterc').style.backgroundColor = palette.output;
            return;
        case 25:
            document.getElementById('geneplot_s3_utr5c').style.backgroundColor = palette.output;
            return;
        case 26:
            document.getElementById('geneplot_s3_utr3c').style.backgroundColor = palette.output;
            return;
        case 27:
            document.getElementById('geneplot_s3_exonsc').style.backgroundColor = palette.output;
            return;
        case 28:
            document.getElementById('geneplot_s3_intronsc').style.backgroundColor = palette.output;
            return;
        case 30:
            menu.c50.color1.style.backgroundColor = palette.output;
            menu_update_track(1);
            return;
        case 31:
            menu.c50.color2.style.backgroundColor = palette.output;
            menu_update_track(2);
            return;
        case 32:
            menu.c50.color1_1.style.backgroundColor = palette.output;
            menu_update_track(3);
            return;
        case 33:
            menu.c50.color2_1.style.backgroundColor = palette.output;
            menu_update_track(4);
            return;
        case 39:
            custcate_submitui_setcolor();
            return;
        case 40:
            hengeview_wreathpcolor();
            return;
        case 41:
            hengeview_wreathncolor();
            return;
        case 42:
            cateTkitemcolor();
            return;
        case 43:
            tk_barplotbg();
            return;
        default:
            fatalError("palette_context_update: unknown palette.which");
    }
}
