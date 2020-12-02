# first-chunk-min-size-stream

> Set the minimum size of the first chunk in a stream

Useful if you want to do something to the first chunk and need it to be of a certain size.

## Install

```
$ npm install --save first-chunk-min-size-stream
```

## Usage

```js
const fs = require('fs');
const FirstChunkMinSize = require('first-chunk-min-size-stream');

fs.createReadStream('unicorn.txt', {highWaterMark: 1}) // `highWaterMark: 1` means it will only read 1 byte at the time
	.pipe(new FirstChunkMinSize({minSize: 7}))
	.once('data', data => {
		console.log(data.length);
		//=> 7
	});
```

## API

### firstChunkMinSize(options)

#### options

Type: `object`

##### minSize

*Required*\
Type: `number`

Minimum size of the first chunk.
