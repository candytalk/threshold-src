var path = require('path');

var src = path.join(__dirname, 'src/')
  , dest = path.join(__dirname, 'dest/');


module.exports = {
  src: src,
  dest: dest,
  style: {
    src: src + 'styles/sass_entry.scss',
    vendor: src + 'stylesheets/vendor/**/*.css',
    dest: dest + 'css'
  },
  browserify: {
    // Enable source maps
    debug: true,
    bundleConfigs: [
      {
        entries: src + 'scripts/index.js',
        dest: dest + 'javascript/',
        outputName: 'bundle.js'
      }
    ]
  },
  files: [
    src + "index.html",
    src + "font/**/*.{ttf,woff,eof,svg}"
  ]
};
