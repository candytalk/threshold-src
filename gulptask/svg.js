var gulp = require('gulp');
var config = require('../gulpconfig');

module.exports = function () {
    gulp.src(config.svg.vendor)
        .pipe(gulp.dest(config.svg.dest));

    return gulp;
};
