export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    create() {
        const { width, height } = this.scale;

        // 1. Background (using your existing start_bg)
        this.add.image(width / 2, height / 2, 'bg-start');

        // 2. Title Label
        this.add.text(width / 2, 100, 'WORDZ FOR WIZDOM', {
            fontFamily: 'MagicFont',
            fontSize: '84px',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        let buttonX = (width / 2) * 1.6;
        // 3. Create Buttons
        this.createButton(buttonX, height * 0.5, 'PLAY', () => {
            this.scene.start('PlayerSelection');
        });

        this.createButton(buttonX, height * 0.65, 'SETTINGS', () => {
            this.scene.launch('Settings');
        });

        this.createButton(buttonX, height * 0.8, 'HELP', () => {
            this.scene.launch('Help');
        });
    }

    // Helper function to create interactive buttons easily
    createButton(x, y, label, callback) {

        // Button Container (Background + Text)
        this.container = this.add.container(x, y);
        const bg = this.add.image(0, 0, 'btn-start')
            .setScale(0.5)
            .setInteractive({ useHandCursor: true });

        const text = this.add.text(0, 0, label, {
            fontFamily: 'MagicFont', fontSize: '32px', color: '#ffffff', fontWeight: 'bold'
        }).setOrigin(0.5);

        this.container.add([bg, text]);
        this.container.setScale(0.7);
        // Interactivity
        bg.on('pointerover', () => bg.setTint(0xcccccc));
        bg.on('pointerout', () => bg.setTint(0xffffffff));
        bg.on('pointerdown', () => {
            this.sound.play('sfx-coin'); // Play sound when clicked
            callback();
        });
    }
}