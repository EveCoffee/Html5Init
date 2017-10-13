import {exec, spawn, execSync, spawnSync} from "child_process";
import config from "./config";

const distUrl = config.distUrl,
      srcUrl  = config.srcUrl,
      buildUrl = config.buildUrl;

/**
 * 启动webpack或者webpack-dev-server
 */
var webpackFn = function (progressName, gulp) {

    var cmd = "",
        params = [];

    if(progressName === "webpack"){
        cmd = "node";
        params = ["./node_modules/webpack/bin/webpack", "-w", "true", "--color"]
    }else if(progressName === "webpack-dev-server"){
        cmd = "node";
        params = ["./node_modules/webpack-dev-server/bin/webpack-dev-server", "--color"]
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

    gulp.watch(`${srcUrl}/*.+(ts|js)`, function (event) {
        switch (event.type){
            case "deleted":
            case "added":
                console.log("监听到文件数量发生了改变，正在重启webpack.");
                packer.restart();
        }
    });

    gulp.watch("webpack.config*.js", function () {
        console.log("监听到webpack配置发生了改变，正在重启webpack...");
        packer.restart();
    })

};

export default {
    install(gulp){
        gulp.task("webpack", webpackFn.bind(this, "webpack", gulp));  
        gulp.task("server", webpackFn.bind(this, "webpack-dev-server"));
    }
}

