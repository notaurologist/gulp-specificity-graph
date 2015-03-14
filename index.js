'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var open = require('opn');
var path = require('path');
var specificityGraph = require('specificity-graph');

module.exports = function (opts) {
  opts = opts || {};

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-specificity-graph', 'Streaming not supported'));
      return;
    }

    var css = file.contents.toString();
    var directory = opts.directory || 'specificity-graph';
    var openInBrowser = opts.openInBrowser || false;

    try {
      specificityGraph(directory, css, function (directory, openInBrowser) {
        if (openInBrowser) {
          open(path.join(directory, 'index.html'));
        } else {
          console.log('specificity-graph files created in ' + directory);
        }
      });
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-specificity-graph', err, {fileName: file.path}));
    }

    cb();
  });
};
