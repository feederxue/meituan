var gulp = require('gulp');
var webserver = require('gulp-webserver'); //开启服务
var fs = require('fs');
var path = require('path');
var scss = require('gulp-sass'); //编辑scss
var uglify = require('gulp-uglify'); //压缩js
// console.log(gulp);

//开启服务
gulp.task('server', function() {
    return gulp.src('./src/')
        .pipe(webserver({
            port: 8080,
            host: 'localhost',
            liverLoad: true,
            middleware: [function(req, res, next) {
                if (req.url === '/favicon.ico') {
                    res.end('error')
                    return;
                }
                var pathname = require('url').parse(req.url).pathname;
                if (pathname === '/api/') {
                    console.log(2);
                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }
            }]
        }))
})


//scss
gulp.task('scss', function() {
    return gulp.src('./src/scss/*.{scss,css}')
        .pipe(scss())
        .pipe(gulp.dest('./src/scss/minscss'))
})

//监听
gulp.task('watch', function() {
    return gulp.watch('./src/scss/*.{scss,css}', gulp.series('scss'));
})

//js
gulp.task('minjs', function() {
    return gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./src/js/minjs'))
})

gulp.task('default', gulp.series('scss', 'watch', 'minjs'));