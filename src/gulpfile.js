const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

function scssTask() {
    return src('App.css', { sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([cssnano()]))
        .pipe(dest('dist', { sourcemaps: '.' }))
}


function jsTask() {
    return src('App.js', { sourcemaps: true })
        .pipe(terser())
        .pipe(dest('dist', { sourcemaps: '.' }))
}

function browserSyncServe(cb) {
    browsersync.init({
        server: {
            baseDir: '.'
        }
    })
    cb();
}

function browsersyncReload(cb) {
    browsersync.reload()
    cb();
}


function watchTask() {
    watch('*.html', browsersyncReload)
    watch(['App.css', 'App.js'], series(scssTask, jsTask, browsersyncReload))
}


exports.default = series(
    scssTask,
    jsTask,
    browserSyncServe,
    watchTask
)

exports.build = series(scssTask, jsTask)
