var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

//var coffeeSources = ['components/coffee/tagline.coffee'];
// var jsSources = ["browser/repeat/alethiometer/globalVariables.js","browser/repeat/alethiometer/colheader_getlanding.js","browser/repeat/alethiometer/drawBigmap.js","browser/repeat/alethiometer/bigmap_move_Md.js","browser/repeat/alethiometer/bigmap_move_Mm.js","browser/repeat/alethiometer/bigmap_move_Mu.js","browser/repeat/alethiometer/sortcolumn_bytrack.js","browser/repeat/alethiometer/colheader_Mmove.js","browser/repeat/alethiometer/colheader_Mout.js","browser/repeat/alethiometer/__track_Mmove.js","browser/repeat/alethiometer/make_a_track.js","browser/repeat/alethiometer/temcm_click.js","browser/repeat/alethiometer/colheader_select_Md.js","browser/repeat/alethiometer/colheader_select_Mm.js","browser/repeat/alethiometer/colheader_select_Mu.js","browser/repeat/alethiometer/zoomout.js","browser/repeat/alethiometer/menu_bigmap.js","browser/repeat/alethiometer/menu_temcm.js","browser/repeat/alethiometer/menu_showsearchui.js","browser/repeat/alethiometer/find_te_ku.js","browser/repeat/alethiometer/find_te.js","browser/repeat/alethiometer/pane_hide.js","browser/repeat/alethiometer/htmltext_bigmapcell.js","browser/repeat/alethiometer/htmltext_subfaminfo.js","browser/repeat/alethiometer/make_subfamhandle.js","browser/repeat/alethiometer/subfamhandle_click.js","browser/repeat/alethiometer/make_filehandle.js","browser/repeat/alethiometer/filehandle_click.js","browser/repeat/alethiometer/get_file_info.js","browser/repeat/alethiometer/make_geohandle.js","browser/repeat/alethiometer/geohandle_click.js","browser/repeat/alethiometer/getTrackdetail.js","browser/repeat/alethiometer/menu_getExperimentInfo.js","browser/repeat/alethiometer/menu_click4geo.js","browser/repeat/alethiometer/menu_getExperimentInfo_2.js","browser/repeat/alethiometer/show_info.js","browser/repeat/alethiometer/tab_click.js","browser/repeat/alethiometer/subfamtrackparam.js","browser/repeat/alethiometer/scoreSort.js","browser/repeat/alethiometer/coordSort.js","browser/repeat/alethiometer/draw_genomebev_1.js","browser/repeat/alethiometer/draw_genomebev_experiment.js","browser/repeat/alethiometer/make_genomebev_base.js","browser/repeat/alethiometer/genomebev_tooltip_mousemove.js","browser/repeat/alethiometer/wiggle_maxmin.js","browser/repeat/alethiometer/init_newgg.js","browser/repeat/alethiometer/delete_gg.js","browser/repeat/alethiometer/menu_genomegraph_1.js","browser/repeat/alethiometer/menu_genomegraph_2.js","browser/repeat/alethiometer/parseData_exp_bev.js","browser/repeat/alethiometer/make_bevcolorscale.js","browser/repeat/alethiometer/colorscale_slidermoved.js","browser/repeat/alethiometer/colorscale_slider_md.js","browser/repeat/alethiometer/colorscale_slider_mm.js","browser/repeat/alethiometer/colorscale_slider_mu.js","browser/repeat/alethiometer/scoredistribution_mm.js","browser/repeat/alethiometer/beam_rankitem.js","browser/repeat/alethiometer/draw_consensusPlot.js","browser/repeat/alethiometer/consensusPlot_md.js","browser/repeat/alethiometer/consensusPlot_mm.js","browser/repeat/alethiometer/consensusPlot_mu.js","browser/repeat/alethiometer/consensusPlot_ruler_md.js","browser/repeat/alethiometer/consensusPlot_ruler_mu.js","browser/repeat/alethiometer/consensusPlot_ruler_mm.js","browser/repeat/alethiometer/consensusPlot_showall.js","browser/repeat/alethiometer/click_gghandle.js","browser/repeat/alethiometer/view_gg.js","browser/repeat/alethiometer/show_viewlst.js","browser/repeat/alethiometer/delete_view.js","browser/repeat/alethiometer/afteraddremoveview.js","browser/repeat/alethiometer/genomebev_zoomin_md.js","browser/repeat/alethiometer/genomebev_splinter_mm.js","browser/repeat/alethiometer/genomebev_splinter_mu.js","browser/repeat/alethiometer/alethiometer_splinter_build.js","browser/repeat/alethiometer/__splinter_delete.js","browser/repeat/alethiometer/__splinter_svg.js","browser/repeat/alethiometer/__splinter_svg_cb.js","browser/repeat/alethiometer/__splinter_fly.js","browser/repeat/alethiometer/alethiometer_splinter_link.js","browser/repeat/alethiometer/__tkfind_applicationspecific.js","browser/repeat/alethiometer/scatterplot_show_2.js","browser/repeat/alethiometer/scatterplot_dotclick_2.js","browser/repeat/alethiometer/scatterplot_clickmenu_2.js","browser/repeat/alethiometer/scatterplot_submit2.js","browser/repeat/alethiometer/applyweight_tip.js","browser/repeat/alethiometer/applyweight_do.js","browser/repeat/alethiometer/add2gg_invoketkselect.js","browser/repeat/alethiometer/tkentryclick_add2gg.js","browser/repeat/alethiometer/delete_bev_experiment.js","browser/repeat/alethiometer/repeatbrowser_load.js","browser/repeat/alethiometer/repeatbrowser_loadhub_recursive.js","browser/repeat/alethiometer/repeatbrowser_loadhub_recursive_cb.js","browser/repeat/alethiometer/alethiometer_addtk_cb.js","browser/repeat/alethiometer/readygo.js"];
var jsAlethioSources = [
    "browser/repeat/js/modules/alethiometer/globalVariables.js",
    "browser/repeat/js/modules/alethiometer/colheader_getlanding.js",
    "browser/repeat/js/modules/alethiometer/drawBigmap.js",
    "browser/repeat/js/modules/alethiometer/bigmap_move_Md.js",
    "browser/repeat/js/modules/alethiometer/bigmap_move_Mm.js",
    "browser/repeat/js/modules/alethiometer/bigmap_move_Mu.js",
    "browser/repeat/js/modules/alethiometer/sortcolumn_bytrack.js",
    "browser/repeat/js/modules/alethiometer/colheader_Mmove.js",
    "browser/repeat/js/modules/alethiometer/colheader_Mout.js",
    "browser/repeat/js/modules/alethiometer/__track_Mmove.js",
    "browser/repeat/js/modules/alethiometer/make_a_track.js",
    "browser/repeat/js/modules/alethiometer/temcm_click.js",
    "browser/repeat/js/modules/alethiometer/colheader_select_Md.js",
    "browser/repeat/js/modules/alethiometer/colheader_select_Mm.js",
    "browser/repeat/js/modules/alethiometer/colheader_select_Mu.js",
    "browser/repeat/js/modules/alethiometer/zoomout.js",
    "browser/repeat/js/modules/alethiometer/menu_bigmap.js",
    "browser/repeat/js/modules/alethiometer/menu_temcm.js",
    "browser/repeat/js/modules/alethiometer/menu_showsearchui.js",
    "browser/repeat/js/modules/alethiometer/find_te_ku.js",
    "browser/repeat/js/modules/alethiometer/find_te.js",
    "browser/repeat/js/modules/alethiometer/pane_hide.js",
    "browser/repeat/js/modules/alethiometer/htmltext_bigmapcell.js",
    "browser/repeat/js/modules/alethiometer/htmltext_subfaminfo.js",
    "browser/repeat/js/modules/alethiometer/make_subfamhandle.js",
    "browser/repeat/js/modules/alethiometer/subfamhandle_click.js",
    "browser/repeat/js/modules/alethiometer/make_filehandle.js",
    "browser/repeat/js/modules/alethiometer/filehandle_click.js",
    "browser/repeat/js/modules/alethiometer/get_file_info.js",
    "browser/repeat/js/modules/alethiometer/make_geohandle.js",
    "browser/repeat/js/modules/alethiometer/geohandle_click.js",
    "browser/repeat/js/modules/alethiometer/getTrackdetail.js",
    "browser/repeat/js/modules/alethiometer/menu_getExperimentInfo.js",
    "browser/repeat/js/modules/alethiometer/menu_click4geo.js",
    "browser/repeat/js/modules/alethiometer/menu_getExperimentInfo_2.js",
    "browser/repeat/js/modules/alethiometer/show_info.js",
    "browser/repeat/js/modules/alethiometer/tab_click.js",
    "browser/repeat/js/modules/alethiometer/subfamtrackparam.js",
    "browser/repeat/js/modules/alethiometer/scoreSort.js",
    "browser/repeat/js/modules/alethiometer/coordSort.js",
    "browser/repeat/js/modules/alethiometer/draw_genomebev_1.js",
    "browser/repeat/js/modules/alethiometer/draw_genomebev_experiment.js",
    "browser/repeat/js/modules/alethiometer/make_genomebev_base.js",
    "browser/repeat/js/modules/alethiometer/genomebev_tooltip_mousemove.js",
    "browser/repeat/js/modules/alethiometer/wiggle_maxmin.js",
    "browser/repeat/js/modules/alethiometer/init_newgg.js",
    "browser/repeat/js/modules/alethiometer/delete_gg.js",
    "browser/repeat/js/modules/alethiometer/menu_genomegraph_1.js",
    "browser/repeat/js/modules/alethiometer/menu_genomegraph_2.js",
    "browser/repeat/js/modules/alethiometer/parseData_exp_bev.js",
    "browser/repeat/js/modules/alethiometer/make_bevcolorscale.js",
    "browser/repeat/js/modules/alethiometer/colorscale_slidermoved.js",
    "browser/repeat/js/modules/alethiometer/colorscale_slider_md.js",
    "browser/repeat/js/modules/alethiometer/colorscale_slider_mm.js",
    "browser/repeat/js/modules/alethiometer/colorscale_slider_mu.js",
    "browser/repeat/js/modules/alethiometer/scoredistribution_mm.js",
    "browser/repeat/js/modules/alethiometer/beam_rankitem.js",
    "browser/repeat/js/modules/alethiometer/draw_consensusPlot.js",
    "browser/repeat/js/modules/alethiometer/consensusPlot_md.js",
    "browser/repeat/js/modules/alethiometer/consensusPlot_mm.js",
    "browser/repeat/js/modules/alethiometer/consensusPlot_mu.js",
    "browser/repeat/js/modules/alethiometer/consensusPlot_ruler_md.js",
    "browser/repeat/js/modules/alethiometer/consensusPlot_ruler_mu.js",
    "browser/repeat/js/modules/alethiometer/consensusPlot_ruler_mm.js",
    "browser/repeat/js/modules/alethiometer/consensusPlot_showall.js",
    "browser/repeat/js/modules/alethiometer/click_gghandle.js",
    "browser/repeat/js/modules/alethiometer/view_gg.js",
    "browser/repeat/js/modules/alethiometer/show_viewlst.js",
    "browser/repeat/js/modules/alethiometer/delete_view.js",
    "browser/repeat/js/modules/alethiometer/afteraddremoveview.js",
    "browser/repeat/js/modules/alethiometer/genomebev_zoomin_md.js",
    "browser/repeat/js/modules/alethiometer/genomebev_splinter_mm.js",
    "browser/repeat/js/modules/alethiometer/genomebev_splinter_mu.js",
    "browser/repeat/js/modules/alethiometer/alethiometer_splinter_build.js",
    "browser/repeat/js/modules/alethiometer/__splinter_delete.js",
    "browser/repeat/js/modules/alethiometer/__splinter_svg.js",
    "browser/repeat/js/modules/alethiometer/__splinter_svg_cb.js",
    "browser/repeat/js/modules/alethiometer/__splinter_fly.js",
    "browser/repeat/js/modules/alethiometer/alethiometer_splinter_link.js",
    "browser/repeat/js/modules/alethiometer/__tkfind_applicationspecific.js",
    "browser/repeat/js/modules/alethiometer/scatterplot_show_2.js",
    "browser/repeat/js/modules/alethiometer/scatterplot_dotclick_2.js",
    "browser/repeat/js/modules/alethiometer/scatterplot_clickmenu_2.js",
    "browser/repeat/js/modules/alethiometer/scatterplot_submit2.js",
    "browser/repeat/js/modules/alethiometer/applyweight_tip.js",
    "browser/repeat/js/modules/alethiometer/applyweight_do.js",
    "browser/repeat/js/modules/alethiometer/add2gg_invoketkselect.js",
    "browser/repeat/js/modules/alethiometer/tkentryclick_add2gg.js",
    "browser/repeat/js/modules/alethiometer/delete_bev_experiment.js",
    "browser/repeat/js/modules/alethiometer/repeatbrowser_load.js",
    "browser/repeat/js/modules/alethiometer/repeatbrowser_loadhub_recursive.js",
    "browser/repeat/js/modules/alethiometer/repeatbrowser_loadhub_recursive_cb.js",
    "browser/repeat/js/modules/alethiometer/alethiometer_addtk_cb.js",
    "browser/repeat/js/modules/alethiometer/readygo.js"
];
//var sassSources = ['components/sass/style.scss'];
//var htmlSources = ['builds/development/*.html'];
//var jsonSources = ['builds/development/js/*.json'];

