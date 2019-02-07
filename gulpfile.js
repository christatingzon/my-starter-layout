"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const del = require("del");
const gulp = require("gulp");
const notify = require('gulp-notify');
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");

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
    src: basePaths.src + 'vendor/**/*.js',
    dest: basePaths.dest + 'js/'
  }
};

// Clean assets
function clean() {
  return del([basePaths.dest]);
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

// Watch files
function watch() {
  gulp.watch(paths.styles.src, css);
}

// define complex tasks
const build = gulp.series(clean, gulp.parallel(css));

// export tasks
exports.css = css;
exports.watch = watch;
exports.build = build;

// default task, called by just running `gulp`
exports.default = build;