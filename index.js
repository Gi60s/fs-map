"use strict";
const fs        = require('fs');
const path      = require('path');
const Promise   = require('bluebird');

const defaultOptions = {
    absolutePaths: true,
    depth: -1,
    filter: function(path, stats) { return true }
};
const readDir = Promise.promisify(fs.readdir);
const stat = Promise.promisify(fs.stat);

/**
 * Get a map of file system paths to stat objects.
 * @param {string} directoryPath
 * @param {object} [config]
 * @param {function} [callback]
 * @returns {Promise, undefined}
 */
module.exports = function(directoryPath, config, callback) {
    var options;
    var promise;

    // determine which arguments were passed in
    if (arguments.length === 1) {
        config = {};
    } else if (arguments.length === 2 && typeof arguments[1] === 'function') {
        callback = arguments[1];
        config = {};
    }

    // build the options object
    options = Object.assign({}, defaultOptions, config, { startPath: directoryPath });

    // verify argument types
    if (typeof directoryPath !== 'string') throw Error('Parameter "directoryPath" must be a string.');
    if (isNaN(options.depth)) throw Error('Configuration option "depth" must be a number.');
    if (typeof options.filter !== 'function') throw Error('Configuration option "filter" must be a function.');

    // call the mapping function
    promise = map(directoryPath, options.depth, options);

    // if no callback then return a promise
    if (typeof callback !== 'function') return promise;

    // call the callback
    promise
        .then(function(value) {
            callback(null, value);
        }, function(reason) {
            callback(reason, null);
        });
};



function map(directoryPath, depth, options) {
    return readDir(directoryPath)
        .then(function(fileNames) {
            var promises = [];
            var result = {};

            fileNames.forEach(function(fileName) {
                var filePath = path.resolve(directoryPath, fileName);
                var promise = stat(filePath)
                    .then(function(stats) {
                        var key;

                        if (options.filter(filePath, stats)) {
                            key = options.absolutePaths ? filePath : path.relative(options.startPath, filePath);
                            result[key] = stats;
                        }

                        if (stats.isDirectory() && depth !== 0) {
                            return map(filePath, depth - 1, options)
                                .then(function(data) {
                                    Object.assign(result, data);
                                });
                        }
                    })
                    .catch(noop);
                promises.push(promise);
            });

            return Promise.all(promises)
                .then(function() {
                    return result;
                });
        });
}

function noop() {}