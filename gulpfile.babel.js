import gulp from "gulp";
import babel from "gulp-babel";
import sourcemaps from 'gulp-sourcemaps';
import plumber from "gulp-plumber";
import autoprefixer from "gulp-autoprefixer";
import cssmin from "gulp-cssmin";
import scss from "gulp-sass";
import uglify from "gulp-uglify";
import browserSyncModule from "browser-sync";
import rimraf from "rimraf";
import sourceUpdate from "gulp-source-link-update";
//import compass from "gulp-compass";
import path from "path";

import {exec, spawn, execSync} from "child_process";
import compact from "lodash/compact";


let browserSync = browserSyncModule.create();

gulp.task('scss', function () {

    return gulp.src('scss/*.scss')
        .pipe( sourcemaps.init() )
        .pipe(plumber())
        .pipe(scss())
        .on('error', function (error) {
            console.log(error.toString());
            this.emit('end');
        })
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

gulp.task("es2015", function(){
    return gulp.src("es2015/**/*.js")
        .pipe( sourcemaps.init() )
        .pipe(plumber())
        .pipe(babel())
        //.pipe(uglify())
        //.pipe( sourcemaps.write('./maps'))
        .pipe( gulp.dest('js/') );
});

gulp.task("watch", function(){
    browserSync.init({ server: "." });
    gulp.watch('less/**/*.less', ["less"]);
    gulp.watch("es2015/**/*.js", ["es2015"]);
});

gulp.task("auto", function(){
    browserSync.init({ server: "." });
    gulp.watch('scss/**/*.scss', ["scss"]);
    // gulp.watch("es2015/**/*.js", ["es2015"]);
    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch("js/*.js").on('change', browserSync.reload);
});

// 打包
gulp.task("build",["scss"], function () {

	var distUrl = "dist";

	function done() {
		// 打包其他文件
		gulp.src("*.html")
            .pipe(sourceUpdate())
			.pipe(gulp.dest(distUrl));

		gulp.src("css/*.css")
            .pipe(cssmin())
			.pipe(gulp.dest(`${distUrl}/css/`));

		gulp.src("images/*")
			.pipe(gulp.dest(`${distUrl}/images/`));

		gulp.src("js/*")
            // .pipe(uglify())
			.pipe(gulp.dest(`${distUrl}/js/`))
	}


	// 清空文件夹
	rimraf(distUrl, done);
});

gulp.task("default", ["scss", "auto", "webpack:start"]);

gulp.task("webpack:start", function () {
    const _webpack = spawn("webpack");

    _webpack.stdout.on("data", (data) => {
        console.log(data.toString());
    });
});

gulp.task("webpack:restart", function () {

    gulp.start("webpack:stop", function () {
        gulp.start("webpack:start", function () {
            console.log("webpack已经重新启动...");
        });

    });
});

gulp.task("webpack:stop", function () {
    var result = getProgressIdByName("webpack", "node");

    console.log(`找到${result.length}个进程, 正在准备杀死进程...`);
    console.log("正在终止webpack...");

    killProgressById(result);
});

/**
 * 查找进程ID
 * @param name 进程名字, 作为 grep 关键字进行过滤
 * @param args 需要再次过滤的字符串或者字符串数组
 * @return String[] 返回符合条件的进程id
 */
function getProgressIdByName(name, args) {

    args = typeof args === "string" ? [args] : [];

    var stdOut = execSync(`ps | grep '${name}'`).toString();
    var results = stdOut.split("\n");
    results = results.filter(out => {

        if(args){
            // 根据传入参数进行过滤
            return args.every(arg => {
                return out.indexOf(arg) !== -1;
            });
        }else{
            return true;
        }


    }).map(out => {

        // 提取出进程id
        var r = /\d+/.exec(out);

        if(r && r.length === 1){
            return r[0];
        }else{
            return null;
        }

    });

    return compact(results);

}

/**
 * 通过id杀死指定进程
 * @param id String||String[] 进程id
 */
function killProgressById(id){
    id = typeof id === "string" ? [id] : id;
    id.forEach((_id) => {
        execSync(`kill ${id}`);
    });

}