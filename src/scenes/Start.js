export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    create() {
        const { width, height } = this.scale;

        // 1. Background (using your existing start_bg)
        this.add.image(width / 2, height / 2, 'bg-start');

        // 2. Title Label
        this.add.text(width / 2, 100, 'Wordz for Wizdom', {
            fontFamily: 'MagicFont',
            fontSize: '84px',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // 3. Create Buttons
        this.createButton(width / 2, height * 0.5, 'PLAY', () => {
            this.scene.start('PlayerSelection');
        });

        this.createButton(width / 2, height * 0.65, 'SETTINGS', () => {
            console.log("Settings Opened");
            // You can add a popup or overlay here later
        });

        this.createButton(width / 2, height * 0.8, 'HELP', () => {
            console.log("Help Opened");
        });
    }

    // Helper function to create interactive buttons easily
    createButton(x, y, label, callback) {
        const btnWidth = 300;
        const btnHeight = 80;

        // Button Container (Background + Text)
        const container = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, btnWidth, btnHeight, 0x332d1f, 0.9)
            .setInteractive({ useHandCursor: true });

        const text = this.add.text(0, 0, label, {
            fontFamily: 'MagicFont', fontSize: '32px', color: '#ffffff', fontWeight: 'bold'
        }).setOrigin(0.5);

        container.add([bg, text]);

        // Interactivity
        bg.on('pointerover', () => bg.setFillStyle(0xcccccc));
        bg.on('pointerout', () => bg.setFillStyle(0x332d1f));
        bg.on('pointerdown', () => {
            this.sound.play('sfx-coin'); // Play sound when clicked
            callback();
        });
    }
}