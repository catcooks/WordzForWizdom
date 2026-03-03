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

};