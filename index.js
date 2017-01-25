'use strict';
const Transform = require('stream').Transform;

class FirstChunkMinSizeStream extends Transform {
	constructor(opts) {
		opts = opts || {};

		if (typeof opts.minSize !== 'number') {
			throw new Error('`minSize` option required');
		}

		super(opts);

		this._firstChunk = true;
		this._minSize = opts.minSize;
	}
	_transform(chunk, enc, cb) {
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
	}
	_flush(cb) {
		if (this._buffer) {
			this.push(this._buffer);
		}

		cb();
	}
}

module.exports = FirstChunkMinSizeStream;
