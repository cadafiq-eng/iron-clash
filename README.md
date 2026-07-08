# Iron Clash

Iron Clash is a Vite, React, and TypeScript mech battle prototype. It includes a home cockpit, garage customization, mission map, and battle simulator with local progress persistence.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

The dev server runs on port `3000` by default.

## Validate

```bash
npm run lint
npm run build
```

## Notes

- Progress is stored in `localStorage`.
- No API key is required for the current app.
- Remote visual assets are loaded from Google-hosted image URLs.
