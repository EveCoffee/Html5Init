import moment from "moment";
import del from "del";
import config from "./config";
import {exec, spawn, execSync, spawnSync} from "child_process";
import os from "os";

const distUrl = config.distUrl,
      srcUrl  = config.srcUrl,
      buildUrl = config.buildUrl;

export default {
    install(gulp){
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
    }
}
