import fs from 'node:fs';
import test from 'ava';
import getStream from 'get-stream';
import FirstChunkMinSize from './index.js';

test('ensure the first chunk is minimum of a set size', async t => {
	t.plan(2);

	const stream = fs.createReadStream('fixture', {highWaterMark: 1})
		.pipe(new FirstChunkMinSize({minSize: 7}));

	stream.once('data', data => {
		t.is(data.toString(), 'unicorn');
	});

	const buf = await getStream.buffer(stream);
	t.deepEqual(buf, fs.readFileSync('fixture'));
});

test('work with default `highWaterMark`', async t => {
	const stream = fs.createReadStream('fixture')
		.pipe(new FirstChunkMinSize({minSize: 7}));

	const buf = await getStream.buffer(stream);
	t.deepEqual(buf, fs.readFileSync('fixture'));
});
