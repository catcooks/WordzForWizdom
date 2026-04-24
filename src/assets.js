<<<<<<< HEAD
//src/assets.js
export default {
    'audio': {
        score: {
            key: 'sfx-coin',
            args: ['assets/audio/sfx/coin.wav']
        },
        explosion: {
            key: 'sfx-explosion',
            args: ['assets/audio/sfx/explosion.wav']
        },
        power: {
            key: 'sfx-powerup',
            args: ['assets/audio/sfx/power_up.wav']
        },
        backgroundMusic: {
            key: 'Time-for-adventure',
            args: ['assets/audio/bgm/time_for_adventure.mp3']
        }
    },
    'image': {
        loading_bg: {
            key: 'bg-loading',
            args: ['assets/backgrounds/bg_loading.png']
        },
        start_bg: {
            key: 'bg-start',
            args: ['assets/backgrounds/bg_start.png']
        },
        spring_bg: {
            key: 'bg-spring',
            args: ['assets/backgrounds/bg_spring_battleground.png']
        },
        fall_bg: {
            key: 'bg-fall',
            args: ['assets/backgrounds/bg_fall_battleground.png']
        },
        winter_bg: {
            key: 'bg-winter',
            args: ['assets/backgrounds/bg_winter_battleground.png']
        },
        alchemy_bg: {
            key: 'bg-alchemy',
            args: ['assets/backgrounds/bg_Alchemy.png']
        },
        alchemy_battleground_bg: {
            key: 'bg-alchemy-battleground',
            args: ['assets/backgrounds/bg_Alchemy_battleground.png']
        },
        rogue_bg: {
            key: 'bg-rogue',
            args: ['assets/backgrounds/bg_Rogue_battleground.png']
        },
        portrait: {
            key: 'border-portrait',
            args: ['assets/ui/portrait.png']
        },
        shufflebtn: {
            key: 'btn-shuffle',
            args: ['assets/ui/btn/shuffle.png']
        },
        startbtn: {
            key: 'btn-start',
            args: ['assets/ui/btn/button_start.png']
        },
        longbtn: {
            key: 'btn-long',
            args: ['assets/ui/btn/long-btn.png']
        },
        menu: {
            key: 'menu',
            args: ['assets/ui/menu.png']
        },
        X: {
            key: 'X',
            args: ['assets/ui/btn/xpic.png']
        },
        paper: {
            key: 'paper',
            args: ['assets/ui/paper.png']
        },




    },
    'spritesheet': {
        player: {
            key: 'player-mage',
            args: ['assets/sprites/players/mage_back.png', {
                frameWidth: 400,
                frameHeight: 663,
            }]
        },
        enemy: {
            key: 'enemy-goblin',
            args: ['assets/sprites/npc/goblin_front.png', {
                frameWidth: 400,
                frameHeight: 601,
            }]
        },
        ogre: {
            key: 'enemy-ogre',
            args: ['assets/sprites/npc/ogre_front.png', {
                frameWidth: 775,
                frameHeight: 1024,
            }]
        },
        mage: {
            key: 'mage-front',
            args: ['assets/sprites/npc/mage_front.png', {
                frameWidth: 413,
                frameHeight: 656,
            }]
        },
        alchemist: {
            key: 'alchemist-front',
            args: ['assets/sprites/npc/alchemist_front.png', {
                frameWidth: 512,
                frameHeight: 688,
            }]
        },
        ogreMage: {
            key: 'ogreMage',
            args: ['assets/sprites/npc/ogre_mage_front.png', {
                frameWidth: 680,
                frameHeight: 1024, 
            }]
        },
        iconMana: {
            key: 'icon-mana',
            args: ['assets/ui/icon_mana.png', {
                frameWidth: 260,
                frameHeight: 300,
            }]
        },
        iconHeart: {
            key: 'icon-heart',
            args: ['assets/ui/icon_heart.png', {
                frameWidth: 341,
                frameHeight: 341,
            }]
        },
        iconShield: {
            key: 'icon-shield',
            args: ['assets/ui/icon_shield.png', {
                frameWidth: 341,
                frameHeight: 390,
            }]
        },
        statbox: {
            key: 'statbox',
            args: ['assets/ui/statbox.png', {
                frameWidth: 256,
                frameHeight: 256,
            }]
        },
        buttons: {
            key: 'button',
            args: ['assets/ui/btn/buttons.png', {
                frameWidth: 300,
                frameHeight: 318,
            }]
        },
        
    },
    'font': {
        gameFont: {
            key: 'MagicFont',
            args: ['assets/fonts/PixelOperator8.ttf']
        }
    }

=======
// src/assets.js
export default {
    json: {
        // Story related
        'dialogData': 'src/data/story/content/dialog.json',
        'storyData': 'src/data/story/content/story.json',
        // Logic & Reference
        'dictionary': 'src/data/story/metadata/dictionary.json',
        'words': 'src/data/story/metadata/MasterWord.json',
        'helpData': 'src/data/story/metadata/help.json',
        'stageData': 'src/data/story/world/stages.json',
        'mobData': 'src/data/entities/mobs.json',
        'bossData': 'src/data/entities/boss.json',
        'playerData': 'src/data/entities/players.json'
    },
    audio: {
        'sfx-coin': 'assets/audio/sfx/coin.wav',
        'sfx-explosion': 'assets/audio/sfx/explosion.wav',
        'sfx-powerup': 'assets/audio/sfx/power_up.wav',
        'Time-for-adventure': 'assets/audio/bgm/time_for_adventure.mp3'
    },
    image: {
        'bg-loading': 'assets/backgrounds/bg_loading.png',
        'bg-start': 'assets/backgrounds/bg_start.png',
        'bg-spring': 'assets/backgrounds/.battleground/bg_spring_battleground.png',
        'bg-fall': 'assets/backgrounds/.battleground/bg_fall_battleground.png',
        'bg-winter': 'assets/backgrounds/.battleground/bg_winter_battleground.png',
        'bg-alchemy': 'assets/backgrounds/bg_Alchemy.png',
        'bg-alchemy-battleground': 'assets/backgrounds/.battleground/bg_Alchemy_battleground.png',
        'bg-rogue': 'assets/backgrounds/.battleground/bg_Rogue_battleground.png',
        'btn-shuffle': 'assets/ui/shuffle.png',
        'btn-start': 'assets/ui/button_start.png',
        'btn-long': 'assets/ui/long-btn.png',
        'menu': 'assets/ui/menu.png',
        'X': 'assets/ui/xpic.png',
        'paper': 'assets/ui/paper.png',
        'map': 'assets/misc/map.png',
        'description-box': 'assets/ui/description.png'
    },
    spritesheet: {
        // [path, frameWidth, frameHeight]
        'alchemist-portrait': ['assets/portrait/alchemist.png', 3072/3, 2048/2],
        'player-portrait': ['assets/portrait/player.png', 3072/3, 2048/2],
        'player-mage': ['assets/sprites/mage_back.png', 800/2, 663],
        'enemy-goblin': ['assets/sprites/goblin_front.png', 800/2, 601],
        'enemy-ogre': ['assets/sprites/ogre_front.png', 1550/2, 1024],
        'mage-front': ['assets/sprites/mage_front.png', 826/2, 656],
        'alchemist-front': ['assets/sprites/alchemist_front.png', 1536/3, 688],
        'alchemist-npc': ['assets/sprites/alchemist_npc.png', 1632/4, 1024],
        'ogreMage': ['assets/sprites/ogre_mage_front.png', 2040/3, 2048/2],
        'icon-mana': ['assets/ui/icon_mana.png', 260, 300],
        'icon-stats': ['assets/ui/stats.png', 1360/4, 600/2],
        'statbox': ['assets/ui/statbox.png', 1024/4, 1024/4],
        'button': ['assets/ui/buttons.png', 1200/4, 1272/4],
        'map-pins': ['assets/ui/map_pin.png', 352/4, 424/4],
        'fireplace': ['assets/misc/fireplace.png', 512, 512],
        'pot': ['assets/misc/pot.png', 816, 1200],
        'items': ['assets/ui/items.png', 790/5, 632/4]
    },
>>>>>>> b733ca7 (Updated files from my device)
};