"use strict";
const expect    = require('chai').expect;
const map       = require('../index');
const path      = require('path');
const Promise   = require('bluebird');

describe('fs-map', function() {
    var src = path.resolve(__dirname, 'resources');

    it('returns a promise', function() {
        expect(map(src)).to.be.instanceof(Promise);
    });

    it('can use a callback as second parameter', function(done) {
        map(src, function(err, data) {
            done();
        });
    });

    it('can use a callback as third parameter', function(done) {
        map(src, {}, function(err, data) {
            done();
        });
    });

    describe('defaults', function() {
        var data;

        beforeEach(function() {
            return map(src).then(function(result) {
                data = result;
            });
        });

        it('has three items', function() {
            expect(Object.keys(data).length).to.equal(3);
        });

        it('has file.txt as file', function() {
            expect(data[path.resolve(src, 'file.txt')].isFile()).to.be.true;
        });

        it('has dir/file2.txt as file', function() {
            expect(data[path.resolve(src, 'dir/file2.txt')].isFile()).to.be.true;
        });

        it('has dir as directory', function() {
            expect(data[path.resolve(src, 'dir')].isDirectory()).to.be.true;
        });

    });

    describe('relative paths', function() {
        var data;

        beforeEach(function() {
            return map(src, { absolutePaths: false }).then(function(result) {
                data = result;
            });
        });

        it('has three items', function() {
            expect(Object.keys(data).length).to.equal(3);
        });

        it('has file.txt as file', function() {
            expect(data['file.txt'].isFile()).to.be.true;
        });

        it('has dir/file2.txt as file', function() {
            expect(data['dir/file2.txt'].isFile()).to.be.true;
        });

        it('has dir as directory', function() {
            expect(data['dir'].isDirectory()).to.be.true;
        });

    });

    describe('limit depth', function() {
        var data;

        beforeEach(function() {
            return map(src, { absolutePaths: false, depth: 0 }).then(function(result) {
                data = result;
            });
        });

        it('has two items', function() {
            expect(Object.keys(data).length).to.equal(2);
        });

        it('has file.txt as file', function() {
            expect(data['file.txt'].isFile()).to.be.true;
        });

        it('does not have dir/file2.txt as file', function() {
            expect(data['dir/file2.txt']).to.be.undefined;
        });

        it('has dir as directory', function() {
            expect(data['dir'].isDirectory()).to.be.true;
        });

    });

    describe('filter type', function() {
        var data;

        beforeEach(function() {
            var filter = function(path, stats) {
                return stats.isDirectory();
            };
            return map(src, { absolutePaths: false, filter: filter }).then(function(result) {
                data = result;
            });
        });

        it('has one item', function() {
            expect(Object.keys(data).length).to.equal(1);
        });

        it('has dir as directory', function() {
            expect(data['dir'].isDirectory()).to.be.true;
        });

    });

    describe('filter path', function() {
        var data;

        beforeEach(function() {
            var filter = function(path, stats) {
                return /\.txt$/.test(path);
            };
            return map(src, { absolutePaths: false, filter: filter }).then(function(result) {
                data = result;
            });
        });

        it('has two items', function() {
            expect(Object.keys(data).length).to.equal(2);
        });

        it('has file.txt as file', function() {
            expect(data['file.txt'].isFile()).to.be.true;
        });

        it('has dir/file2.txt as file', function() {
            expect(data['dir/file2.txt'].isFile()).to.be.true;
        });

    });

});