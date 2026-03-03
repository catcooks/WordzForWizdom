# Wordz For Wizdom

## Overview

"Wordz For Wizdom" is a browser-based word game built with Phaser.js. Players navigate a fantasy-themed world, forming words to defeat enemies and progress through stages. The project includes sprite assets, sound effects, and a data-driven dictionary for word validation.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge)
- Internet access for initial asset loading (optional once cached)

### Running Locally

1. Clone or download the repository to your machine.
2. Open `index.html` in your browser. The game loads automatically via Phaser.

> ⚠️ No build step is required: assets and code are static and run directly in the browser.

## Project Structure

```
Wordz For Wizdom/
├─ assets/               # Media files (audio, backgrounds, sprites, fonts, data)
├─ src/                  # Game source code (Phaser scenes and objects)
└─ index.html            # Entry point
```

### Key Directories

- `assets/`: Contains subfolders for audio (bgm and sfx), backgrounds, data (JSON for dictionary, mobs, players, stages, etc.), fonts, and sprites (effects, NPCs, players, UI).
- `src/`: JavaScript modules defining game logic. Scenes such as `Boot.js`, `Game.js`, `MainMenu.js`, and objects like `Player.js`, `Mob.js`, `Letter.js`.

## Gameplay Mechanics

- **Word Formation**: Players select letters to form valid dictionary words stored in `assets/data/dictionary.json`.
- **Combat**: Successfully formed words damage mobs; longer or rarer words inflict more damage.
- **Stages & Progression**: Levels defined in `assets/data/stages.json` with increasing difficulty and unique mob configurations.
- **Player Attributes**: Stats (health, power, etc.) in `assets/data/players.json` and tracked via `Statbox.js`.
- **Cooldowns**: Word ability cooldowns managed by `WordCooldown.js`.

## Development Notes

- Phaser version is included as `phaser.js`. No package manager is used.
- Core logic spread across `src/` files; modular design facilitates adding new scenes or objects.
- Assets use relative paths from `index.html` and are loaded in `Preloader.js`.

## Resources & Data

- `assets/data/` JSON files define game data, enabling easy editing or expansion.
- `JsonSorterManual.java` appears to be a utility for sorting JSON; external to game runtime.

## Contributing

1. Fork the repository.
2. Add new sounds, sprites, or mechanics under appropriate folders.
3. Update scene logic or objects in `src/` and test by opening `index.html`.
4. Submit a pull request with detailed description of changes.

## License

(Include license information here if applicable.)

---

*Generated automatically by GitHub Copilot.*
