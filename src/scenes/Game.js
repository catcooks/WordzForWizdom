import LetterWheel from '../gameObjects/LetterWheel.js';
import Player from '../gameObjects/Player.js';
import Mob from '../gameObjects/Mob.js'; // Renamed from Goblin
import Shuffle from '../gameObjects/Shuffle.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init(data) {
        // Receives level number (e.g., 1), defaults to 1
        this.currentLevelNum = data.level || 1;
        this.playerType = data.playerType || 'Mage';
        // Format key to match your JSON (Stage01, Stage02, etc.)
        this.stageKey = `Stage${this.currentLevelNum.toString().padStart(2, '0')}`;

        const allStages = this.cache.json.get('stageData');
        this.stageData = allStages[this.stageKey];

        if (!this.stageData) {
            console.error(`Data for ${this.stageKey} not found!`);
        }
    }

    create() {
        // 1. SETUP BACKGROUND FIRST (The bottom layer)
        this.add.image(this.scale.width / 2, this.scale.height / 2, this.stageData.Background);

        // 2. SPAWN PLAYER (Now drawn on top of background)
        // In Game.js create()
        const playerLibrary = this.cache.json.get('playerData');
        const playerConfig = playerLibrary[this.playerType]; // Uses 'Mage' from selection

        this.player = new Player(this, 260, this.scale.height - 300, playerConfig);

        // 3. Setup Entities (Mob)
        const mobLibrary = this.cache.json.get('mobData');
        const mobConfig = mobLibrary[this.stageData.Enemy];
        this.mob = new Mob(this, 900, this.scale.height - 500, mobConfig);
        // 4. Setup Wheel and UI
        this.letterWheel = new LetterWheel(this, this.scale.width / 2, this.scale.height - 200);
        this.letterWheel.setScale(0.7);

        const offsetX = this.letterWheel.x - this.player.x;
        const offsetY = this.letterWheel.y - this.player.y;
        this.shuffleBtn = new Shuffle(this, this.letterWheel.x, this.letterWheel.y, this.letterWheel);

        // Align Player Power Bar to the Wheel position as per your design
        this.player.powerBarBg.setPosition(offsetX, offsetY);
        this.player.powerBar.setPosition(offsetX, offsetY);
        this.player.powerBar.setScale(0.4);
        this.player.powerBarBg.setScale(0.4);

        this.setupInputs();

        console.log(`${this.stageKey} initialized with ${this.stageData.Enemy}`);
    }

    setupInputs() {
        // Cheat keys and Controls
        this.input.keyboard.on('keydown-P', () => this.player.updatePower(100));
        this.input.keyboard.on('keydown-H', () => this.player.takeDamage(-90));
        this.input.keyboard.on('keydown-S', () => this.shuffleBtn.executeShuffle());
        this.input.keyboard.on('keydown-A', () => this.mob.takeDamage(90));
    }

    handleAttack(word, isTarget, letterObjects) {
        let totalDamage = 0;
        let effectsFound = [];
        let shouldSkipAttack = false;
        let length = word.length;

        letterObjects.forEach((letter, i) => {
            if (typeof letter.execute === 'function') {
                const result = letter.execute(this.player, this.mob, i, length);
                if (result.cancelAttack) shouldSkipAttack = true;
                totalDamage += result.damage;
                if (result.isUsed) effectsFound.push(letter.effectType);
                if (result.isCritical) isTarget = true;
            } else {
                totalDamage += 5;
            }
        });

        if (!shouldSkipAttack) {
            this.player.fireSpell(isTarget, effectsFound, totalDamage, this.mob);
        }
    }

    handleCombat(attacker, target) {
        if (!target || target.hp <= 0) return;

        let damage = attacker.attackDamage || 0;

        if (attacker.isCritical) {
            this.showDamageText(target.x, target.y - 100, "CRITICAL!", "#ffff00");
        }

        // Shield logic
        if (target.shield && target.shield > 0) {
            if (damage >= target.shield) {
                damage -= target.shield;
                target.shield = 0;
            } else {
                target.shield -= damage;
                damage = 0;
            }
            if (target.updateShieldVisuals) target.updateShieldVisuals();
        }

        target.hp = Math.max(0, target.hp - damage);
        if (target.stats) target.stats.updateHealth();

        // Visuals
        const color = (damage === 0) ? "#00ffff" : "#ff0000";
        const text = (damage === 0) ? "BLOCKED" : `-${damage}`;
        this.showDamageText(target.x, target.y, text, color);

        this.cameras.main.shake(100, 0.01);
        this.tweens.add({
            targets: target.sprite,
            tint: 0xff0000,
            duration: 100,
            yoyo: true,
            onComplete: () => target.sprite.clearTint()
        });

        // Check for Death
        if (target.hp <= 0) {
            if (typeof target.die === 'function') target.die();

            // If the Mob died, trigger next stage after a delay
            if (target === this.mob) {
                this.time.delayedCall(2000, () => this.nextStage());
            }
        }

        if (this.player.hp <= 0) {
            this.triggerGameOver();
        }
    }

    nextStage() {
        const nextLevel = this.currentLevelNum + 1;
        const nextKey = `Stage${nextLevel.toString().padStart(2, '0')}`;
        const allStages = this.cache.json.get('stageData');

        if (allStages[nextKey]) {
            // Only restart once, passing both the new level and the current player type
            this.scene.restart({
                level: nextLevel,
                playerType: this.playerType
            });
        } else {
            console.log("ALL STAGES CLEARED!");
            // this.scene.start('VictoryScreen');
        }
    }

    triggerGameOver() {
        this.time.delayedCall(1000, () => {
            this.scene.pause();
            this.scene.launch('GameOver', { score: this.currentScore });
        });
    }

    showDamageText(x, y, amount, textColor = '#ff0000') {
        const text = this.add.text(x, y - 50, amount, {
            fontFamily: 'MagicFont',
            fontSize: '48px',
            color: textColor,
            stroke: '#ffffff',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            y: y - 150,
            alpha: 0,
            duration: 1500,
            ease: 'Cubic.easeOut',
            onComplete: () => text.destroy()
        });
    }
}