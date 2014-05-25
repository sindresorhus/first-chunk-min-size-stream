'use strict';
var assert = require('assert');
var fs = require('fs');
var concat = require('concat-stream');
var firstChunkMinSize = require('./index');

it('should should ensure the first chunk is minimum of a set size', function (cb) {
	var stream = fs.createReadStream('fixture', {highWaterMark: 1})
		.pipe(firstChunkMinSize({minSize: 7}));

	stream.once('data', function (data) {
		assert.strictEqual(data.toString(), 'unicorn');
	});

	stream.pipe(concat(function (data) {
		assert.deepEqual(data, fs.readFileSync('fixture'));
	}));

	stream.on('end', cb);
});

it('should should work with default `highWaterMark`', function (cb) {
	fs.createReadStream('fixture')
		.pipe(firstChunkMinSize({minSize: 7}))
		.pipe(concat(function (data) {
			assert.deepEqual(data, fs.readFileSync('fixture'));
			cb();
		}));
});
