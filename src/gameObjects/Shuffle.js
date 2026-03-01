import { Letter, FireLetter, HealLetter, ShieldLetter, VoidLetter, IceLetter } from './Letter.js';
export default class Shuffle extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, wheel) {
        super(scene, x, y, 'btn-shuffle');
        this.scene = scene;
        this.wheel = wheel;
        this.baseScale = 0.1;

        // Shadow design
        this.shadow = scene.add.sprite(x + 4, y + 4, 'btn-shuffle')
            .setTint(0x000000).setAlpha(0.4).setScale(this.baseScale).setDepth(this.depth - 1);

        this.setScale(this.baseScale);
        this.setInteractive({ useHandCursor: true });

        // Visual listeners stay here
        this.setupVisuals();

        // The Event Listener just calls the logic
        this.on('pointerdown', () => this.executeShuffle());

        scene.add.existing(this);
    }

    // Inside Shuffle.js -> executeShuffle()
executeShuffle() {
    if (!this.wheel || this.wheel.selectedSequence.length > 0) return;

    this.playClickAnimation();
    this.scene.sound.play('sfx-powerup', { volume: 0.5 });

    const count = this.wheel.letters.length;

    // 1. Updated effectClasses to include IceLetter
    const effectClasses = {
        'fire': FireLetter, 
        'heal': HealLetter,
        'shield': ShieldLetter, 
        'void': VoidLetter,
        'ice': IceLetter // ADDED THIS
    };

    // 2. Updated effectsData to include Cyan Ice
    const effectsData = [
        { name: 'fire', color: 0xff4444 }, 
        { name: 'heal', color: 0x44ff44 },
        { name: 'void', color: 0xaa44ff }, 
        { name: 'shield', color: 0x4444ff },
        { name: 'ice', color: 0x00ffff } // ADDED THIS
    ];

    // ... (rest of your logic for shuffling strings and assignments)
    this.wheel.letters = Phaser.Utils.Array.Shuffle(this.wheel.letters);

    let newAssignments = [...effectsData];
    while (newAssignments.length < count) {
        newAssignments.push({ name: 'normal', color: 0x444444 });
    }
    newAssignments = Phaser.Utils.Array.Shuffle(newAssignments.slice(0, count));

    // 3. Clear and Rebuild
    const oldLetterSprites = [...this.wheel.letterSprites];
    this.wheel.letterSprites = [];

    oldLetterSprites.forEach((bg, i) => {
        const oldLetterItem = bg.parentContainer;
        const data = newAssignments[i];
        const char = this.wheel.letters[i];

        this.scene.tweens.add({
            targets: oldLetterItem,
            x: 0, y: 0, alpha: 0,
            duration: 300,
            ease: 'Back.easeIn',
            onComplete: () => {
                oldLetterItem.destroy();

                const LetterClass = effectClasses[data.name] || Letter;
                const newLetterItem = new LetterClass(this.scene, 0, 0, char, data);

                newLetterItem.bg.parentContainer = newLetterItem;
                newLetterItem.alpha = 0;

                this.wheel.add(newLetterItem);
                this.wheel.letterSprites.push(newLetterItem.bg);

                const angle = (i / count) * (Math.PI * 2) - (Math.PI / 2);
                const lx = Math.cos(angle) * this.wheel.radius;
                const ly = Math.sin(angle) * this.wheel.radius;

                this.scene.tweens.add({
                    targets: newLetterItem,
                    x: lx, y: ly, alpha: 1,
                    duration: 600,
                    delay: i * 50,
                    ease: 'Back.easeOut',
                    onComplete: () => {
                        newLetterItem.bg.on('pointerdown', () => this.wheel.selectLetter(newLetterItem.bg));
                    }
                });
            }
        });
    });
}

    setupVisuals() {
        this.on('pointerover', () => {
            this.setTint(0xeeeeee);
            this.scene.tweens.add({ targets: [this, this.shadow], scale: this.baseScale * 1.1, duration: 150 });
        });
        this.on('pointerout', () => {
            this.clearTint();
            this.scene.tweens.add({ targets: [this, this.shadow], scale: this.baseScale, duration: 150 });
        });
    }

    playClickAnimation() {
        this.scene.tweens.add({ targets: [this, this.shadow], scale: this.baseScale * 0.8, duration: 100, yoyo: true });
    }
}