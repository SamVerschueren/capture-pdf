/* global phantom, document, window */
'use strict';
var system = require('system');				// eslint-disable-line import/no-extraneous-dependencies
var page = require('webpage').create();		// eslint-disable-line import/no-extraneous-dependencies

var opts = JSON.parse(system.args[1]);

function formatTrace(trace) {
	var src = trace.file || trace.sourceURL;
	var fn = (trace.function ? ' in function ' + trace.function : '');
	return ' → ' + src + ' on line ' + trace.line + fn;
}

console.log = console.error = function () {
	system.stderr.writeLine([].slice.call(arguments).join(' '));
};

phantom.onError = function (err, trace) {
	console.error('PHANTOM ERROR: ' + err + formatTrace(trace[0]));
	phantom.exit(1);
};

page.onError = function (err, trace) {
	console.error('WARN: ' + err + formatTrace(trace[0]));
};

page.open(opts.url || 'file://' + page.libraryPath + '/index.html', function (status) {
	if (status === 'fail') {
		console.error('Couldn\'t load url: ' + opts.url);
		phantom.exit(1);
		return;
	}

	if (opts.content) {
		page.evaluate(function (content) {
			var body = document.querySelector('body');
			body.innerHTML = content;
		}, opts.content);
	}

	var paperSize = opts.paperSize || page.paperSize;

	if (opts.header) {
		paperSize.header = {
			height: '1cm',
			contents: phantom.callback(function (pageNum, numPages) {
				return opts.header.replace(/{{pageNum}}/g, pageNum).replace(/{{numPages}}/g, numPages);
			})
		};
	}

	if (opts.footer) {
		paperSize.footer = {
			height: '1cm',
			contents: phantom.callback(function (pageNum, numPages) {
				return opts.footer.replace(/{{pageNum}}/g, pageNum).replace(/{{numPages}}/g, numPages);
			})
		};
	}

	page.paperSize = paperSize;

	page.evaluate(function (css) {
		var bgColor = window
			.getComputedStyle(document.body)
			.getPropertyValue('background-color');

		if (!bgColor || bgColor === 'rgba(0, 0, 0, 0)') {
			document.body.style.backgroundColor = 'white';
		}

		if (css) {
			var el = document.createElement('style');
			el.appendChild(document.createTextNode(css));
			document.head.appendChild(el);
		}
	}, opts.css);

	window.setTimeout(function () {
		page.render(opts.dest);
		page.close();
		phantom.exit();
	}, opts.delay * 1000);
});
