"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const concat = require('gulp-concat');
const cssnano = require("cssnano");
const del = require("del");
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const notify = require('gulp-notify');
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require('gulp-uglify');

// Define paths
const basePaths = {
  src: 'src/',
  dest: 'dest/assets/'
};
const paths = {
  styles: {
    src: basePaths.src + 'sass/**/*.scss',
    dest: basePaths.dest + 'css/',
  },
  scripts: {
    src: basePaths.src + 'scripts/**/*.js',
    dest: basePaths.dest + 'js/'
  },
  images: {
    src: basePaths.src + 'fixtures/**/*',
    dest: basePaths.dest + 'img/'
  }
};

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
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "nested" }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(notify({ message: 'Style task complete' }));}

// Concat and Minify Scripts
 function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(notify({ message: 'Script task complete' }));
}

// Watch files
function watch() {
  gulp.watch(paths.styles.src, css);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.scripts.src, scripts);
}

// define complex tasks
const build = gulp.series(clean, gulp.parallel(css, images, scripts));

// export tasks
exports.watch = watch;

// default task, called by just running `gulp`
exports.default = build;