/*gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({ bare: true })
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});*/

gulp.task('js-alethiometer', function() {
    gulp.src(jsAlethioSources)
        .pipe(concat('alethiometer.js')
        .on('error', gutil.log))
        //.pipe(uglify())
        //.pipe(browserify())
        .pipe(gulp.dest('browser/repeat/js/scripts'));
    //.pipe(connect.reload())
});

/*gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
    	sass: 'components/sass',
    	image: 'builds/development/images',
    	style: 'expanded'
    }))
     .on('error', gutil.log)
    .pipe(gulp.dest('builds/development/css'))
    .pipe(connect.reload())
});*/

/*
gulp.task('watch', function() {
	//gulp.watch(coffeeSources, ['coffee'])
	gulp.watch(jsSources, ['js'])
	//gulp.watch('components/sass*/
/*.scss', ['compass']);
	//gulp.watch(htmlSources, ['html'])
	//gulp.watch(jsonSources, ['json'])

});
*/

/*
gulp.task('connect', function() {
	connect.server({
		root: 'builds/development/',
		livereload: true
	});
});

gulp.task('html', function() {
	gulp.src(htmlSources)
	.pipe(connect.reload())
});

gulp.task('json', function() {
	gulp.src(jsonSources)
	.pipe(connect.reload())
});
*/

//gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'watch', 'connect'] );
//gulp.task('default', ['js'] );

var baseSources = [
    "browser/js/modules/header.js",
    "browser/js/modules/gflag.js",
    "browser/js/modules/colorCentral.js",
    "browser/js/modules/Browser.js",

    "browser/js/modules/dom/dom_create.js",
    "browser/js/modules/dom/make_radiobutton.js",
    "browser/js/modules/dom/dom_addbutt.js",
    "browser/js/modules/dom/dom_addtext.js",
    "browser/js/modules/dom/make_headertable.js",
    "browser/js/modules/dom/make_slidingtable.js",
    "browser/js/modules/dom/slidingtableMD.js",
    "browser/js/modules/dom/slidingtableMM.js",
    "browser/js/modules/dom/slidingtableMU.js",
    "browser/js/modules/dom/make_tablist.js",
    "browser/js/modules/dom/tablisttab_click.js",
    "browser/js/modules/dom/dom_inputtext.js",
    "browser/js/modules/dom/dom_inputnumber.js",
    "browser/js/modules/dom/dom_addcheckbox.js",
    "browser/js/modules/dom/dom_addselect.js",
    "browser/js/modules/dom/dom_addrowbutt.js",
    "browser/js/modules/dom/dom_labelbox.js",
    "browser/js/modules/dom/labelbox_mover.js",
    "browser/js/modules/dom/labelbox_mout.js",
    "browser/js/modules/dom/dom_bignumtable.js",

    "browser/js/modules/genome/Genome.js",
    "browser/js/modules/genome/jsonGenome.js",
    "browser/js/modules/genome/getcytoband4region2plot.js",
    "browser/js/modules/genome/drawIdeogramSegment_simple.js",

    "browser/js/modules/tiny/parseUrlparam.js",
    "browser/js/modules/tiny/pagemask.js",
    "browser/js/modules/tiny/foregroundcolor.js",
    "browser/js/modules/tiny/isHmtk.js",
    "browser/js/modules/tiny/isCustom.js",
    "browser/js/modules/tiny/isNumerical.js",
    "browser/js/modules/tiny/decormodestr2num.js",
    "browser/js/modules/tiny/simulateEvent.js",
    "browser/js/modules/tiny/int2strcomma.js",
    "browser/js/modules/tiny/absolutePosition.js",
    "browser/js/modules/tiny/stripChild.js",
    "browser/js/modules/tiny/neat_0t1.js",
    "browser/js/modules/tiny/neatstr.js",
    "browser/js/modules/tiny/bp2neatstr.js",
    "browser/js/modules/tiny/lightencolor.js",
    "browser/js/modules/tiny/darkencolor.js",
    "browser/js/modules/tiny/colorstr2int.js",
    "browser/js/modules/tiny/rgb2hex.js",
    "browser/js/modules/tiny/arrayMin.js",
    "browser/js/modules/tiny/arrayMean.js",
    "browser/js/modules/tiny/arrayMax.js",
    "browser/js/modules/tiny/getArrIdx.js",
    "browser/js/modules/tiny/stringLstIsIdentical.js",
    "browser/js/modules/tiny/hashisempty.js",
    "browser/js/modules/tiny/thinginlist.js",
    "browser/js/modules/tiny/placePanel.js",
    "browser/js/modules/tiny/gfSort_len.js",
    "browser/js/modules/tiny/gfSort_coord.js",
    "browser/js/modules/tiny/gfSort_coord_rev.js",
    "browser/js/modules/tiny/numSort.js",
    "browser/js/modules/tiny/numSort2.js",
    "browser/js/modules/tiny/getSelectValueById.js",
    "browser/js/modules/tiny/snpSort.js",
    "browser/js/modules/tiny/hspSort.js",
    "browser/js/modules/tiny/stitchSort.js",
    "browser/js/modules/tiny/changeSelectByValue.js",
    "browser/js/modules/tiny/checkInputByvalue.js",
    "browser/js/modules/tiny/getValue_by_radioName.js",
    "browser/js/modules/tiny/getAlt_by_radioName.js",
    "browser/js/modules/tiny/makecanvaslabel.js",
    "browser/js/modules/tiny/indicator4fly.js",
    "browser/js/modules/tiny/indicator4actuallyfly.js",
    "browser/js/modules/tiny/parseCoordinate.js",
    "browser/js/modules/tiny/defaultposition.js",
    "browser/js/modules/tiny/parseCoord_wildgoose.js",
    "browser/js/modules/tiny/pica_go.js",
    "browser/js/modules/tiny/htmltext_colorscale.js",
    "browser/js/modules/tiny/pica_hide.js",
    "browser/js/modules/tiny/toggle_prevnode.js",
    "browser/js/modules/tiny/toggle33.js",
    "browser/js/modules/tiny/toggle34.js",
    "browser/js/modules/tiny/toggle1_1.js",
    "browser/js/modules/tiny/toggle1_2.js",
    "browser/js/modules/tiny/toggle1.js",
    "browser/js/modules/tiny/toggle7_2.js",
    "browser/js/modules/tiny/toggle7_1.js",
    "browser/js/modules/tiny/toggle7.js",
    "browser/js/modules/tiny/toggle8_1.js",
    "browser/js/modules/tiny/toggle8_2.js",
    "browser/js/modules/tiny/toggle8.js",
    "browser/js/modules/tiny/toggle9.js",
    "browser/js/modules/tiny/toggle13.js",
    "browser/js/modules/tiny/toggle14.js",
    "browser/js/modules/tiny/toggle2.js",
    "browser/js/modules/tiny/plot_ruler.js",
    "browser/js/modules/tiny/drawscale_compoundtk.js",
    "browser/js/modules/tiny/shake_dom.js",
    "browser/js/modules/tiny/panelFadein.js",
    "browser/js/modules/tiny/panelFadein_end.js",
    "browser/js/modules/tiny/panelFadeout.js",
    "browser/js/modules/tiny/panelFadeout_end.js",
    "browser/js/modules/tiny/page_keyup.js",
    "browser/js/modules/tiny/print2console.js",
    "browser/js/modules/tiny/done.js",
    "browser/js/modules/tiny/tkishidden.js",
    "browser/js/modules/tiny/tk_height.js",
    "browser/js/modules/tiny/cmtk_height.js",
    "browser/js/modules/tiny/geneisinvalid.js",
    "browser/js/modules/tiny/bbjparamfillto_x.js",
    "browser/js/modules/tiny/bbjparamfillto_tk.js",
    "browser/js/modules/tiny/str2jsonobj.js",
    "browser/js/modules/tiny/hammockjsondesc2tk.js",
    "browser/js/modules/tiny/bbjisbusy.js",


    "app/scripts/js/base/a5.cloak.js",
    "app/scripts/js/base/a6.ajax.js",
    "app/scripts/js/base/a7.baseFunc.js",
    "app/scripts/js/base/a8.render.js",
    "app/scripts/js/base/b4.navigator.js",
    "app/scripts/js/base/b5.preqtc.js",
    "app/scripts/js/base/b6.qtc.js",
    "app/scripts/js/base/b7.palette.js",
    "app/scripts/js/base/b8.predsp.js",
    "app/scripts/js/base/b9.dsp.js",
    "app/scripts/js/base/c1.track.js",
    "app/scripts/js/base/c2.weaver.js",
    "app/scripts/js/base/c3.wvfind.js",

    "browser/js/modules/md/getmdidx_internal.js",
    "browser/js/modules/md/parse_metadata_recursive.js",
    "browser/js/modules/md/invokemds.js",
    "browser/js/modules/md/mcmheader_mover.js",
    "browser/js/modules/md/menu_mcm_invokemds.js",
    "browser/js/modules/md/button_mcm_invokemds.js",
    "browser/js/modules/md/mcm_invokemds.js",
    "browser/js/modules/md/mdvGetallchild.js",
    "browser/js/modules/md/mdCheckboxchange.js",
    "browser/js/modules/md/mdgettrack.js",
    "browser/js/modules/md/drawMcm_onetrack.js",
    "browser/js/modules/md/recursiveFetchTrackAttr.js",
    "browser/js/modules/md/initiateMdcOnshowCanvas.js",
    "browser/js/modules/md/mdterm_print.js",
    "browser/js/modules/md/mdt_box_click.js",
    "browser/js/modules/md/mdshowhide.js",
    "browser/js/modules/md/parse_nativemd.js",
    "browser/js/modules/md/tknamelst_getmdidxhash.js",
    "browser/js/modules/md/md_findterm.js",
    "browser/js/modules/md/words2mdterm.js",
    "browser/js/modules/md/load_metadata_url.js",
    "browser/js/modules/md/loadmetadata_jsontext.js",
    "browser/js/modules/md/load_metadata_json.js",
    "browser/js/modules/md/make_mdtree_recursive.js",
    "browser/js/modules/md/mdtermsearch_show.js",
    "browser/js/modules/md/mdtermsearch_ku.js",
    "browser/js/modules/md/mdtermsearch.js",

    "browser/js/modules/mcm/mcm_mayaddgenome.js",
    "browser/js/modules/mcm/showhide_term_in_mcm.js",
    "browser/js/modules/mcm/mcm_termname_click.js",
    "browser/js/modules/mcm/mcm_termname_MD.js",
    "browser/js/modules/mcm/mcm_termname_M.js",
    "browser/js/modules/mcm/mcm_termname_MU.js",
    "browser/js/modules/mcm/mcm_sort.js",
    "browser/js/modules/mcm/prepareMcm.js",
    "browser/js/modules/mcm/prepareMcM_oneterm.js",
    "browser/js/modules/mcm/getHmtkIdxlst_mcmCell.js",
    "browser/js/modules/mcm/movetk_hmtk.js",
    "browser/js/modules/mcm/mcmPlaceheader.js",
    "browser/js/modules/mcm/show_mcmColorConfig.js",
    "browser/js/modules/mcm/mcm_configcolor_restore.js",
    "browser/js/modules/mcm/mcm_configcolor_initiate.js",
    "browser/js/modules/mcm/mcm_configcolor.js",
    "browser/js/modules/mcm/mcm_Mdown.js",
    "browser/js/modules/mcm/mcmMoveM.js",
    "browser/js/modules/mcm/mcmMoveMU.js",
    "browser/js/modules/mcm/mcm_tooltipmove.js",
    "browser/js/modules/mcm/mcm_Mover.js",
    "browser/js/modules/mcm/mcm_Mout.js",
    "browser/js/modules/mcm/mcm_addterm_closure.js",
    "browser/js/modules/mcm/mcm_addterm.js",

    "app/scripts/js/base/c6.decor.js",
    "app/scripts/js/base/c7.facet.js",
    "app/scripts/js/base/c8.scalebar.js",
    "app/scripts/js/base/c9.pan.js",
    "app/scripts/js/base/d1.zoom.js",
    "app/scripts/js/base/d11.tks.js",
    "app/scripts/js/base/d2.menu.js",
    "app/scripts/js/base/d3.matplot.js",
    "app/scripts/js/base/d4.note.js",
    "app/scripts/js/base/d5.lr.js",
    "app/scripts/js/base/d6.cate.js",
    "app/scripts/js/base/d7.custtk.js",
    "app/scripts/js/base/d8.cache.js",

    "browser/js/modules/hub/publichub_makehandle.js",
    "browser/js/modules/hub/publichub_detail_closure.js",
    "browser/js/modules/hub/publichub_detail.js",
    "browser/js/modules/hub/publichub_load_closure.js",
    "browser/js/modules/hub/publichub_load_page.js",
    "browser/js/modules/hub/publichub_load.js",
    "browser/js/modules/hub/loaddatahub_pushbutt.js",
    "browser/js/modules/hub/jsonhub_upload.js",
    "browser/js/modules/hub/jsonhub_choosefile.js",
    "browser/js/modules/hub/loadhub_urljson.js",
    "browser/js/modules/hub/loadhub_urljson_cb.js",
    "browser/js/modules/hub/jsontext_removecomment.js",
    "browser/js/modules/hub/parse_jsontext.js",
    "browser/js/modules/hub/hubtagistrack.js",
    "browser/js/modules/hub/parse_custom_track.js",
    "browser/js/modules/hub/parse_native_track.js",
    "browser/js/modules/hub/loaddatahub_json.js",
    "browser/js/modules/hub/custmdanno_parsestr.js",
    "browser/js/modules/hub/tkdefaultMode.js",
    "browser/js/modules/hub/parse_tkmode.js",
    "browser/js/modules/hub/parseHubtrack.js",

    "app/scripts/js/base/e1.jump.js",
    "app/scripts/js/base/e2.scaffold.js",
    "app/scripts/js/base/e3.spread.js",
    "app/scripts/js/base/e4.splinter.js",
    "app/scripts/js/base/e5.svg.js",
    "app/scripts/js/base/e6.cmtk.js",
    "app/scripts/js/base/e7.misc.js",
    "app/scripts/js/base/e8.pca.js",
    "app/scripts/js/base/e9.rnavi.js",
    "app/scripts/js/base/f1.app.js"
    ];

gulp.task('js-base', function() {
    gulp.src(baseSources)
        .pipe(concat('base.js')
            .on('error', gutil.log))
        //.pipe(uglify())
        //.pipe(browserify())
        .pipe(gulp.dest('browser/js/scripts'));
    //.pipe(connect.reload())
});