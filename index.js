'use strict';
var util = require('util');
var Transform = require('stream').Transform;

util.inherits(FirstChunkMinSizeStream, Transform);

function FirstChunkMinSizeStream(options) {
	if (!(this instanceof FirstChunkMinSizeStream)) {
		return new FirstChunkMinSizeStream(options);
	}

	if (typeof options.minSize !== 'number') {
		throw new Error('minSize option required');
	}

	Transform.call(this, options);

	this._firstChunk = true;
	this._minSize = options.minSize;
}

FirstChunkMinSizeStream.prototype._transform = function (chunk, enc, cb) {
	if (this._firstChunk) {
		this._firstChunk = false;
		this._buffer = chunk;
		cb();
		return;
	}

	if (this._buffer.length < this._minSize) {
		this._buffer = Buffer.concat([this._buffer, chunk]);
		cb();
		return;
	}

	if (this._buffer.length >= this._minSize) {
		this.push(this._buffer);
		this._buffer = false;
	}

	this.push(chunk);
	cb();
};

FirstChunkMinSizeStream.prototype._flush = function (cb) {
	if (this._buffer) {
		this.push(this._buffer);
	}

	cb();
};

module.exports = FirstChunkMinSizeStream;
