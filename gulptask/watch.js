var gulp = require('gulp');
var config = require('../gulpconfig');

module.exports = function () {
    gulp.watch(config.src + '/styles/**/*.scss', ['sass']);
};
