import UIHelper from "../utils/UIHelper.js";

export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    create() {
        // --- BGM Logic ---
        if (!this.sound.get('Time-for-adventure')) {
            this.bgm = this.sound.add('Time-for-adventure', { volume: 0.5, loop: true });
            this.bgm.play();
        } else if (!this.sound.get('Time-for-adventure').isPlaying) {
            this.sound.get('Time-for-adventure').play();
        }

        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'bg-start');
        
        // Title
        this.add.text(width / 2, 100, 'WORDZ FOR WIZDOM', {
            fontFamily: 'MagicFont', fontSize: '84px', stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5);

        let buttonX = (width / 2) * 1.6;
        let adjY = -100;

        // --- Using UIHelper for all buttons ---
        UIHelper.createLargeButton(this, buttonX, (height * 0.5) + adjY, 'PLAY', () => {
            this.scene.start('PlayerSelection');
        });

        UIHelper.createLargeButton(this, buttonX, (height * 0.65) + adjY, 'SETTINGS', () => {
            this.scene.pause();
            this.scene.launch('Settings', { parentKey: this.scene.key });
        });

        UIHelper.createLargeButton(this, buttonX, (height * 0.8) + adjY, 'HELP', () => {
            this.scene.pause();
            this.scene.launch('Help', { parentKey: this.scene.key });
        });

        UIHelper.createLargeButton(this, buttonX, (height * 0.95) + adjY, 'CREDITS', () => {
            this.scene.start('Credits'); // Changed to start so it rolls!
        });
    }
}