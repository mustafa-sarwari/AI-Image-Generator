const path = require("node:path");
const express = require("express");
require("dotenv").config({
  path: path.join(__dirname, "config/.env"),
  quiet: true,
});
const { createApp: secureApp, HttpError } = require("./server/http.cjs");
const models = new Set([
  "stabilityai/stable-diffusion-xl-base-1.0",
  "stabilityai/stable-diffusion-3-medium-diffusers",
]);
function createApp({
  database = path.join(__dirname, ".data/demo.sqlite"),
  fetchImpl = fetch,
  token = process.env.HF_TOKEN || process.env.api_KEY,
  rateLimit = true,
} = {}) {
  const provider = express();
  provider.use(express.json({ limit: "16kb" }));
  provider.post("/api/generate-image", async (req, res, next) => {
    const ctx = req.domainContext;
    try {
      ctx.requireUser();
      const { model, prompt, width = 512, height = 512 } = req.body || {};
      if (
        !models.has(model) ||
        typeof prompt !== "string" ||
        !prompt.trim() ||
        prompt.length > 1000 ||
        ![432, 512, 768].includes(width) ||
        ![432, 512, 768].includes(height)
      )
        throw new HttpError(
          400,
          "Choose a supported model, a prompt of 1–1000 characters, and valid dimensions.",
        );
      if (!token)
        throw new HttpError(
          503,
          "Configure HF_TOKEN in the backend environment.",
        );
      const started = Date.now();
      let response;
      try {
        response = await fetchImpl(
          "https://router.huggingface.co/hf-inference/models/" + model,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: prompt.trim(),
              parameters: { width, height },
            }),
            signal: AbortSignal.timeout(60000),
          },
        );
      } catch {
        throw new HttpError(
          502,
          "Image generation timed out or the provider is unavailable.",
        );
      }
      if (!response.ok)
        throw new HttpError(
          502,
          "The provider request failed. Check model availability and token permissions.",
        );
      const type = response.headers.get("content-type") || "";
      if (!type.startsWith("image/") || !response.body)
        throw new HttpError(502, "The provider did not return an image.");
      if (
        Number(response.headers.get("content-length") || 0) >
        20 * 1024 * 1024
      )
        throw new HttpError(502, "The provider image is too large.");
      const reader = response.body.getReader(),
        parts = [];
      let size = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.length;
          if (size > 20 * 1024 * 1024) {
            await reader.cancel();
            throw new HttpError(502, "The provider image is too large.");
          }
          parts.push(Buffer.from(value));
        }
      } finally {
        reader.releaseLock();
      }
      if (!size)
        throw new HttpError(502, "The provider returned an empty image.");
      ctx.saveRecord(
        "generations",
        {
          prompt: prompt.trim(),
          model,
          width,
          height,
          bytes: size,
          durationMs: Date.now() - started,
        },
        ctx.user.id,
      );
      res
        .set("Content-Type", type)
        .set("Cache-Control", "no-store")
        .send(Buffer.concat(parts));
    } catch (error) {
      next(error);
    }
  });
  provider.use((error, req, res, next) =>
    res
      .status(error.status || 500)
      .json({
        error: error.status ? error.message : "Unable to process the request.",
      }),
  );
  return secureApp({
    root: path.join(__dirname, "public"),
    database,
    workspace: require("./server/workspace.cjs"),
    rateLimit,
    extraRoute: async (req, res, url, ctx) => {
      if (url.pathname !== "/api/generate-image") return false;
      if (req.method !== "POST")
        throw new HttpError(405, "Method not allowed.");
      ctx.requireUser();
      req.domainContext = ctx;
      await new Promise((resolve) => {
        res.once("finish", resolve);
        res.once("close", resolve);
        provider(req, res);
      });
      return true;
    },
  });
}
if (require.main === module)
  createApp().listen(Number(process.env.PORT || 3000), "127.0.0.1", () =>
    console.log("Image generator: http://localhost:3000"),
  );
module.exports = { createApp };
