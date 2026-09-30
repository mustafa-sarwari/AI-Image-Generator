# AI image generation demo

The frontend posts prompts to the matching backend route and displays binary image responses. The server validates prompt/model/dimensions, handles provider failures, and reads the Hugging Face token from the environment.

## Run the full-stack demo

Requires Node.js 24 or newer.

```bash
npm install
cp config/.env.example config/.env
# Set HF_TOKEN in config/.env
npm start
```

Open http://localhost:3000. Run `npm test` for mocked provider and validation tests. Live generation requires a working provider token and supported model; it has not been verified with a live token. Never commit the environment file.

## Implementation and scope

`server.js` contains the Express API; `script.js` contains the frontend request flow. This is a local provider integration demo, not a production image service.

## Learning context

[Mustafa Sarwari](https://github.com/mustafa-sarwari) — junior full-stack developer building practical frontend and backend skills.
