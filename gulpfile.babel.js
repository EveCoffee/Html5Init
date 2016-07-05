import gulp from "gulp";
import babel from "gulp-babel";
import sourcemaps from 'gulp-sourcemaps';
import plumber from "gulp-plumber";
import autoprefixer from "gulp-autoprefixer";
import cssmin from "gulp-cssmin";
// import scss from "gulp-sass";
import uglify from "gulp-uglify";
import browserSyncModule from "browser-sync";
import rimraf from "rimraf";
import sourceUpdate from "gulp-source-link-update";
import compass from "gulp-compass";
import path from "path";

let browserSync = browserSyncModule.create();

gulp.task('scss', function () {

    return gulp.src('scss/*.scss')
        .pipe( sourcemaps.init() )
        .pipe(plumber())
        .pipe(compass({
            project: path.join(__dirname, '.'),
            css: 'css',
            sass: 'scss'
        }))
        .on('error', function (error) {
            console.log(error.toString());
            this.emit('end');
        })
        // .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions', "IE 9"],
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
    gulp.watch("es2015/**/*.js", ["es2015"]);
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



gulp.task("default", ["scss", "auto", "es2015"]);