You are a senior product engineer and game developer. Build a polished, mobile-first 2D browser game/web app as a birthday gift.

The app is an emotional, cute, interactive experience centered around a cat character that explores a small 2D world and collects “gifts” for my girlfriend. It must run smoothly on a phone browser and inside a phone web view. It must be deployable for free as a static web app.

## Core concept

The player controls a cat in a 2D world. As she explores, she finds collectible gifts and interactive objects. Each gift reveals a small surprise such as:
- letters
- photos
- short cat videos
- birthday wishes
- tiny mini games
- a cake scene where candles can be blown out
- a final ending / celebration scene

Background music should play during the experience, and the user should be able to choose from a small set of songs.

The tone should be:
- romantic
- cute
- playful
- warm
- personal
- cozy
- smooth and magical, not tacky

The app should feel like a tiny love-themed exploration game, not a generic website.

## Primary technical requirements

Build this as:
- Phaser + TypeScript + Vite
- static-host friendly
- no backend required
- localStorage for save/progress
- mobile-first UI and controls
- PWA-ready if practical
- clean and modular code

The code must be production-quality, well-structured, and easy to extend.

## Important constraints

Do NOT overengineer.
Do NOT add a backend.
Do NOT add authentication.
Do NOT add unnecessary dependencies.
Do NOT use React unless there is a very strong reason.
Do NOT build a huge open world.
Do NOT create giant complex mini games.
Do NOT assume desktop keyboard input is the main control method.
Do NOT make anything dependent on a paid service.

The app should work as a fully static deployment on services like Cloudflare Pages / Netlify / GitHub Pages.

## Main experience design

The experience begins at a title screen:
- title such as “A Birthday Adventure for [Her Name]”
- soft animated background
- start button
- optional song selection button
- optional continue button if save data exists

After starting, the user enters a small 2D world with a cat avatar.

The world should have a few cozy themed areas/rooms, for example:
- bedroom / cozy room
- memory gallery
- garden / dreamy outdoor area
- cake / celebration area
- final ending area

Each area contains interactive objects and collectibles.

Examples of interactables:
- gift boxes
- envelopes
- photo frames
- TV / video player object
- plushies / stars / hearts
- cake table
- music player
- doorways / portals to other rooms

The player should be able to:
- move the cat
- approach objects
- see an interaction hint
- tap interact
- open content or enter mini games
- collect completed gifts
- track progress

There should be a sense of progression, but it should stay simple and relaxing.

## Scope target

Target a polished small experience, not a giant game.

Recommended total scope:
- 4 to 5 rooms/scenes
- 12 to 20 interactable gifts total
- 3 to 4 simple mini games max
- 3 to 5 selectable songs
- 1 cake candle interaction scene
- 1 emotional final ending scene

Each mini game should be completable in under 1 minute.

## Functional requirements

### 1. Title screen
Include:
- app title
- start button
- continue button if save exists
- song select option
- mute/unmute toggle
- subtle animation
- clean mobile layout

### 2. World navigation
Implement 2D movement for a cat avatar.

Movement must support phone use.
Preferred approach:
- touch-friendly movement
- either tap-to-move or an on-screen joystick
- include a visible interact button if needed

Prioritize smooth, simple controls on mobile.

### 3. Camera and scene layout
- camera should follow the cat in larger rooms
- rooms should be compact and visually readable on a phone
- avoid clutter
- maintain consistent collision boundaries
- transitions between rooms should be smooth

### 4. Interactions
Every interactable object should support:
- unique id
- type
- position
- locked/unlocked/completed state
- interaction label
- completion outcome
- optional collectible status

When near an interactable:
- show a small prompt
- allow interaction
- open the related content scene / modal / mini game

### 5. Gift/content types
Support at least these content types:

#### Letter gift
- opens an animated letter or note scene
- displays a romantic/personal message
- supports multi-page content if needed
- elegant typography
- close button
- mark collectible as viewed/completed

