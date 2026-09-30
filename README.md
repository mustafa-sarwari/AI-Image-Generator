# AI Image Generator — Prototype

A JavaScript and Express prototype for a prompt-based image generation interface. The browser UI is served from `public/`; the backend is intended to call a Hugging Face inference endpoint.

## Stack

HTML, CSS, JavaScript, Node.js, Express, dotenv, and node-fetch.

## Local setup

```bash
git clone https://github.com/mustafa-sarwari/AI-Image-Generator.git
cd AI-Image-Generator
npm install
```

Configure your local `config/.env` with the variable read by the current server:

```dotenv
api_KEY=your_hugging_face_token
```

Keep credentials local and out of commits.

```bash
npm start
```

The server listens at `http://localhost:3000`.

## Current limitations

- The server reads the upstream response into an array buffer but does not send those bytes in its successful response. End-to-end image generation is therefore incomplete.
- The request handler is currently named `/api/gererate` in server.js.
- The upstream integration, model availability, and request format need verification before the project is presented as working.
- The existing npm test command is a placeholder, not an automated test suite.

## Code organization

- `public/`: browser interface, scripts, and styles
- `server.js`: static server and inference request handler
- `config/`: local configuration location

## Next steps

Complete the response path, handle upstream failures, validate request inputs, remove tracked dependency files, and use an example environment file instead of committed credentials.

[Mustafa Sarwari](https://github.com/mustafa-sarwari)
