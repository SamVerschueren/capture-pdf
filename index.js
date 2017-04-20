'use strict';
var fs = require('fs');
var path = require('path');
var tempfile = require('tempfile');
var objectAssign = require('object-assign');
var phantomBridge = require('phantom-bridge');
var Promise = require('pinkie-promise');

var a4format = {format: 'A4', orientation: 'portrait', border: '1cm'};

module.exports = function (url, opts) {
	opts = objectAssign({
		delay: 0
	}, opts, {dest: tempfile('.pdf')});

	opts.paperSize = opts.paperSize || a4format;

	if (/(^https?|\.html?$)/.test(url)) {
		opts.url = url;
	} else {
		opts.content = url;
	}

	if (/\.css$/.test(opts.css)) {
		opts.css = fs.readFileSync(opts.css, 'utf8');
	}

	var cp = phantomBridge(path.join(__dirname, 'stream.js'), [
		'--ignore-ssl-errors=true',
		'--local-to-remote-url-access=true',
		'--ssl-protocol=any',
		JSON.stringify(opts)
	]);

	cp.stderr.pipe(process.stdout);

	return new Promise(function (resolve, reject) {
		cp.on('error', function (err) {
			reject(err);
		});

		cp.on('close', function () {
			resolve(fs.readFileSync(opts.dest));
		});
	});
};
