"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const concat = require('gulp-concat');
const cssnano = require("cssnano");
const del = require("del");
const gulp = require("gulp");
const htmlmin = require('gulp-htmlmin');
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const notify = require('gulp-notify');
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require('gulp-uglify');
const wait = require('gulp-wait');

// Define paths
const basePaths = {
  src: 'src/',
  dest: 'dest/'
};
const paths = {
  styles: {
    src: basePaths.src + 'sass/**/*.scss',
    dest: basePaths.dest + 'assets/css/',
  },
  scripts: {
    src: basePaths.src + 'scripts/**/*.js',
    dest: basePaths.dest + 'assets/js/'
  },
  images: {
    src: basePaths.src + 'fixtures/**/*',
    dest: basePaths.dest + 'assets/img/'
  },
  html: {
    src: basePaths.src + 'templates/**/*.html',
    dest: basePaths.dest
  }
};

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: basePaths.dest
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean assets
function clean() {
  return del([basePaths.dest]);
}

// Optimize Images
function images() {
  return gulp
    .src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest(paths.images.dest))
    .pipe(notify({ message: 'Image Optimization task complete' }));
}

// CSS Task
function css() {
  return gulp
    .src(paths.styles.src)
    .pipe(wait(1500))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "nested" }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browsersync.stream())
    .pipe(notify({ message: 'Style task complete' }));}

// Concat and Minify Scripts
 function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browsersync.stream())
    .pipe(notify({ message: 'Script task complete' }));
}

// Minify HTML
function html() {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({
      collapseWhitespace: false,
      removeComments: true
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browsersync.stream())
    .pipe(notify({ message: 'HTML minify task complete' }));
}

// Watch files
function watchFiles() {
  gulp.watch(paths.styles.src, gulp.series(css, browserSyncReload));
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.scripts.src, gulp.series(scripts, browserSyncReload));
  gulp.watch(paths.html.src, gulp.series(html, browserSyncReload));
}

// define complex tasks
const build = gulp.series(clean, gulp.parallel(css, images, scripts, html));
const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.watch = watch;

// default task, called by just running `gulp`
exports.default = build;