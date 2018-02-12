// ------------------------------------------------------------------------------------ //
var dest = 'dest/';
var src = 'src/';

var pugSrc = src + 'templates/*.pug',
    scssSrc = src + 'sass/**/*.scss',
    scssDst = dest + 'css/',
    vendorSrc = src + 'vendor/',
    jsVendorSrc = src + 'vendor/**/*.js',
    jsVendorDst = dest + 'js/',
    cssVendorSrc = src + 'vendor/**/*.css',
    cssVendorDst = dest + 'css/',
    imgSrc = src + 'fixtures/*',
    imgDst = dest + 'images/';


// ------------------------------------------------------------------------------------ //
// GULP PLUGIN
var fs = require('fs'), //file system
    gulp = require('gulp'),
    pug = require('gulp-pug'),
    notify = require('gulp-notify'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    emptyDir = require('empty-dir'),
    del = require('del'),
    image = require('gulp-image'),
    changed = require('gulp-changed');


// ------------------------------------------------------------------------------------ //
// SETUPS


// ------------------------------------------------------------------------------------ //
// TASKS
gulp.task('default', ['pug', 'styles', 'styles:vendor', 'scripts', 'images', 'watch']);
gulp.task('prod', ['default','styles:prod', 'watch:prod']);

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

gulp.task('styles:vendor', function(){
  return gulp.src(cssVendorSrc, {cwd: './'})
      .pipe(sourcemaps.init())
      .pipe(concat('vendor.css'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(cssVendorDst))
      .pipe(notify({ message: 'Styles Vendor Concatenation task complete' }));
});


// --------------------------------------------------------------
// JAVASCRIPT

gulp.task('scripts', function(){
  emptyDir(vendorSrc, function (err, result) {/**/ });
  var result = emptyDir.sync(vendorSrc);

  if (result){
    fs.writeFile(vendorSrc +'.gitignore', '*\r\n!.gitignore', (error) => { /* handle error */ });
    fs.writeFile(vendorSrc +'_temp.txt', 'dev purpose', (error) => { /* handle error */ });
    return del(jsVendorDst + 'vendor.js');
  } else {
    
    fs.readdir(vendorSrc, (err, files) => {
      var countFile = files.length;
      if(countFile > 1){
        fs.unlink(vendorSrc +'_temp.txt', function (err) {});
      }
    });


    return gulp.src(jsVendorSrc, {cwd: './'})
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(jsVendorDst))
        .pipe(notify({ message: 'Script Vendor Concatenation task complete' }));
  }
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
// IMAGES

gulp.task('images', function() {
  return gulp.src(imgSrc)
      .pipe(changed(imgDst))
      .pipe(image())
      .pipe(gulp.dest(imgDst))
      .pipe(notify({ message: 'Image Optimization task complete' }));
});


// --------------------------------------------------------------
// WATCH

gulp.task('watch', function(done){
  gulp.watch(pugSrc, ['pug']);
  gulp.watch(scssSrc, ['styles']);
  gulp.watch([jsVendorSrc, vendorSrc + '*' ], {cwd: './'}, ['scripts']);
  gulp.watch(cssVendorSrc, {cwd: './'}, ['styles:vendor']);
  gulp.watch(imgSrc, {cwd: './'}, ['images']);

  //browserSync.reload();
  //done();
});

gulp.task('watch:prod', function(){
  gulp.watch(scssSrc, ['styles:prod']);
});