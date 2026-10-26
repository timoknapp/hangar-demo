import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { request as httpRequest } from 'node:http';
import { createApp, tasks } from './server.js';

async function request(t, path, options) {
  const server = createApp();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  return new Promise((resolve, reject) => {
    const req = httpRequest({ host: '127.0.0.1', port: server.address().port, path, ...options }, res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { body += chunk; });
      res.on('error', reject);
      res.on('end', () => resolve({
        status: res.statusCode,
        headers: { get: name => res.headers[name] },
        text: async () => body,
        json: async () => JSON.parse(body),
      }));
    });
    req.on('error', reject);
    req.end();
  });
}

test('GET /api/tasks returns the synthetic fixture without caching', async t => {
  const res = await request(t, '/api/tasks');
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /application\/json/);
  assert.equal(res.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await res.json(), tasks);
});
test('GET / returns a readable HTML page', async t => {
  const res = await request(t, '/');
  assert.equal(res.status, 200);
  assert.match(await res.text(), /<h1>Hangar demo<\/h1>/);
  assert.match(res.headers.get('content-security-policy'), /default-src 'none'/);
});
test('unknown path returns JSON 404', async t => {
  const res = await request(t, '/missing');
  assert.equal(res.status, 404);
  assert.deepEqual(await res.json(), { error: 'Not found' });
});
test('mutating methods are not supported', async t => {
  const res = await request(t, '/api/tasks', { method: 'POST' });
  assert.equal(res.status, 405);
  assert.equal(res.headers.get('allow'), 'GET');
});
test('unsupported query is rejected', async t => {
  const res = await request(t, '/api/tasks?unknown=1');
  assert.equal(res.status, 404);
});
