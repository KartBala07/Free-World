# Free City

A retro 3D city sandbox where you shape the environment and citizens choose their own lives.

[Open the hosted game](https://free-city-civilization.swathibala988.chatgpt.site) · [Game design and ideas](docs/game-design.md)

The hosted Site and this GitHub repository are currently private. GitHub stores the source; the existing Sites deployment remains the game host. Pushing to GitHub does not automatically deploy the Site.

## Play

- Drag or use WASD / arrow keys to move. Scroll or use +/− to zoom.
- Click a citizen to see their actions, thoughts, neural activity, memories, and mind folder.
- Use Environment to build facilities, change conditions, and observe autonomous responses.
- The lobby offers **City Stories** (cozy building and community challenges) and **Chaos Lab** (survival and free experiments). Switch without resetting your city. Optional challenges add clear objectives, budgets, and saved medals.
- Time advances while the page is open. Saves and citizen minds are stored in this browser using IndexedDB. Export important worlds and minds from the game to keep independent copies.

## Run locally

Requires Python 3 for a local server and Node.js 20+ for tests. No package installation or build step is required.

```sh
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080. For an isolated unsaved test world, open http://localhost:8080/?demo=1.

```sh
node tests/simulation.mjs
node tests/challenges.mjs
```

## Structure

- `dist/app.js`: controls, inspector, sandbox, and game UI
- `dist/sim.js`: autonomous city simulation
- `dist/brain.js`: simplified fly-inspired sparse associative learning
- `dist/challenges.js`: objectives, budgets, rewards, and scenario progression
- `dist/city.js`: lots, road routes, and environmental state
- `dist/world.js`: Three.js scene and animated presentation
- `dist/vault.js`: local persistence and exports
- `tests/`: simulation and gameplay regression checks

## What the AI is

Citizens use a small, procedural, fly-inspired learning model with sparse memory cells and reward-based associative updates. Their displayed thoughts summarize simulation state. This is not a biological brain, consciousness, a connected language model, or the TensorFlow/PyTorch frameworks running in the browser.

## Development and deployment

The `.openai/hosting.json` file identifies the existing hosted Site. Sites tooling packages and deploys the static `dist/` directory. Run the included tests locally before publishing. No automatic GitHub deployment or CI workflow is configured; the repository does not receive Site credentials.

Three.js is vendored in `dist/vendor/three.js`; its license header is retained. Original project code has no open-source license grant yet.
