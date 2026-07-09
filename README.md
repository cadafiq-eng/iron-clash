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
2. Pick `Kids` for a friendlier Neon Quest style or `Adult` for a darker cockpit style.
3. Use `GARAGE` to choose a mech, repair chassis damage, and equip mods.
4. Use `EXPLORE` to select missions. Completing missions unlocks later sectors.
5. In battle, press `ATTACK` or `ENERGY` to damage the rival and `DEFEND` to reduce the next hit.
6. Win battles to earn XP, raise your level, improve your score, and advance through the map.
7. Use `Reset Progress` on `HOME` to clear saved progress and start again.

## Validate

```bash
npm run lint
npm run build
```

## Notes

- Progress is stored in `localStorage`.
- No API key is required for the current app.
- Remote visual assets are loaded from Google-hosted image URLs.