#### Photo gift
- opens a photo viewer
- supports one or multiple images
- swipe or tap next/previous
- smooth transitions
- captions optional

#### Cat video gift
- opens a short video overlay/player
- supports local video file playback
- simple mobile-friendly controls
- close button
- mark complete after opening

#### Wish/message gift
- opens a short birthday wish card
- cute animation
- can be short and decorative

#### Mini game gift
- launches a simple mini game scene
- on completion, returns reward/completion state
- shows success feedback
- marks the corresponding gift complete

#### Cake gift
- enters a dedicated cake scene
- animated cake and candles
- supports blowing out candles
- microphone support is optional and not required
- include a fallback interaction such as swipe, tap, or press-and-hold to extinguish candles
- celebratory animation when all candles are out

### 6. Song system
Implement a background music system with:
- a list of selectable songs
- play/pause
- track switching
- mute toggle
- persistent selected track across scenes if practical
- start music only after user interaction to satisfy mobile browser restrictions

Keep this system stable and simple.

### 7. Progress system
Use localStorage to save:
- gifts viewed/opened/completed
- mini games completed
- selected song
- current room
- overall progress percentage
- whether ending is unlocked

Add:
- save/load helper module
- reset progress option in settings or menu

### 8. Progress UI
Show progress in a lightweight way, such as:
- gift count collected / total
- room progress
- inventory/book/journal view of unlocked memories
- simple status panel

Keep UI minimal and elegant.

### 9. Ending unlock
When enough gifts or all major gifts are completed:
- unlock final area or final sequence
- present final letter/message
- celebratory visuals
- music swell or special ending track
- maybe fireworks/stars/hearts/confetti
- conclude with a heartfelt ending screen

### 10. PWA readiness
If practical, structure the app to be easy to convert into a PWA:
- manifest
- icons placeholder
- basic service worker optional
This is a bonus, not a blocker.

## Suggested room design

Implement these rooms as a recommended baseline:

### Room 1: Cozy Bedroom
Purpose:
- tutorial area
- easy first interactions
Contains:
- first letter
- first photo frame
- music player object
- doorway to gallery/garden

### Room 2: Memory Gallery
Purpose:
- photos and wishes
Contains:
- multiple photo gifts
- framed memories
- scrapbook-like visuals

### Room 3: Garden / Dream Area
Purpose:
- playful exploration and mini games
Contains:
- stars/hearts/gift boxes
- 1 or 2 mini games
- dreamy visuals

### Room 4: Cake Room
Purpose:
- central birthday moment
Contains:
- birthday cake
- candle interaction
- celebration animation

### Room 5: Final Room / Rooftop / Sky Ending
Purpose:
- emotional payoff
Unlocked after major progress.
Contains:
- final letter
- final message
- ending visuals

## Mini game requirements

Create simple mini games only. Keep each small and polished.

Implement 3 mini games from this style:

### Mini game idea 1: Memory Match
- tap cards to reveal pairs
- very small board
- quick completion
- romantic/cute themed icons

### Mini game idea 2: Catch the Hearts
- simple catch/fall mechanic
- collect hearts or gifts
- avoid one silly obstacle if desired
- short timer

### Mini game idea 3: Sort the Gifts
- drag gift items into the correct basket/box
- quick and easy
- cheerful completion animation

Alternative mini games are acceptable if equally simple.

Each mini game should:
- have its own scene/module
- expose clear completion logic
- return success state
- save completion
- not rely on keyboard only

## Code architecture requirements

Use a clean folder structure such as:

