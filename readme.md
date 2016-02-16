# capture-pdf [![Build Status](https://travis-ci.org/SamVerschueren/capture-pdf.svg?branch=master)](https://travis-ci.org/SamVerschueren/capture-pdf)

> Capture html in a pdf buffer


## Install

```
$ npm install --save capture-pdf
```


## Usage

```js
const fs = require('fs');
const pdf = require('capture-pdf');

pdf('<strong>Foo Bar</strong>').then(buffer => {
	fs.writeFileSync('foobar.pdf', buffer);
});

pdf('foo.html', {css: 'bar { display: none; }'}).then(buffer => {
	fs.writeFileSync('foo.pdf', buffer);
});

pdf('http://yeoman.io', {delay: 5}).then(buffer => {
	fs.writeFileSync('yeoman.pdf', buffer);
});
```


## API

### pdf(input, [options])

#### input

Type: `string`

Specify some html, the path to an html file or a website.

#### options

##### delay

Type: `number` *(seconds)*  
Default: `0`

Delay capturing the website. Useful when the site does things after load that you want to capture.

##### css

Type: `string`

Apply custom CSS to the webpage. Specify some CSS or the path to a CSS file.

##### paperSize

Type: `object`  
Default: `{format: 'A4', orientation: 'portrait', border: '1cm'}`

[Size](https://github.com/ariya/phantomjs/wiki/API-Reference-WebPage#webpage-paperSize) of the web page.


## License

MIT © [Sam Verschueren](https://github.com/SamVerschueren)
