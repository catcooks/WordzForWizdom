import LetterWheel from '../gameObjects/LetterWheel.js';
import Player from '../gameObjects/Player.js';
import Mob from '../gameObjects/Mob.js';
import Shuffle from '../gameObjects/Shuffle.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init(data) {

        this.currentLevelNum = data.level || 1;
        this.playerType = data.playerType || 'Mage';

        this.stageKey = `Stage${this.currentLevelNum.toString().padStart(2, '0')}`;

        const allStages = this.cache.json.get('stageData');
        this.stageData = allStages[this.stageKey];

        if (!this.stageData) {
            console.error(`Data for ${this.stageKey} not found!`);
        }
    }

    create() {

        this.add.image(this.scale.width / 2, this.scale.height / 2, this.stageData.Background);

        const playerLibrary = this.cache.json.get('playerData');
        const playerConfig = playerLibrary[this.playerType];

        this.player = new Player(this, 260, this.scale.height - 300, playerConfig);


        const mobLibrary = this.cache.json.get('mobData');
        const mobConfig = mobLibrary[this.stageData.Enemy];
        this.mob = new Mob(this, 900, this.scale.height - 500, mobConfig);

        this.letterWheel = new LetterWheel(this, this.scale.width / 2, this.scale.height - 200);
        this.letterWheel.setScale(0.7);

        const offsetX = this.letterWheel.x - this.player.x;
        const offsetY = this.letterWheel.y - this.player.y;
        this.shuffleBtn = new Shuffle(this, this.letterWheel.x, this.letterWheel.y, this.letterWheel);

        this.player.powerBarBg.setPosition(offsetX, offsetY);
        this.player.powerBar.setPosition(offsetX, offsetY);
        this.player.powerBar.setScale(0.4);
        this.player.powerBarBg.setScale(0.4);
        this.createButton(this.scale.width / 2, 30, 1, 0.2, () => {
            this.scene.pause();
            this.scene.launch('Settings', { parentKey: this.scene.key });
        });
        this.setupInputs();


        console.log(`${this.stageKey} initialized with ${this.stageData.Enemy}`);
    }

    setupInputs() {

        this.input.keyboard.on('keydown-P', () => this.player.updatePower(100));
        this.input.keyboard.on('keydown-H', () => this.player.takeDamage(-90));
        this.input.keyboard.on('keydown-S', () => this.shuffleBtn.executeShuffle());
        this.input.keyboard.on('keydown-A', () => this.mob.takeDamage(90));
    }
    createButton(x, y, frame, scale, callback) {
        const btnContainer = this.add.container(x, y);
        const btn = this.add.sprite(0, 0, 'button', frame)
            .setScale(scale)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        btn.setName('icon');
        btnContainer.add(btn);
        btn.on('pointerover', () => btn.setTint(0xcccccc));
        btn.on('pointerout', () => btn.setTint(0xffffffff));
        btn.on('pointerdown', () => {
            this.sound.play('sfx-coin');
            callback();
        });
    }

    handleAttack(word, isTarget, letterObjects) {
        let rawBaseDamage = 0;
        let totalFreeze = 0;
        let effectsFound = [];
        let shouldSkipAttack = false;
        const length = word.length;


        let totalMultiplier = 1;

        letterObjects.forEach(l => {
            if (l.effectType === 'fire') totalMultiplier *= 1.5;
        });

        letterObjects.forEach((letter, i) => {
            if (typeof letter.execute === 'function') {
                const result = letter.execute(this.player, this.mob, i, length);


                if (result.isCritical) isTarget = true;
                if (result.cancelAttack) shouldSkipAttack = true;
                if (result.isUsed) effectsFound.push(letter.effectType);


                rawBaseDamage += result.damage;


                if (result.freezePower) {
                    totalFreeze += (result.freezePower * Math.max(1, Math.round(length / 4))) * totalMultiplier;
                }
            } else {

                rawBaseDamage += 5;
            }
        });
        let finalDamage = Math.round(rawBaseDamage * totalMultiplier);

        if (shouldSkipAttack) {
            if (totalFreeze > 0) this.mob.applyFreeze(totalFreeze);

        } else {
            const actualDamageDealt = this.player.fire(finalDamage, isTarget);

            this.player.fireSpell(isTarget, effectsFound, actualDamageDealt, this.mob, () => {
                if (totalFreeze > 0) {
                    this.mob.applyFreeze(totalFreeze);
                }
            });
        }
    }

    handleCombat(attacker, target) {
        if (!target || target.hp <= 0) return;

        let damage = attacker.attackDamage || 0;

        if (attacker.isCritical) {
            this.showDamageText(target.x, target.y - 100, "CRITICAL!", "#ffff00");
        }

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


        const color = (damage === 0) ? "#00ffff" : "#ff0000";
        const text = (damage === 0) ? "BLOCKED" : `-${damage}`;
        this.showDamageText(target.x, target.y, text, color);

        this.cameras.main.shake(100, 0.01);
        this.tweens.add({
            targets: target.sprite,
            tint: 0xff0000,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                if (target.isFrozen) {
                    target.sprite.setTint(0x00ffff);
                } else {
                    target.sprite.clearTint();
                }
            }
        });


        if (target.hp <= 0) {
            if (typeof target.die === 'function') target.die();


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
            this.scene.restart({
                level: nextLevel,
                playerType: this.playerType
            });
        } else {
            console.log("ALL STAGES CLEARED!");
            this.scene.start('Credits');
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