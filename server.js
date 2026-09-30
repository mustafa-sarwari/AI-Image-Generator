const path = require('node:path');
const express = require('express');
require('dotenv').config({ path: path.join(__dirname, 'config/.env'), quiet: true });
const allowedModels = new Set(['stabilityai/stable-diffusion-xl-base-1.0', 'stabilityai/stable-diffusion-3-medium-diffusers']);
function createApp({ fetchImpl = fetch, token = process.env.HF_TOKEN || process.env.api_KEY } = {}) {
  const app = express();
  app.use(express.json({ limit: '16kb' }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.post('/api/generate-image', async (req, res) => {
    const { model, prompt, width = 512, height = 512 } = req.body;
    if (!allowedModels.has(model) || typeof prompt !== 'string' || !prompt.trim() || prompt.length > 1000 || ![432,512,768].includes(width) || ![432,512,768].includes(height)) {
      return res.status(400).json({ error: 'Choose a supported model, a prompt of 1–1000 characters, and valid dimensions.' });
    }
    if (!token) return res.status(503).json({ error: 'Configure HF_TOKEN in the backend environment before generating images.' });
    try {
      const response = await fetchImpl(`https://router.huggingface.co/hf-inference/models/${model}`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: prompt.trim(), parameters: { width, height } }), signal: AbortSignal.timeout(60000)
      });
      if (!response.ok) return res.status(502).json({ error: `The image provider returned status ${response.status}. Check model availability and token permissions.` });
      const type = response.headers.get('content-type') || '';
      if (!type.startsWith('image/')) return res.status(502).json({ error: 'The provider did not return an image.' });
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length > 20 * 1024 * 1024) return res.status(502).json({ error: 'The provider image is too large.' });
      res.set('Content-Type', type).set('Cache-Control', 'no-store').send(bytes);
    } catch { res.status(502).json({ error: 'Image generation timed out or the provider is unavailable. Please retry.' }); }
  });
  app.use((error, req, res, next) => res.status(error.status || 500).json({ error: error.status === 400 ? 'Invalid JSON request.' : 'Unable to process the request.' }));
  return app;
}
if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  createApp().listen(port, '127.0.0.1', () => console.log(`Image generator: http://localhost:${port}`));
}
module.exports = { createApp };
