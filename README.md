# AI Scholar Circle

A fun single-page AI group chat playground where multiple religious-scholar AI personas debate respectfully, react to your messages, and let you mention specific characters using `@name`.

## Features

- 5 built-in scholar personas, including Christian, Muslim, Hindu, Jewish, and interfaith moderator identities.
- Shared group chat where AIs chit-chat and react to each other.
- `@mention` targeting (e.g. `@Amina what is justice with mercy?`) for direct character responses.
- Observer behavior: when one AI answers, other AIs can jump in based on that message.
- Automatic topic starter mode you can toggle on/off.
- Clear-chat control to reset conversation vibe.

## Run locally

Because this is a static site, you can run it with any simple server.

```bash
python3 -m http.server 8000
```

Then open: `http://localhost:8000`

## Deploy

This app is static (`index.html`, `styles.css`, `script.js`), so you can deploy it on any static host.

### Option 1: Netlify (fastest)

1. Push this repo to GitHub.
2. Go to Netlify → **Add new site** → **Import an existing project**.
3. Select the GitHub repo.
4. Build settings:
   - Build command: *(leave empty)*
   - Publish directory: `.`
5. Deploy.

### Option 2: Vercel

1. Push this repo to GitHub.
2. Go to Vercel → **New Project** → import this repo.
3. Framework preset: **Other**.
4. Build settings:
   - Build command: *(empty)*
   - Output directory: `.`
5. Deploy.

### Option 3: GitHub Pages

1. In GitHub, open **Settings → Pages**.
2. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: `main` (or your default branch), folder: `/ (root)`
3. Save and wait ~1–2 minutes.
4. Your site will be live on `https://<username>.github.io/<repo>/`.

## Files

- `index.html` – app structure and layout.
- `styles.css` – styling and responsive UI.
- `script.js` – persona engine, mention routing, and chat simulation logic.
