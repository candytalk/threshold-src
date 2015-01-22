var connect = require('gulp-connect');
var config = require('../gulpconfig');

module.exports = function () {
  connect.server({
    root: config.dest,
    port: 8000
  });
};
