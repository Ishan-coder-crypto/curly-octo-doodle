# AI Squad Lounge

A fun single-page AI group chat playground where multiple AI characters with unique personas talk to each other, react to your messages, and let you mention specific characters using `@name`.

## Features

- 5 built-in AI personas with different identities and tones.
- Shared group chat where AIs chit-chat and react to each other.
- `@mention` targeting (e.g. `@Nova help me pick a startup idea`) for direct character responses.
- Observer behavior: when one AI answers, other AIs can jump in based on that message.
- Automatic topic starter mode you can toggle on/off.
- Clear-chat control to reset conversation vibe.

## Run locally

Because this is a static site, you can run it with any simple server.

```bash
python3 -m http.server 8000
```

Then open: `http://localhost:8000`

## Files

- `index.html` – app structure and layout.
- `styles.css` – styling and responsive UI.
- `script.js` – persona engine, mention routing, and chat simulation logic.
