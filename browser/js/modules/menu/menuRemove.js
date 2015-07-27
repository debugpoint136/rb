/**
 * ===BASE===// menu // menuRemove.js
 * @param 
 */

function menuRemove() {
    /* remove/hide/turnoff things depend on context
     remove a thing through menu 'remove' option
     */
    var _context = gflag.menu.context;
    menu_hide();
    var bbj = gflag.menu.bbj;
    switch (_context) {
        case 1:
        case 2:
            /* removing tracks
             in removing from multi-select or mcm, always calling from target
             */
            if (bbj.splinterTag) {
                bbj = bbj.trunk;
            }
            if (bbj.weaver) {
                var target = bbj.weaver.iscotton ? bbj.weaver.target : bbj;
                var g2lst = {}, tlst = [];
                for (var i = 0; i < gflag.menu.tklst.length; i++) {
                    var t = gflag.menu.tklst[i];
                    if (t.cotton && t.ft != FT_weaver_c) {
                        if (t.cotton in g2lst) {
                            g2lst[t.cotton].push(t);
                        } else {
                            g2lst[t.cotton] = [t];
                        }
                    } else {
                        if (t.ft != FT_weaver_c) tlst.push(t);
                    }
                }
                if (tlst.length > 0) target.removeTrack_obj(tlst);
                for (var n in g2lst) {
                    target.weaver.q[n].removeTrack_obj(g2lst[n]);
                }
            } else {
                bbj.removeTrack_obj(gflag.menu.tklst);
            }
            glasspane.style.display = 'none';
            return;
        case 3:
            // deleting a gene set, apps.gsm is on
            apps.gsm.bbj.genome.geneset_delete(menu.genesetIdx);
            menu_hide();
            return;
        case 5:
            // remove 2nd dimension in facet
            var fa = apps.hmtk.bbj.facet;
            fa.dim2.term = fa.dim2.mdidx = null;
            fa.dim2.dom.innerHTML = literal_facet_nouse;
            menu_hide();
            apps.hmtk.bbj.generateTrackselectionLayout();
            return;
        case 8:
            // delete a term from mcm
            if (gflag.menu.idx >= bbj.mcm.lst.length) return;
            bbj.mcm.lst.splice(gflag.menu.idx, 1);
            bbj.initiateMdcOnshowCanvas();
            bbj.prepareMcm();
            bbj.drawMcm();
            bbj.__mcm_termchange();
            return;
        case 19:
            // single wreath tk
            apps.circlet.hash[gflag.menu.viewkey].wreath.splice(gflag.menu.wreathIdx, 1);
            hengeview_draw(gflag.menu.viewkey);
            return;
        case 20:
            // single bev tk
            var cc = gflag.menu.bbj.genome.bev.tklst[gflag.menu.bevtkidx].chrcanvas;
            for (var chr in cc)
                cc[chr].parentNode.removeChild(cc[chr]);
            gflag.menu.bbj.genome.bev.tklst.splice(gflag.menu.bevtkidx, 1);
            return;
        case 21:
            // hide a region from circlet plot
            var b = menu.circlet_blob;
            var vobj = apps.circlet.hash[b.viewkey];
            vobj.regionorder.splice(vobj.regionorder.indexOf(b.ridx), 1);
            hengeview_computeRegionRadian(b.viewkey);
            hengeview_ajaxupdatepanel(b.viewkey);
            menu_hide();
            return;
        default:
            fatalError("menu remove: unknown menu context id");
    }
}

