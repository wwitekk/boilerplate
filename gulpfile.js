var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');

var paths = {
	baseDir: './app',
	scss_files: './app/scss/**/*.scss',
	css_dist: './app/assets/css',
	js_files: './app/assets/js/**/*.js',
	dist: './dist'
};

gulp.task('sass', function(){
  return gulp.src(paths.scss_files)
    .pipe(sourcemaps.init()) /*source maps for dev tools debugging*/
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer(
        {
            browsers: [
                '> 1%',
                'last 2 versions',
                'firefox >= 4',
                'safari 7',
                'safari 8',
                'IE 8',
                'IE 9',
                'IE 10',
                'IE 11'
            ],
            cascade: false
        }
    ))
    .pipe(gulp.dest(paths.css_dist))
    .pipe(browserSync.reload({
    	stream: true
    }))
});

//run this to get 'live' site
//reminder: useref needs comments in .html file
gulp.task('useref', function(){
  return gulp.src(paths.baseDir + '/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest(paths.dist))
});

gulp.task('copy', function(){
  var foldersToCopy = ['./app/assets/images/**/*', './app/assets/vendors/**/*'];
  return gulp.src(foldersToCopy, {base:'./app/assets'})
    .pipe(gulp.dest('./dist/assets/'));
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: paths.baseDir
    },
  })
});

//run this for development
gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch(paths.scss_files, ['sass']); 
  gulp.watch(paths.baseDir + '/*.html', browserSync.reload); 
  gulp.watch(paths.js_files, browserSync.reload); 
});

gulp.task('live',['useref', 'copy']);