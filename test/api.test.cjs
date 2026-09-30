const { test } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { createApp } = require('../server.js');
test('returns provider image bytes, validates input, and handles upstream failures', async () => {
  let fail = false;
  let sent;
  const server = createApp({ token: 'test-token', fetchImpl: async (url, options) => {
    sent = JSON.parse(options.body);
    return fail ? new Response('{}', { status: 503 }) : new Response(new Uint8Array([137,80,78,71]), { headers: { 'Content-Type': 'image/png' } });
  } }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  const url = `http://127.0.0.1:${server.address().port}/api/generate-image`;
  const request = body => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  try {
    assert.equal((await request({})).status, 400);
    const body = { model: 'stabilityai/stable-diffusion-xl-base-1.0', prompt: 'A mountain', width: 512, height: 512 };
    const response = await request(body); assert.equal(response.status, 200); assert.equal(response.headers.get('content-type'), 'image/png'); assert.equal((await response.arrayBuffer()).byteLength, 4); assert.equal(sent.inputs, body.prompt);
    fail = true; assert.equal((await request(body)).status, 502);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