src/
  main.ts
  game/
    config.ts
    types.ts
    constants.ts
  scenes/
    BootScene.ts
    PreloadScene.ts
    TitleScene.ts
    WorldScene.ts
    BedroomScene.ts
    GalleryScene.ts
    GardenScene.ts
    CakeScene.ts
    EndingScene.ts
    minigames/
      MemoryMatchScene.ts
      CatchHeartsScene.ts
      SortGiftsScene.ts
  entities/
    Player.ts
    Interactable.ts
  systems/
    AudioManager.ts
    SaveManager.ts
    SceneTransition.ts
    InteractionManager.ts
    ProgressManager.ts
  ui/
    Modal.ts
    LetterModal.ts
    PhotoViewer.ts
    VideoViewer.ts
    HUD.ts
    SongSelector.ts
  data/
    gifts.ts
    rooms.ts
    songs.ts
    letters.ts
    photos.ts
    videos.ts
  assets/
    ...
  styles/
    ...

You may improve the structure if needed, but preserve modularity and clarity.

## Data-driven content

Design the content so gifts and room content can be configured with data, not hardcoded everywhere.

At minimum define data schemas for:
- rooms
- gifts/interactables
- songs
- letters
- photos
- videos
- mini game metadata

Each gift should have fields like:
- id
- roomId
- type
- x
- y
- title
- label
- assetKey
- contentRef
- completionRule
- unlocked
- completed

## Asset strategy

Use placeholder assets where needed, but structure the project so real assets can be easily dropped in later.

Need placeholders for:
- cat sprite
- interactable objects
- icons
- room backgrounds
- cake
- cards/hearts/gifts
- music tracks
- photos/videos

Document clearly where to replace placeholder assets.

## UI/UX requirements

The app must feel good on a phone.

Requirements:
- large tap targets
- readable text
- consistent spacing
- fast transitions
- subtle animations
- elegant overlays for letters/photos/videos
- clear close/back buttons
- pause/settings access
- low friction

Visually:
- soft palette
- cozy aesthetic
- clean romantic look
- avoid generic gamer UI
- avoid visual clutter

## Performance requirements

Optimize for mobile:
- preload only what is needed
- keep memory use modest
- avoid giant spritesheets
- avoid complex physics unless needed
- keep animations lightweight
- support moderate phones without lag

## Accessibility and resilience

- support mute and volume control
- support fallback if autoplay is blocked
- support fallback interaction for candle blowing
- ensure game remains usable without microphone access
- do not trap the user in overlays or scenes
- handle missing localStorage gracefully if possible

## Quality expectations

I want code that is:
- modular
- understandable
- documented where necessary
- easy to continue building on
- not hacky
- not a toy demo

Do not dump everything into one giant file.
Do not leave architecture messy.
Do not leave dead code.
Do not generate fake TODO-heavy output without implementing key features.

## Deliverables

Build a working first version of the app with:
- project scaffold
- runnable development environment
- all main scenes
- a controllable cat
- room transitions
- interactables
- at least one letter, one photo gift, one video gift
- at least 2 mini games
- cake candle interaction
- song selection system
- local save system
- final unlock flow
- placeholder assets integrated cleanly

Also provide:
- README with setup and deployment instructions
- notes on replacing placeholder assets
- notes on how to add new gifts and songs
- notes on free static deployment

## Deployment expectations

The app must build cleanly for static hosting.
Use Vite build output compatible with free hosts like Cloudflare Pages or Netlify.

Include scripts for:
- dev
- build
- preview

## Development process instructions

Work in phases:
1. scaffold architecture
2. implement core world and player movement
3. implement interaction framework
4. implement content modals and gift system
5. implement mini games
6. implement cake scene
7. implement progression and ending
8. polish mobile UX
9. document setup and deployment

At the end of each major phase:
- summarize what was implemented
- list files created/changed
- mention any tradeoffs
- identify the next highest-value step

## Coding style instructions

- TypeScript strict enough to be useful
- avoid needless abstraction
- prefer small focused classes/modules
- use clear names
- keep scene logic readable
- add comments only where they help
- avoid repetition where practical
- do not use magic numbers when avoidable

## Final instruction

Start by scaffolding the project and implementing the minimum viable vertical slice:
- title screen
- one room
- player movement
- one interactable letter gift
- one song playing after user gesture
- one save/load mechanism

Once that works, expand incrementally into the full experience described above.