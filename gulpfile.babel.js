import gulp from "gulp";
import babel from "gulp-babel";
import sourcemaps from 'gulp-sourcemaps';
import plumber from "gulp-plumber";
import uglify from "gulp-uglify";
import browserSyncModule from "browser-sync";
import os from "os";
import path from "path";
import compact from "lodash/compact";

import taskScss from "./tasks/scss";
import taskWebpack from "./tasks/webpack";
import buildTask from "./tasks/build";

const browserSync = browserSyncModule.create();

const distUrl = "dist/",
      srcUrl  = "es2015/",
      buildUrl = "js/";

taskScss.enablePX2REM(false);
taskScss.install(gulp, browserSync);
taskWebpack.install(gulp);
buildTask.install(gulp);


gulp.task("auto", function(){
    browserSync.init({
        server: ".",
        middleware: [
            function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Cache-Control', 'no-store');
                next();
            }
        ]
    });
    gulp.watch('scss/**/*.scss', ["scss"]);
    // gulp.watch("es2015/**/*.js", ["es2015"]);
    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch("js/*.js").on('change', browserSync.reload);
});

gulp.task("default", ["scss", "auto", "webpack"]);
