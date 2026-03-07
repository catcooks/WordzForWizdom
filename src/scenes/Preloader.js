import ASSETS from '../assets.js';

export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'bg-loading');

        this.loadingLabel = this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, 'PREPARING SPELLS...', {
            fontFamily: 'MagicFont',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.percentLabel = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, '0%', {
            fontFamily: 'MagicFont',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const barWidth = 400;
        const barHeight = 20;
        const bgBar = this.add.rectangle(this.scale.width / 2, this.scale.height / 2 + 10, barWidth, barHeight, 0x000000, 0.5);
        const progressBar = this.add.rectangle(this.scale.width / 2 - barWidth / 2, this.scale.height / 2 + 10, 0, barHeight, 0xffffff);
        progressBar.setOrigin(0, 0.5);

        this.load.on('progress', (progress) => {
            progressBar.width = barWidth * progress;
            this.percentLabel.setText(Math.floor(progress * 100) + '%');
        });

        this.load.on('fileprogress', (file) => {
            this.loadingLabel.setText('LOADING: ' + file.key.toUpperCase());
        });
    }

    preload() {
        this.load.audio('Time-for-adventure', 'assets/audio/bgm/time_for_adventure.mp3');
        this.load.json('dictionary', 'assets/data/dictionary.json');
        this.load.json('words', 'assets/data/MasterWord.json');
        this.load.json('stageData', 'assets/data/stages.json');
        this.load.json('mobData', 'assets/data/mobs.json');  
        this.load.json('playerData', 'assets/data/players.json');
        this.load.json('helpData', 'assets/data/help.json');
        this.load.json('bossData', 'assets/data/boss.json');
        for (let type in ASSETS) {
            for (let key in ASSETS[type]) {
                let args = ASSETS[type][key].args.slice();
                args.unshift(ASSETS[type][key].key);
                this.load[type].apply(this.load, args);
            }
        }
    }

    create() {
        this.scene.start('Start');
    }
}