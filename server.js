import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';

export const tasks = Object.freeze([
  Object.freeze({ id: 1, title: 'Read the factory guide', status: 'todo', createdAt: '2026-01-01T10:00:00Z' }),
  Object.freeze({ id: 2, title: 'Review a pull request', status: 'done', createdAt: '2026-01-02T10:00:00Z' }),
]);

export function createApp() {
  return createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.method !== 'GET') {
      res.writeHead(405, { Allow: 'GET', 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
    if (url.pathname === '/health' && url.search === '') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ status: 'ok' }));
    }
    if (url.pathname === '/api/tasks' && url.search === '') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(tasks));
    }
    if (url.pathname === '/' && url.search === '') {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Security-Policy': "default-src 'none'; base-uri 'none'; frame-ancestors 'none'",
      });
      return res.end('<!doctype html><html lang="en"><meta charset="utf-8"><title>Hangar demo</title><h1>Hangar demo</h1><p>A read-only board for a software factory demonstration.</p><ul><li>Read the factory guide — todo</li><li>Review a pull request — done</li></ul><p><a href="/api/tasks">JSON task list</a></p></html>');
    }
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be 1–65535');
  const server = createApp();
  server.listen(port, '127.0.0.1', () => console.log(`Hangar demo: http://127.0.0.1:${port}`));
}
