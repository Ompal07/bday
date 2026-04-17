# A Birthday Adventure

A small Phaser + TypeScript + Vite birthday game for a girlfriend, built to run as a fully static web app.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## What’s included

- Title screen with start, continue, song selection, and mute controls
- Five cozy scenes: bedroom, gallery, garden, cake room, and final sky
- Touch-first movement with an on-screen joystick and interact button
- Local save/load using `localStorage`
- Letter, photo, video, wish, and mini-game gifts
- Three tiny mini games
- Candle-blowing cake scene
- Ending unlock flow

## Replacing placeholders

- Cat, gifts, baskets, doors, and cake are generated in code in [BootScene.ts](src/scenes/BootScene.ts)
- Replace the sample video path in [game/data.ts](src/game/data.ts) with a real local MP4 file if you want actual video playback
- Replace the sample photo sets in [game/data.ts](src/game/data.ts) with real image paths when you have them

## Personalizing the gift

- Change the display name in [game/constants.ts](src/game/constants.ts)
- Edit the letter text in [game/data.ts](src/game/data.ts)
- Add more gifts by extending the room data arrays in [game/data.ts](src/game/data.ts)

## Adding songs

- Edit the song list in [game/data.ts](src/game/data.ts)
- Each track is a small note pattern that the web audio synth in [game/audio.ts](src/game/audio.ts) can loop

## Free static deployment

This project builds to static files in `dist/`, so it can be deployed to:

- Cloudflare Pages
- Netlify
- GitHub Pages

Upload the Vite build output and point the host at `dist`.

