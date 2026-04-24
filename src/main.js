<<<<<<< HEAD
//src/main.js
import { Boot } from './scenes/Boot.js';
import { Preloader } from './scenes/Preloader.js';
import { Start } from './scenes/Start.js';
import { Game } from './scenes/Game.js';
import { GameOver } from './scenes/GameOver.js';
import { PlayerSelection } from './scenes/PlayerSelection.js';
import { Settings } from './scenes/Settings.js';
import { Help } from './scenes/Help.js';
import { Credits } from './scenes/Credits.js';

const config = {
    type: Phaser.AUTO,
    title: 'Shmup',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#000000',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: [
        Boot,
        Preloader,
        Start,
        Game,
        GameOver,
        PlayerSelection,
        Settings,
        Help,
        Credits,
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    
}

new Phaser.Game(config);
=======
//src/main.js
import { Boot } from './scenes/Boot.js';
import { Preloader } from './scenes/Preloader.js';
import { Start } from './scenes/Start.js';
import { Game } from './scenes/Game.js';
import { GameOver } from './scenes/GameOver.js';
import { StoryMode } from './scenes/StoryMode.js';
import { Settings } from './scenes/Settings.js';
import { Help } from './scenes/Help.js';
import { Credits } from './scenes/Credits.js';
import { Levels } from './scenes/Levels.js';
import { MainMenu } from './scenes/MainMenu.js';

const config = {
    type: Phaser.AUTO,
    title: 'Wordz For Wizdom',
    description: '',
    parent: 'game-container',
    width: 1380,
    height: 752,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#000000',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: [
        Boot,
        Preloader,
        Start,
        Game,
        GameOver,
        StoryMode,
        Settings,
        Help,
        Credits,
        Levels,
        MainMenu,
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    
}

new Phaser.Game(config);
>>>>>>> b733ca7 (Updated files from my device)
            