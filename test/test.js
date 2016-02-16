import test from 'ava';
import isPDF from 'is-pdf';
import textract from 'textract';
import m from '../';

function extract(buffer) {
	return new Promise((resolve, reject) => {
		textract.fromBufferWithMime('application/pdf', buffer, (err, text) => {
			if (err) {
				reject(err);
				return;
			}

			resolve(text);
		});
	});
}

test('generate pdf', async t => {
	t.true(isPDF(await m('<div>foo</div>')));
});

test('have a `delay` option', async t => {
	const now = new Date();

	await m('<div>foo</div>', {delay: 2});

	t.true((new Date()) - now > 2000);
});

test('write content', async t => {
	const buffer = await m('<div>foo</div>');

	t.is(await extract(buffer), 'foo');
});

test('write local file content', async t => {
	const buffer = await m('fixtures/fixture.html');

	t.is(await extract(buffer), 'Foo');
});

test('write url content', async t => {
	const buffer = await m('http://todomvc.com/');
	const text = await extract(buffer);

	t.true(text.indexOf('Helping you select an MV* framework') >= 0);
});

test('have a `css` property', async t => {
	const buffer = await m('fixtures/fixture.html', {css: 'div:after { content: \'Bar\'; }'});

	t.is(await extract(buffer), 'FooBar');
});

test('have a `css` file property', async t => {
	const buffer = await m('fixtures/fixture.html', {css: 'fixtures/fixture.css'});

	t.is(await extract(buffer), 'FooBaz');
});
