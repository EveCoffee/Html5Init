import moment from "moment";
import del from "del";
import config from "./config";
import {exec, spawn, execSync, spawnSync} from "child_process";
import os from "os";
import cssmin from "gulp-cssmin";
import uglify from "gulp-uglify";
import ProgressBar from 'progress';

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
                
                var bar;
        
                /**
                 * 异步文件拷贝的任务数量，由addTask方法自动维护
                 */
                var taskCount = 0;
        
                /**
                 * 任务完成后自动触发，之后自动跳出
                 */ 
                function checkDone() {
                    if(--taskCount <= 0){
                        bar.completed = true;
                        //resolve();
                        resolve();

                    }
                    // console.log(taskCount+"...");

                    bar && bar.tick();

                }
                
                /**
                 * 增加打包任务。 使用示例参考下方文件
                 * @param source {String} 合法的源路径文件
                 * @param target {String} 合法的目标目录。 备注： 可以不存在，会自动新建
                 * @param middleTasks {Function[]} 中间件任务
                 */ 
                function addTask(source, target, middleTasks=[]){
                    taskCount++;
                    let task = gulp.src(source);
                    for(let middleTask of middleTasks){
                        task.pipe(middleTask);
                    }
                    task.pipe(gulp.dest(target));
                    task.on("end", checkDone);
                    
                }
                
                setTimeout(() => {
                    bar = new ProgressBar('  :bar :percent', {
                        width: 60,
                        total: taskCount,
                        incomplete: '░',
                        complete: '█',
                    });
                }, 0);
                
                
                addTask("*.html", distUrl);
                
                addTask("build/**/*.*", distUrl + "build");

                addTask("fonts/**/*.*", distUrl + "fonts");
                
                addTask("images/**/*.*", distUrl + "images");
                
                // TODO: cssmin并没有生效，奇怪
                addTask("css/**/*.css", distUrl + "css", [cssmin()]);
                
                addTask("js/**/*.js", distUrl + "js", [uglify()]);
        
            });
        
        });
        
        gulp.task("dist-release", function(){
            
        });
        
        gulp.task("dist", ["clean", "publish", "move-publish"], function () {
            
            console.log("已经将需要的文件复制到dist目录");
        
            // if(os.platform() === "darwin"){
            //     console.log("你是OSX系统，似乎可以做点什么");
            //     console.log("尝试打包压缩文件...");
        
            //     var z = spawn("zip", ["-r", "dist" + moment().format("YYYY年MM月DD日hhmmss") + ".zip", "-p",  "dist/"]);
            //     z.stdout.on("data", function (data) {
            //         console.log(data.toString());
            //     });
        
            // }else{
        
            //     console.log("你并非osx系统，打包zip请手动针对dist目录进行压缩");
        
            // }
        
        });
        
        gulp.task("build", ["dist"]);
    }
}
