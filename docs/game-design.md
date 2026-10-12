# Free City: make the city worth caring about

## The pitch

Build a place people want to live in. You control the world; they control their lives.

The interesting question is not “Can I maximize the population?” It is “What will these people become in the world I build?” Pair that curiosity with clear goals, satisfying feedback, and consequences the player can understand.

## The core play loop

1. Notice a need: someone is hungry, a neighborhood is lonely, a storm is approaching.
2. Make an environmental choice: add a market, build a park, improve a route, prepare shelter.
3. Watch autonomous citizens respond. Show routes and explain the result.
4. Receive a meaningful payoff: a resident remembers the place, a community goal completes, a story develops.
5. Face a new choice with more possibilities.

Avoid long stretches of waiting. Offer speed controls, visible progress, optional short goals, and a useful decision within the first minute. No task should require commanding an individual citizen.

## Two modes — chosen in the lobby

**City Stories** combines cozy sandbox building with optional community challenges.

**Chaos Lab** combines disaster-survival challenges with unrestricted environmental experiments.

Both modes use the same city and preserve citizens, buildings, and memories. An active challenge must be ended before switching mode.

## First playable slice — implemented in this update

Optional challenges run in the current city, keep existing citizens, and retain changes when returning to sandbox. A separate construction grant avoids consuming the citizens' government treasury.

- **A Place to Belong:** inspect citizens, build a new park, and earn positive social experiences there.
- **The Learning Garden:** add a learning center and park, then watch citizens gain useful learning experiences.
- **Stormwatch:** prepare shelter and healthcare before a timed storm, then maintain the population's health through it.
- Live objective tracking, construction prices, deadline warnings, an end-of-challenge result, and saved medals.
- Unlimited sandbox remains available. Challenges are optional, not a restriction on creative play.

These are a first balancing pass. Real playtesting is needed before calling them polished or broadly fun.

## High-value next ideas

### 1. Citizen wish cards

A citizen expresses a need: “I wish there were a quiet place near my home.” The player can respond by changing the neighborhood, but the citizen decides whether to visit. Successful wishes earn a personal thank-you and a permanent memory. This turns abstract bars into people worth caring about.

### 2. Neighborhood identities

Give districts distinct architecture, music, schedules, and preferences. A university district might attract curious citizens; a riverside market might build friendships. Identity should arise from who lives there and what happens, not just cosmetic labels.

### 3. A city scrapbook

Automatically capture births, friendships, unusual decisions, disasters survived, and beloved places. Let players pin three favorite citizens. After a session, show a readable story of what changed because of the environment they created.

### 4. Festivals and seasons

A harvest fair, lantern evening, science festival, or rainy season changes what citizens value. Preparation creates choices; the festival itself provides a lively visual payoff. Participation remains voluntary.

### 5. Discovery collection

Reward observation: the first citizen who avoids a dangerous route, a family tradition passed between generations, a community that recovers after a storm. Unlock journal illustrations or decorative building variants instead of raw power bonuses.

### 6. Environmental event choices

Offer two or three reasonable responses with visible tradeoffs: fund a food shipment now, invest in resilient farms, or open a temporary communal kitchen. Reveal outcomes through citizens' actual experiences rather than a predetermined success message.

### 7. Shareable city seeds and challenges

Let players export/import worlds, publish a challenge seed, and compare different cities built from the same start. Begin asynchronously; a real-time multiplayer simulation would add significant complexity before the basic game is proven.

### 8. Optional chaos lab

Keep deliberate disasters separate from the cozy default. Players can test a heatwave, closed bridge, or blackout, then watch how the city adapts. Include clear recovery tools and a rewind checkpoint.

### 9. Sound and moment-to-moment feedback

Add gentle ambient music, footsteps, building previews, construction pops, task icons, animated arrivals, and restrained celebration effects. Every sound needs a mute control; every essential cue needs a visual equivalent.

### 10. A progression map

Unlock new environmental tools by completing meaningful city goals. Avoid grinding population numbers or punishing players for leaving. Keep unlocked tools available in free sandbox.

## Recommended build order

**Now:** validate the new challenges with actual players. Watch whether they understand what to do and can finish without help.

**Next:** citizen wish cards, favorite citizens, and a city scrapbook. These make the autonomous simulation emotionally interesting.

**Then:** festivals, richer buildings, sounds, and visible activity animations. These make the experience rewarding to watch.

**Later:** importable/shareable world seeds, public hosting, accessibility polish, and a simple community challenge browser. Add multiplayer only if asynchronous sharing proves enjoyable.

## First playtest questions

- Can a new player make a meaningful change within 60 seconds?
- Can they explain why a citizen went somewhere?
- Do they notice and care when a citizen learns or remembers something?
- Does a challenge require a decision rather than waiting or repetitive clicking?
- Is there a moment they want to show another person?
- After ten minutes, do they want to keep their city?

These are proposed design goals, not measured user-research results.

## Guardrails for the game identity

- Never require direct control of a citizen.
- Do not call thought summaries consciousness or biological brain emulation.
- Keep goals optional and preserve existing saves.
- Show costs and consequences before player actions.
- No paid timers, mandatory daily chores, or penalties for being away.
- Do not announce a feature as complete until it actually works and has been tested.
