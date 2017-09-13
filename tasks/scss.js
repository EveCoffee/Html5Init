import sourcemaps from 'gulp-sourcemaps';
import scss from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import cssmin from "gulp-cssmin";

var enablePX2REM = false;

export default {
    
    /**
     * 是否启用px自动转换成rem
     */ 
    enablePX2REM(status){
        enablePX2REM = true;
    },
    
    install(gulp, browserSync){
        
        if(enablePX2REM){
            
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