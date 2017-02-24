import gulp from "gulp";
import babel from "gulp-babel";
import sourcemaps from 'gulp-sourcemaps';
import plumber from "gulp-plumber";
import autoprefixer from "gulp-autoprefixer";
import cssmin from "gulp-cssmin";
import scss from "gulp-sass";
import uglify from "gulp-uglify";
import browserSyncModule from "browser-sync";
import os from "os";

import path from "path";
import moment from "moment";


import {exec, spawn, execSync, spawnSync} from "child_process";
import compact from "lodash/compact";
import del from "del";

const browserSync = browserSyncModule.create();

const distUrl = "dist/",
      srcUrl  = "es2015/",
      buildUrl = "js/";

gulp.task('scss', function () {

    return gulp.src('scss/*.scss')
        .pipe( sourcemaps.init() )
        .on('error', function (error) {
            console.log(error.toString());
            this.emit('end');
        })
        .pipe(plumber())
        .pipe(scss())
        // .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer({
            browsers: ['> 1%', "IE 9"],
            cascade: false
        }))
        //.pipe(minify())
        .pipe( sourcemaps.write('./maps'))
        .pipe( gulp.dest('css/') )
        .pipe(browserSync.stream());
});


/**
 * 启动webpack或者webpack-dev-server
 */
var webpackFn = function (progressName) {

    var cmd = "",
        params = [];

    if(progressName === "webpack"){
        cmd = "node";
        params = ["./node_modules/webpack/bin/webpack", "-w", "true"]
    }else if(progressName === "webpack-dev-server"){
        cmd = "node";
        params = ["./node_modules/webpack-dev-server/bin/webpack-dev-server"]
    }else{
        throw new Error(`未知参数值: ${progressName}, 暂只支持"webpack" 或者 "webpack-dev-server"`);
    }

    var packer = {
        self: null,
        
        init: function(){
            this.start();
        },
        
        start: function () {
            console.log("启动webpack进程...");
            this.self = spawn(cmd, params);
            this.self.stdout.on("data", function (data) {
                console.log(data.toString());
            })
        },
        stop: function () {
            console.log("终止webpack进程..");
            this.self.kill();
        },
        restart: function () {
            this.stop();
            this.start();
        }
    };

    
    packer.init();

    gulp.watch(`${srcUrl}/*.js`, function (event) {
        switch (event.type){
            case "deleted":
            case "added":
                console.log("监听到文件数量发生了改变，正在重启webpack.");
                packer.restart();
        }
    });

    gulp.watch("webpack.config.js", function () {
        console.log("监听到webpack配置发生了改变，正在重启webpack...");
        packer.restart();
    })

};

gulp.task("webpack", webpackFn.bind(this, "webpack"));

gulp.task("server", webpackFn.bind(this, "webpack-dev-server"));


gulp.task("clean", function () {
    del.sync(distUrl);
});

gulp.task("publish", function () {
    spawnSync("node", ["./node_modules/webpack/bin/webpack"]);
});

gulp.task("move-publish", function () {

    return new Promise(function (resolve, reject) {

        /**
         * 异步文件拷贝的任务数量， 目前需要手动维护
         */
        var taskCount = 5;

        function checkDone() {
            if(--taskCount <= 0){
                resolve();
            }
            console.log(taskCount+"...");
        }

        gulp.src("*.html")
            .pipe(gulp.dest(distUrl))
            .on("end", checkDone);

        gulp.src("build/**/*.*")
            .pipe(gulp.dest(distUrl + "build"))
            .on("end", checkDone);

        gulp.src("images/**/*.*")
            .pipe(gulp.dest(distUrl + "images"))
            .on("end", checkDone);

        gulp.src("css/**/*.css")
            .pipe(gulp.dest(distUrl + "css"))
            .on("end", checkDone);

        gulp.src("js/**/*.*")
            .pipe(gulp.dest(distUrl + "js"))
            .on("end", checkDone);

    });

});

gulp.task("dist", ["clean", "publish", "move-publish"], function () {
    
    console.log("正在将需要的文件复制到dist目录");

    if(os.platform() === "darwin"){
        console.log("你是OSX系统，似乎可以做点什么");
        console.log("尝试打包压缩文件...");

        var z = spawn("zip", ["-r", "dist" + moment().format("YYYY年MM月DD日hhmmss") + ".zip", "-p",  "dist/"]);
        z.stdout.on("data", function (data) {
            console.log(data.toString());
        });

    }else{

        console.log("你并非osx系统，打包zip请手动针对dist目录进行压缩");

    }

});

gulp.task("build", ["dist"]);

gulp.task("auto", function(){
    browserSync.init({ server: "." });
    gulp.watch('scss/**/*.scss', ["scss"]);
    // gulp.watch("es2015/**/*.js", ["es2015"]);
    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch("js/*.js").on('change', browserSync.reload);
});

gulp.task("default", ["scss", "auto", "webpack"]);
