import sourcemaps from 'gulp-sourcemaps';
import scss from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import cssmin from "gulp-cssmin";
import px2rem from "gulp-pxtorem";

var enablePX2REM = false;

export default {
    
    /**
     * 是否启用px自动转换成rem
     */ 
    enablePX2REM(status){
        enablePX2REM = status;
    },
    
    install(gulp, browserSync){
        
        if(enablePX2REM){
            
            gulp.task('scss', function () {
                return gulp.src('scss/*.scss')
                    .pipe( sourcemaps.init() )
                    .on('error', function (error) {
                        console.log(error.toString());
                        this.emit('end');
                    })
                    .pipe(scss())
                    .pipe(px2rem({
                            rootValue: 100,
                            replace: true,
                            propWhiteList: [
                                'font', 'font-size', 'line-height', 'letter-spacing',
                                "width", "height",
                                "top", "left", "bottom", "right",
                                "margin", "margin-left", "margin-right", "margin-top", "margin-bottom",
                                "padding", "padding-left", "padding-right", "padding-top", "padding-bottom",
                                "transform",
                                "background", "background-size", "background-position", "background-position-y", "background-position-x"
                            ]
                        }, {
                            map: false
                        }
                    ))
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
            
        }else{
            
            gulp.task('scss', function () {
                return gulp.src('scss/*.scss')
                    .pipe( sourcemaps.init() )
                    .on('error', function (error) {
                        console.log(error.toString());
                        this.emit('end');
                    })
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
            
        }
        
        
    }
}