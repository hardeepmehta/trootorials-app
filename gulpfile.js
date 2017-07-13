var gulp      = require('gulp'),
    useref    = require('gulp-useref'),
    gulpif    = require('gulp-if'),
    uglify    = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    concat    = require('gulp-concat'),
    obfuscate = require('./obfuscate.js'),
    fs        = require('fs'),
    compressor = require('node-minify'),
    rename = require('gulp-rename'),
    gulpSequence = require('gulp-sequence'),
    templateCache = require('gulp-angular-templatecache'),
    rev    = require('gulp-rev'),
    collect = require('gulp-rev-collector'),
    merge = require('gulp-merge-json'),
    config = require('dotenv').config(),
    replace = require('gulp-replace'),
    nodemon = require('gulp-nodemon'),
    del = require('del');

gulp.task('clean', function () {
    return del([
        'dist/**/*'
    ]);
});

gulp.task('default', gulpSequence('clean' ));
