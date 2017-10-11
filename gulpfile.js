// ------------------------------------------------------------------------------------ //
var dest = 'dest/';
var src = 'src/';
var sassProd = false;

var pugSrc = src + 'templates/*.pug',
    scssSrc = src + 'sass/*.scss',
    scssDst = dest + 'css/';



// ------------------------------------------------------------------------------------ //
// GULP PLUGIN
var gulp = require('gulp'),
    pug = require('gulp-pug'),
    notify = require('gulp-notify'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename');



// ------------------------------------------------------------------------------------ //
// TASKS
gulp.task('prod', ['default','styles:prod', 'watch:prod']);
gulp.task('default', ['pug', 'styles', 'watch']);


// --------------------------------------------------------------
// PUG TEMPLATE

gulp.task('pug', function() {
  return gulp.src(pugSrc)
      .pipe(pug({
        pretty:true
      }))
      .pipe(gulp.dest(dest))
      .pipe(notify({ message: 'Pug compile task complete' }));
});


// --------------------------------------------------------------
// CSS / SASS

gulp.task('styles', function(){
  return gulp.src(scssSrc)
      .pipe(sass().on('error', function (err) { console.log(err.message); }))
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(gulp.dest(scssDst))
      .pipe(notify({ message: 'Style task complete' }));
});

gulp.task('styles:prod', function(){
  sassProd = true;
  return gulp.src(scssSrc)
      .pipe(sass({outputStyle: 'compressed'}).on('error', function (err) { console.log(err.message); }))
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(scssDst))
      .pipe(notify({ message: 'Styles and Minify task complete' }));
});


// --------------------------------------------------------------
// WATCH

gulp.task('watch', function(){
  gulp.watch(src + 'templates/*', ['pug']);
  gulp.watch(src + 'sass/*', ['styles']);
});

gulp.task('watch:prod', function(){
  gulp.watch(src + 'sass/*', ['styles:prod']);
});