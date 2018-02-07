// ------------------------------------------------------------------------------------ //
var dest = 'dest/';
var src = 'src/';

var pugSrc = src + 'templates/*.pug',
    scssSrc = src + 'sass/**/*.scss',
    scssDst = dest + 'css/',
    jsVendorSrc = src + 'vendor/**/*.js',
    jsVendorDst = dest + 'js/';


// ------------------------------------------------------------------------------------ //
// GULP PLUGIN
var gulp = require('gulp'),
    pug = require('gulp-pug'),
    notify = require('gulp-notify'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat');


// ------------------------------------------------------------------------------------ //
// SETUPS


// ------------------------------------------------------------------------------------ //
// TASKS
gulp.task('prod', ['default','styles:prod', 'watch:prod']);
gulp.task('default', ['pug', 'styles', 'scripts', 'watch']);

/* Comment out Live Reload for the meantime */
//gulp.task('default', ['styles', 'watch'], function(){
//  
//  browserSync.init({
//      server: {
//          baseDir: "./"
//      }
//  });
//  gulp.watch(src + '**/*.scss', ['changes-watch']);
//  gulp.watch('**/*.html', function(done) {
//    browserSync.reload();
//    //done();
//  });
//});

//gulp.task('changes-watch', ['styles'], function (done) {
//  browserSync.reload();
//  done();
//});


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
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', function (err) { console.log(err.message); }))
      .pipe(sourcemaps.write())
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(gulp.dest(scssDst))
      .pipe(notify({ message: 'Style task complete' }));
});

gulp.task('styles:prod', function(){
  return gulp.src(scssSrc)
      .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'compressed'}).on('error', function (err) { console.log(err.message); }))
      .pipe(sourcemaps.write())
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(scssDst))
      .pipe(notify({ message: 'Styles and Minify task complete' }));
});


// --------------------------------------------------------------
// JAVASCRIPT

gulp.task('scripts', function(){
  return gulp.src(jsVendorSrc)
      .pipe(sourcemaps.init())
      .pipe(concat('vendor.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(jsVendorDst))
      .pipe(notify({ message: 'JS Concatenation task complete' }));
});

/*gulp.task('styles:prod', function(){
  return gulp.src(scssSrc)
      .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'compressed'}).on('error', function (err) { console.log(err.message); }))
      .pipe(sourcemaps.write())
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(scssDst))
      .pipe(notify({ message: 'Styles and Minify task complete' }));
});*/

// --------------------------------------------------------------
// WATCH

gulp.task('watch', function(done){
  gulp.watch(src + 'templates/*', ['pug']);
  gulp.watch(scssSrc, ['styles']);
  gulp.watch(jsVendorSrc, ['scripts']);

  //browserSync.reload();
  //done();
});

gulp.task('watch:prod', function(){
  gulp.watch(scssSrc, ['styles:prod']);
});