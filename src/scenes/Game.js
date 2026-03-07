import LetterWheel from '../gameObjects/LetterWheel.js';
import Player from '../gameObjects/Player.js';
import Mob from '../gameObjects/Mob.js';
import Shuffle from '../gameObjects/Shuffle.js';
import CoolDown from '../gameObjects/WordCooldown.js';
import Boss from '../gameObjects/Boss.js';
import OgreMage from '../gameObjects/OgreMage.js';
import UIHelper from '../utils/UIHelper.js';
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


        const mobLibrary = this.cache.json.get('mobData');
        const bossLibrary = this.cache.json.get('bossData');
        const enemyKey = this.stageData.Enemy;

        if (bossLibrary && bossLibrary[enemyKey]) {

            const bossConfig = bossLibrary[enemyKey];
            this.mob = new OgreMage(this, 900, this.scale.height - 450, bossConfig);
        } else if (mobLibrary && mobLibrary[enemyKey]) {

            const mobConfig = mobLibrary[enemyKey];
            this.mob = new Mob(this, 900, this.scale.height - 500, mobConfig);
        }


        const playerLibrary = this.cache.json.get('playerData');
        const playerConfig = playerLibrary[this.playerType];
        this.player = new Player(this, 260, this.scale.height - 300, playerConfig);


        this.letterWheel = new LetterWheel(this, this.scale.width / 2, this.scale.height - 200);
        this.letterWheel.setScale(0.7);

        this.shuffleBtn = new Shuffle(this, this.letterWheel.x, this.letterWheel.y, this.letterWheel);
        this.cooldownUI = new CoolDown(this, this.letterWheel.x + 400, this.letterWheel.y + 200);
        this.player.powerBarBg.setPosition(this.letterWheel.x - this.player.x, this.letterWheel.y - this.player.y);
        this.player.powerBar.setPosition(this.letterWheel.x - this.player.x, this.letterWheel.y - this.player.y);
        this.player.powerBar.setScale(0.4);
        this.player.powerBarBg.setScale(0.4);
        UIHelper.createButton(this, this.scale.width / 2, 30, 1, 0.2, () => {
            this.scene.pause();
            this.scene.launch('Settings', { parentKey: this.scene.key });
        });

        this.setupInputs();
        console.log(`${this.stageKey} ready with ${enemyKey}`);
    }

    setupInputs() {

        this.input.keyboard.on('keydown-P', () => this.player.updatePower(100));
        this.input.keyboard.on('keydown-H', () => this.player.takeDamage(-90));
        this.input.keyboard.on('keydown-S', () => this.shuffleBtn.executeShuffle());
        this.input.keyboard.on('keydown-A', () => {
            if (this.mob && this.mob.hp > 0) {
                this.mob.takeDamage(90);
            }
        });
    }

    handleAttack(word, isTarget, letterObjects) {
        let rawBaseDamage = 0;
        let totalFreeze = 0;
        let effectsFound = [];
        let shouldSkipAttack = false;
        const length = word.length;

        const lowWord = word.toLowerCase();

        if (this.cooldownUI.isWordLocked(lowWord)) {
            this.showDamageText(this.player.x, this.player.y, "WORD ON COOLDOWN!", "#ff0000");
            this.sound.play('sfx-explosion');
            return;
        }


        const dynamicCooldown = Math.max(1000, 10000 - (word.length * 1000));

        this.cooldownUI.addWord(lowWord, dynamicCooldown);

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

        // 1. Process the damage (This triggers OgreMage shield logic!)
        target.takeDamage(damage);

        // 2. RE-ADD THE VISUAL UPDATE
        // This tells the StatBox to redraw hearts/shields/mana
        if (target.updateUI) {
            target.updateUI();
        } else if (target.stats) {
            // Fallback if updateUI doesn't exist on the object
            target.stats.updateHealth();
        }

        // --- Visual Effects ---
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

        // --- Death Checks ---
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
        this.tweens.killTweensOf(this.player.sprite);
        this.tweens.killTweensOf(this.player);
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