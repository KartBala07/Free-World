# Free World

A retro 3D city sandbox where you shape the environment and citizens choose their own lives.

[Open the hosted game](https://free-city-civilization.swathibala988.chatgpt.site) · [Game design and ideas](docs/game-design.md)

The hosted game is public. This GitHub repository is public: [KartBala07/Free-World](https://github.com/KartBala07/Free-World). GitHub stores the source; the existing Sites deployment remains the game host. Pushing to GitHub does not automatically deploy the Site.

## Living-town update

The optional top-down town view has original pixel-style interiors, activity bubbles, and a clickable resident strip. 3D is the default view. Toggle to the town map from Observer mode. The Daily life journal shows routines, current location, actual encounter transcripts, relationships, reflections, and observations. Routines influence action scores; survival needs and learned rewards still drive decisions. Conversations occur between nearby citizens at the same destination and are rule-generated, not LLM conversations. Inspired by the presentation of the Generative Agents demo; no demo art or source was copied. Existing city saves and neural weights are preserved.

## Player mode and expanded world

The lobby now includes **Play as a citizen**. The world has 120 lots (previously 48), across a 272 × 224 map. Old saves expand in place while retaining original lot IDs, citizens, memories, and player progress.

- WASD / arrows walk; Q/E or right-drag turns the camera. F interacts with the nearby place. Touch movement buttons are available.
- Work near a workshop, farm, or market for ¤25 per completed shift. At 40 social credit, shifts pay ¤40.
- Buy meals for ¤8, rest for energy, and save ¤60 to rent a home.
- Care for parks or study at libraries to earn social credit. Meeting neighbors earns credit with a cooldown.
- Social credit is a fictional 0–100 community reputation meter, based only on in-game interactions. It is not tied to real identity, politics, or purchases.
- Money is fictional game currency, with no real-money payments. Player progress is stored with the same shared-username cloud save. This is a solo simulation with shared save access, not real-time multiplayer or a cheat-resistant economy.
- Observer mode retains building tools, City Stories, Chaos Lab, and citizen inspection. Player mode uses normal time and disables environmental editing.

## Play

- Drag or use WASD / arrow keys to move. Scroll or use +/− to zoom.
- Click a citizen to see their actions, thoughts, neural activity, memories, and mind folder.
- Use Environment to build facilities, change conditions, and observe autonomous responses.
- The lobby offers **City Stories** (cozy building and community challenges) and **Chaos Lab** (survival and free experiments). Switch without resetting your city. Optional challenges add clear objectives, budgets, and saved medals.
- Time advances while the page is open. Saves and citizen minds are stored in the backend under a shared username, with IndexedDB browser backups. Export important worlds and minds from the game to keep independent copies.

## Run locally

Requires Node.js 20+. No package installation is required. The local server includes a disk-backed development adapter; production uses Cloudflare R2.

```sh
node scripts/dev.mjs
```

Open http://localhost:8080. For an isolated unsaved test world, open http://localhost:8080/?demo=1.

```sh
node tests/simulation.mjs
node tests/challenges.mjs
node tests/backend.mjs
node tests/life.mjs
node tests/player.mjs
node scripts/build.mjs
```

## Structure

- `dist/app.js`: controls, inspector, sandbox, and game UI
- `dist/sim.js`: autonomous city simulation
- `dist/brain.js`: simplified fly-inspired sparse associative learning
- `dist/challenges.js`: objectives, budgets, rewards, and scenario progression
- `dist/city.js`: lots, road routes, and environmental state
- `dist/world.js`: Three.js scene and animated presentation
- `dist/vault.js`: cloud persistence, browser backups, and exports
- `dist/profile.js`: username lobby and save conflict handling
- `backend/api.mjs`: shared username save API
- `scripts/dev.mjs`: local server (data in ignored `.local-data/`)
- `scripts/build.mjs`: dependency-free Worker packaging
- `tests/`: simulation and gameplay regression checks

## What the AI is

Citizens use a small, procedural, fly-inspired learning model with sparse memory cells and reward-based associative updates. Their displayed thoughts summarize simulation state. This is not a biological brain, consciousness, a connected language model, or the TensorFlow/PyTorch frameworks running in the browser.

## Development and deployment

The `.openai/hosting.json` file identifies the existing hosted Site. `node scripts/build.mjs` creates a Worker with embedded game assets and the backend API in `dist/server/index.js`. The hosting manifest declares the `BUCKET` R2 binding, which Sites provisions. Run the included tests locally before publishing. No automatic GitHub deployment or CI workflow is configured; the repository does not receive Site credentials.

Three.js is vendored in `dist/vendor/three.js`; its license header is retained. Original project code has no open-source license grant yet.

## Shared username login

Enter a name (3–24 letters, numbers, hyphens or underscores) to open a city. Names are case-insensitive. **This is not secure authentication:** anyone knowing the name can read and change that save. There are no passwords, email addresses, private profiles, or account recovery. Logout clears the selected name from that tab; it does not delete the cloud city or revoke anyone else’s access.

Cloud saves include the world, citizen minds, and challenge progress. New profiles start fresh unless the player explicitly chooses to copy an existing browser city. An existing cloud city always takes precedence. Offline/cloud failures do not silently create a replacement city. Export browser backups from the login screen or export the active world from Backup.

The API supports GET/PUT `/api/worlds/:username`. Writes require a matching ETag (or `If-None-Match: *` for new saves), validate the world, reject cross-origin browser writes, and cap each save at 32 MB. Conflicts pause the game and require reloading the latest cloud save; export unsynced work first. This is shared persistence, not real-time multiplayer. There is no public profile directory. Anti-abuse quotas and moderation are not implemented yet; add them before promoting at scale.
