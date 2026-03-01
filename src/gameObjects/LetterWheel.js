import { Letter, FireLetter, HealLetter, ShieldLetter, VoidLetter, IceLetter } from './Letter.js';

export default class LetterWheel extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.scene = scene;

        // Data setup
        const data = scene.cache.json.get('words');
        const wordList = Object.keys(data);
        const randomWord = Phaser.Math.RND.pick(wordList).toUpperCase();
        this.targetWord = randomWord;
        this.letters = Phaser.Utils.Array.Shuffle(randomWord.split(''));

        console.log("Target Word:", this.targetWord);

        this.radius = 180;
        this.letterSprites = [];
        this.selectedSequence = [];
        this.lineGraphics = scene.add.graphics();
        this.add(this.lineGraphics);

        this.wheelBackdrop = scene.add.graphics();
        this.wheelBackdrop.fillStyle(0xffffff, 1);
        this.wheelBackdrop.fillCircle(0, 0, this.radius + 60);
        this.wheelBackdrop.setAlpha(0.1);
        this.add(this.wheelBackdrop);
        this.sendToBack(this.wheelBackdrop);

        this.pulseTween = this.scene.tweens.add({
            targets: this.wheelBackdrop,
            alpha: 0.3,
            scale: 1.05,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.inputTextUI = scene.add.text(0, -this.radius - 60, '', {
            fontFamily: 'MagicFont',
            fontSize: '42px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        this.add(this.inputTextUI);

        scene.add.existing(this);

        this.createWheel();
        this.setupGlobalListeners();
    }

    createWheel() {
        const count = this.letters.length;
        const effectClasses = {
            'fire': FireLetter,
            'heal': HealLetter,
            'shield': ShieldLetter,
            'void': VoidLetter,
            'ice': IceLetter // 1. Map the new ice class
        };

        const effectsData = [
            { name: 'fire', color: 0xff4444 },
            { name: 'heal', color: 0x44ff44 },
            { name: 'void', color: 0xaa44ff },
            { name: 'shield', color: 0x4444ff },
            { name: 'ice', color: 0x00ffff } // 2. Add Ice with Cyan color
        ];

        let letterAssignments = [...effectsData];
        while (letterAssignments.length < count) {
            letterAssignments.push({ name: 'normal', color: 0x444444 });
        }
        letterAssignments = Phaser.Utils.Array.Shuffle(letterAssignments.slice(0, count));

        this.letters.forEach((char, i) => {
            const angle = (i / count) * (Math.PI * 2) - (Math.PI / 2);
            const lx = Math.cos(angle) * this.radius;
            const ly = Math.sin(angle) * this.radius;

            const data = letterAssignments[i];
            const LetterClass = effectClasses[data.name] || Letter;

            const letterItem = new LetterClass(this.scene, 0, 0, char, data);
            letterItem.bg.parentContainer = letterItem;
            letterItem.alpha = 0;

            this.add(letterItem);
            this.letterSprites.push(letterItem.bg);

            this.scene.tweens.add({
                targets: letterItem,
                x: lx,
                y: ly,
                alpha: 1,
                duration: 600,
                delay: i * 50,
                ease: 'Back.easeOut',
                onComplete: () => {
                    letterItem.bg.on('pointerdown', () => this.selectLetter(letterItem.bg));
                }
            });
        });

        this.scene.input.on('pointerup', () => this.submitWord());
    }

    setupGlobalListeners() {
        this.scene.input.on('pointermove', (pointer) => {
            if (pointer.isDown && this.selectedSequence.length > 0) {
                this.drawLines();

                const localPoint = this.getRelativePointerValue(pointer);
                const lastSprite = this.selectedSequence[this.selectedSequence.length - 1];
                const lastItem = lastSprite.parentContainer;

                this.lineGraphics.lineStyle(8, 0x00ff00, 0.5);
                this.lineGraphics.lineBetween(lastItem.x, lastItem.y, localPoint.x, localPoint.y);

                const objectsUnderPointer = this.scene.input.hitTestPointer(pointer);
                objectsUnderPointer.forEach(obj => {
                    if (this.letterSprites.includes(obj)) {
                        if (this.selectedSequence.length > 1 && obj === this.selectedSequence[this.selectedSequence.length - 2]) {
                            this.deselectLastLetter();
                        } else if (!this.selectedSequence.includes(obj)) {
                            this.selectLetter(obj);
                        }
                    }
                });
            }
        });
    }

    deselectLastLetter() {
        const lastSprite = this.selectedSequence.pop();
        const letterItem = lastSprite.parentContainer;

        lastSprite.setFillStyle(letterItem.baseColor);
        letterItem.textRef.setColor('#ffffff');

        const currentWordStr = this.selectedSequence.map(s => s.parentContainer.char).join('');
        this.inputTextUI.setText(currentWordStr);
        this.updateUIStatus(currentWordStr);

        this.drawLines();
        this.updateBackdropEffect(true);
        this.scene.sound.play('sfx-coin', { volume: 0.3, pitch: 0.8 });
    }

    updateUIStatus(word) {
        const dictionary = this.scene.cache.json.get('dictionary');
        const upperWord = word.toUpperCase();
        const lowerWord = word.toLowerCase();

        if (upperWord === this.targetWord) {
            this.inputTextUI.setColor('#f700ff').setFontSize('48px');
        } else if (dictionary.hasOwnProperty(lowerWord)) {
            this.inputTextUI.setColor('#ffff00').setFontSize('42px');
        } else {
            this.inputTextUI.setColor('#ffffff').setFontSize('42px');
        }
    }

    drawLines() {
        this.lineGraphics.clear();
        if (this.selectedSequence.length < 1) return;

        const colorStr = this.inputTextUI.style.color;
        let lineColor = 0x00ff00;

        if (colorStr === '#f700ff') lineColor = 0xf700ff;
        if (colorStr === '#ffff00') lineColor = 0xffff00;

        const firstLetter = this.selectedSequence[0].parentContainer;
        if (firstLetter.effectType === 'shield') {
            lineColor = 0x00ffff;
        } else if (firstLetter.effectType === 'heal') {
            lineColor = 0x44ff44;
        }

        this.lineGraphics.lineStyle(10, lineColor, 0.8);
        this.lineGraphics.beginPath();
        const firstItem = this.selectedSequence[0].parentContainer;
        this.lineGraphics.moveTo(firstItem.x, firstItem.y);

        for (let i = 1; i < this.selectedSequence.length; i++) {
            const nextItem = this.selectedSequence[i].parentContainer;
            this.lineGraphics.lineTo(nextItem.x, nextItem.y);
        }
        this.lineGraphics.strokePath();
    }

    selectLetter(bg) {
        const letterItem = bg.parentContainer;
        if (!this.selectedSequence.includes(bg)) {
            this.selectedSequence.push(bg);
            const currentWordStr = this.selectedSequence.map(s => s.parentContainer.char).join('');
            this.inputTextUI.setText(currentWordStr);
            this.updateUIStatus(currentWordStr);

            bg.setFillStyle(0x009d4c);
            letterItem.textRef.setColor('#000000');

            this.scene.sound.play('sfx-coin', {
                volume: 0.5, pitch: 1 + (this.selectedSequence.length * 0.1)
            });

            this.drawLines();
            this.updateBackdropEffect(true);
        }
    }

    submitWord() {
        if (this.selectedSequence.length === 0) return;

        if (this.selectedSequence.length < 3) {
            this.resetWheelUI();
            return;
        }

        const spelledWord = this.selectedSequence.map(s => s.parentContainer.char).join('').toLowerCase();
        const dictionary = this.scene.cache.json.get('dictionary');
        const isTarget = (spelledWord.toUpperCase() === this.targetWord);
        const isValidWord = dictionary.hasOwnProperty(spelledWord) || isTarget;

        if (isValidWord) {
            // PASS THE WHOLE ARRAY of selected letter items
            const letterObjects = this.selectedSequence.map(s => s.parentContainer);
            this.scene.handleAttack(spelledWord, isTarget, letterObjects);
        } else {
            this.scene.cameras.main.shake(100, 0.005);
        }

        this.resetWheelUI();
    }

    resetWheelUI() {
        this.inputTextUI.setText('').setColor('#ffffff');
        this.selectedSequence.forEach(sprite => {
            sprite.setFillStyle(sprite.parentContainer.baseColor);
            sprite.parentContainer.textRef.setColor('#ffffff');
        });

        this.updateBackdropEffect(false);
        this.selectedSequence = [];
        this.lineGraphics.clear();
    }

    getRelativePointerValue(pointer) {
        return {
            x: (pointer.x - this.x) / this.scaleX,
            y: (pointer.y - this.y) / this.scaleY
        };
    }




    updateBackdropEffect(isDragging) {
        this.wheelBackdrop.clear();
        if (isDragging && this.selectedSequence.length > 0) {
            const firstLetter = this.selectedSequence[0].parentContainer;
            let tintColor = 0xffffff;

            if (firstLetter.effectType === 'shield') tintColor = 0x00ffff;
            else if (firstLetter.effectType === 'heal') tintColor = 0x44ff44;
            else {
                const colorStr = this.inputTextUI.style.color;
                if (colorStr === '#f700ff') tintColor = 0xf700ff;
                else if (colorStr === '#ffff00') tintColor = 0xffff00;
            }

            this.wheelBackdrop.fillStyle(tintColor, 1);
            this.wheelBackdrop.fillCircle(0, 0, this.radius + 60);
            this.pulseTween.setTimeScale(3);
        } else {
            this.wheelBackdrop.fillStyle(0xffffff, 1);
            this.wheelBackdrop.fillCircle(0, 0, this.radius + 60);
            this.pulseTween.setTimeScale(1);
        }
    }
}