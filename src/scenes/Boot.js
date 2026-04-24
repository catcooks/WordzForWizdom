<<<<<<< HEAD
//src/scenes/Boot.js
export class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image('bg-loading', 'assets/backgrounds/bg_loading.png');
    }

    create() {
        this.add.text(0, 0, '', { fontFamily: 'MagicFont' });
        this.scene.start('Preloader');
    }
=======
//src/scenes/Boot.js
export class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image('bg-loading', 'assets/backgrounds/bg_loading.png');
    }

    create() {
        this.add.text(0, 0, '', { fontFamily: 'MagicFont' });
        this.scene.start('Preloader');
    }
>>>>>>> b733ca7 (Updated files from my device)
}