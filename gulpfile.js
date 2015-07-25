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
var jsSourcesCol = [
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

gulp.task('js', function() {
    gulp.src(jsSourcesCol)
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
