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

## How to play

1. Start in `HOME`, name your pilot, and press `BATTLE` for a quick fight.
2. Use `GARAGE` to choose a mech, repair chassis damage, and equip mods.
3. Use `EXPLORE` to select missions. Completing missions unlocks later sectors.
4. In battle, press `ATTACK` to damage the titan and `DEFEND` to reduce the next enemy strike.
5. Win battles to earn XP, raise your level, improve your score, and advance through the map.

## Validate

```bash
npm run lint
npm run build
```

## Notes

- Progress is stored in `localStorage`.
- No API key is required for the current app.
- Remote visual assets are loaded from Google-hosted image URLs.
