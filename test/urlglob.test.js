const test = require('tap').test
const urlglob = require('..')

test('urlglob', function (t) {
  t.same(str(urlglob('*')), str(/^.*?\/?$/), 'should match all')
  t.same(str(urlglob('\\*lol.com\\*')), str(/^\*lol\.com\*\/?$/), 'should escape stuff')

  t.ok(urlglob('/api', '/api/'), 'should add final slash')
  t.ok(urlglob('/food/*/cheese', '/food/sandwich/cheese'), 'should match cheese sandwich')
  t.ok(urlglob('/food/*/cheese', '/food/pizza/cheese/'), 'should match cheese pizza')
  t.ok(urlglob('/star/\\*', '/star/*'), 'should match literal star')
  t.notOk(urlglob('/star/\\*', '/star/anything'), 'should not match anything')
  t.ok(urlglob.inCache('*'), 'should be in cache')
  t.ok(urlglob.inCache('/star/\\*'), 'should be in cache')

  t.notOk(urlglob('/api/v2/*?.json', '/api/v2/all/users.json'), 'should not match')
  t.ok(urlglob('/api/v2/*?.json', '/api/v2/users.json'), 'should match')

  console.dir(urlglob.cache.keys())

  t.end()
})

test('test with more star', function(t) {
  t.ok(urlglob('http://*/*', 'http://example.org/foo/bar.html'))
  t.ok(urlglob('http://*/foo*', 'http://example.com/foo/bar.html'))
  t.ok(urlglob('http://*/foo*', 'http://www.google.com/foo'))
  t.ok(urlglob('https://*.google.com/foo*bar', 'https://www.google.com/foo/baz/bar'))
  t.ok(urlglob('https://*.google.com/foo*bar', 'https://docs.google.com/foobar'))
  t.ok(urlglob('http://127.0.0.1/*', 'http://127.0.0.1/'))
  t.ok(urlglob('http://127.0.0.1/*', 'http://127.0.0.1/foo/bar.html'))

  t.ok(urlglob('http://*/foo\\**', 'http://www.google.com/foo*'))
  t.ok(urlglob('http://*/foo\\**\\*', 'http://www.google.com/foo*/bar*/'))
  t.ok(urlglob('http://*/foo\\**\\**?.js', 'http://www.google.com/foo*/path/bar*index.js'))
  t.end()
})

function str(thing) {
  return thing.toString()
}
