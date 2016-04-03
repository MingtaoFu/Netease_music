/**
 * The snippet is from https://github.com/kevva/download
 * Something modified
 */

!function () {
  'use strict';
  var path = require('path')
  var fs = require('fs')
  var EventEmitter = require('events').EventEmitter
  var valid = require('url-valid')
  var eachAsync = require('each-async');

  /**
   * download
   * @param {String | Array} url
   * @param {String} dest
   * @param {String} name
   * return {EventEmitter}
   */
  module.exports = function (url, dest, name, opts) {
    url = Array.isArray(url) ? url : [url];
    var emitter = new EventEmitter();
    eachAsync(url, function (url, i, done) {
      var file = path.join(dest, name);
      var stream = fs.createWriteStream(file);
      valid(url).on('data', function (err, chunk) {
        stream.write(chunk);
        emitter.emit('data', err, chunk);
      }).on('end', function () {
        stream.on('close', function () {
          emitter.emit('close', null, url);
          done();
        });
        stream.end();
      });
    }, function () {
      emitter.emit('done');
    });
    return emitter;
  };
}();
