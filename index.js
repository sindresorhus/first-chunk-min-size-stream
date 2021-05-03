import {Transform as TransformStream} from 'node:stream';

// TODO: Use private class fields here when ESLint supports it.

export default class FirstChunkMinSizeStream extends TransformStream {
	constructor(options = {}) {
		if (typeof options.minSize !== 'number') {
			throw new TypeError('`minSize` option required');
		}

		super(options);

		this._isFirstChunk = true;
		this._minimumSize = options.minSize;
	}

	_transform(chunk, encoding, callback) {
		if (this._isFirstChunk) {
			this._isFirstChunk = false;
			this._buffer = chunk;
			callback();
			return;
		}

		if (this._buffer.length < this._minimumSize) {
			this._buffer = Buffer.concat([this._buffer, chunk]);
			callback();
			return;
		}

		if (this._buffer.length >= this._minimumSize) {
			this.push(this._buffer);
			this._buffer = false;
		}

		this.push(chunk);
		callback();
	}

	_flush(callback) {
		if (this._buffer) {
			this.push(this._buffer);
		}

		callback();
	}
}
