var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

//var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSources = ['js/base/*.js'];

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
  gulp.src(jsSources)
    .pipe(concat('base.js')
      .on('error', gutil.log))
      //.pipe(uglify())
    //.pipe(browserify())
    .pipe(gulp.dest('js'));
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
