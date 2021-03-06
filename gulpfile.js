"use strict";

var gulp = require("gulp");
var bsync = require("browser-sync");
var autoprefixer = require("autoprefixer");
var watch = require("gulp-watch");
var cssnano = require("cssnano");
var webpack = require("webpack-stream");
var $ = require("gulp-load-plugins")();

gulp.task("js", function() {
  return gulp
    .src("./src/assets/js/main.js")
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(gulp.dest("./public/assets/js/"))
    .pipe(bsync.reload({ stream: true }));
});

gulp.task("views", function() {
  return gulp
    .src(["!./src/views/_*.pug", "./src/views/*.pug"])
    .pipe($.pug({ pretty: true }))
    .pipe(gulp.dest("./public/"))
    .pipe(bsync.reload({ stream: true, reloadDelay: 300 }));
});

gulp.task("styles", function() {
  var sassOptions = {
    includePaths: ["node_modules/bootstrap/scss/"],
    outputStyle: "compressed"
  };
  var plugins = [autoprefixer(), cssnano({ zindex: false })];
  return gulp
    .src("./src/assets/styles/main.scss")
    .pipe($.sass(sassOptions).on("error", $.sass.logError))
    .pipe($.postcss(plugins))
    .pipe(gulp.dest("./public/assets/styles/"))
    .pipe(bsync.reload({ stream: true }));
});

gulp.task("images", function() {
  return gulp
    .src("./src/assets/images/**/*")
    .pipe(
      $.imagemin({
        progressive: true,
        interlaced: true,
        optimizationLevel: 4
      })
    )
    .pipe(gulp.dest("./public/assets/images/"));
});

gulp.task("browser-sync", function() {
  bsync({
    server: {
      baseDir: "./public/"
    },
    ghostMode: true,
    notify: false
  });
});

gulp.task("default", gulp.series("styles", "views", "images", "js"));

gulp.task("watch", gulp.series("default", function() {
  gulp.watch(["src/assets/images", "src/assets/images/**/*"], gulp.series("images", function(){}));
  gulp.watch("src/assets/styles/*", gulp.series("styles", function(){}));
  gulp.watch("src/assets/js/*", gulp.series("js", function(){}));
  gulp.watch("src/views/**/*.pug", gulp.series("views", function(){}));
  gulp.start("browser-sync");
}));
