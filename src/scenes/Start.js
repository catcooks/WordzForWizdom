export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    create() {
        // Inside your create() method
        if (!this.sound.get('Time-for-adventure')) {
            this.bgm = this.sound.add('Time-for-adventure', {
                volume: 0.5,
                loop: true
            });
            this.bgm.play();
        } else if (!this.sound.get('Time-for-adventure').isPlaying) {
            this.sound.get('Time-for-adventure').play();
        }
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'bg-start');
        this.add.text(width / 2, 100, 'WORDZ FOR WIZDOM', {
            fontFamily: 'MagicFont',
            fontSize: '84px',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        let buttonX = (width / 2) * 1.6;
        let adjustHeight = -100
        this.createButton(buttonX, (height * 0.5)+adjustHeight, 'PLAY', () => {
            this.scene.start('PlayerSelection');
        });

        this.createButton(buttonX, (height * 0.65)+adjustHeight, 'SETTINGS', () => {

            this.scene.pause();


            this.scene.launch('Settings', { parentKey: this.scene.key });
        });

        this.createButton(buttonX, (height * 0.8)+adjustHeight, 'HELP', () => {
            this.scene.pause();
            this.scene.launch('Help', { parentKey: this.scene.key });
        });
        this.createButton(buttonX, (height * 0.95)+adjustHeight, 'Credits', () => {
            this.scene.pause();
            this.scene.launch('Credits');
        });
    }


    createButton(x, y, label, callback) {


        this.container = this.add.container(x, y);
        const bg = this.add.image(0, 0, 'btn-start')
            .setScale(0.5)
            .setInteractive({ useHandCursor: true });

        const text = this.add.text(0, 0, label, {
            fontFamily: 'MagicFont', fontSize: '32px', color: '#ffffff', fontWeight: 'bold'
        }).setOrigin(0.5);

        this.container.add([bg, text]);
        this.container.setScale(0.7);

        bg.on('pointerover', () => bg.setTint(0xcccccc));
        bg.on('pointerout', () => bg.setTint(0xffffffff));
        bg.on('pointerdown', () => {
            this.sound.play('sfx-coin');
            callback();
        });
    }
}