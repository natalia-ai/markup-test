'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var cssnano      = require('gulp-cssnano'); 
var rename       = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var gulpversion = '3';

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'])
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(cssnano()) 
		.pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});

// Move the javascript files into our /src/js folder
gulp.task('js', function () {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
        .pipe(gulp.dest("src/js"))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
if (gulpversion == 3) {
    gulp.task('serve', ['sass'], function () {

        browserSync.init({
            server: "./src"
        });

        gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], ['sass']);
        gulp.watch("src/*.html").on('change', browserSync.reload);
    });

    gulp.task('default', ['js', 'serve']);
}

if (gulpversion == 4) {
    gulp.task('serve', function () {

        browserSync.init({
            server: "./src"
        });

        gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], gulp.parallel('sass'));
        gulp.watch("src/*.html").on('change', browserSync.reload);
    });

    gulp.task('default', gulp.parallel('js', 'serve', 'sass'));
};