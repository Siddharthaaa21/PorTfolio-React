/**
 * api/server.mjs — local dev host for the agent function. Mirrors what an Azure
 * Function will do: POST /api/agent → stream protocol events as NDJSON (one JSON
 * event object per line). Vite proxies /api here in dev (see vite.config.js).
 *
 * Run:  npm run api   (loads .env.local if present, for GEMINI_API_KEY)
 */
import http from 'node:http';
import { streamAgentEvents } from './agent.mjs';

const PORT = Number(process.env.API_PORT) || 8787;

const server = http.createServer((req, res) => {
  // POST /api/agent → NDJSON event stream
  if (req.method === 'POST' && req.url === '/api/agent') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', async () => {
      let input = {};
      try { input = JSON.parse(body || '{}'); } catch { /* empty body ok */ }
      res.writeHead(200, {
        'content-type': 'application/x-ndjson; charset=utf-8',
        'cache-control': 'no-cache, no-transform',
        'x-accel-buffering': 'no', // don't buffer the stream (proxies)
      });
      try {
        for await (const ev of streamAgentEvents(input)) res.write(JSON.stringify(ev) + '\n');
      } catch (err) {
        console.error('[api] stream error:', err);
        res.write(JSON.stringify({ type: 'refusal', reason: 'The agent hit an error — please try again.' }) + '\n');
        res.write(JSON.stringify({ type: 'done' }) + '\n');
      }
      res.end();
    });
    return;
  }

  // GET /api/health → quick status (handy for debugging the key/model)
  if (req.method === 'GET' && req.url === '/api/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      keyConfigured: !!process.env.GEMINI_API_KEY,
    }));
    return;
  }

  res.writeHead(404);
  res.end('not found');
});

server.listen(PORT, () => {
  const state = process.env.GEMINI_API_KEY ? 'Gemini key loaded ✓' : 'NO key → deterministic fallback answers';
  console.log(`[api] agent server → http://localhost:${PORT}  (${state})`);
});
