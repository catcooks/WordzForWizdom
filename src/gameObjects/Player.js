import StatBox from './Statbox.js';
import Entity from './Entity.js';
export default class Player extends Entity {
    constructor(scene, x, y, config) {
        super(scene, x, y);
        this.scene = scene;
        this.maxHp = config.maxHp || 100;
        this.hp = this.maxHp;
        this.maxShield = config.maxShield || 50;
        this.shield = 0;
        this.currentPower = 0;
        this.maxPower = 100;
        this.maxMp = config.maxMp || 100;
        this.Mp = this.maxMp;
        this.manaRegen = config.manaRegen || 5;
        this.sprite = scene.add.sprite(0, 0, config.texture);
        this.sprite.setScale(config.scale || 0.7).setFrame(config.frame || 0);
        this.createPowerBar();
        this.stats = new StatBox(scene, -this.x + 30, -this.y + 50, this);
        this.stats.setScale(0.6);
        this.add([this.sprite, this.powerBarBg, this.powerBar, this.stats]);
        this.manaRegenTimer = this.scene.time.addEvent({
            delay: 3000,
            callback: () => {
                if (this.Mp < this.maxMp) {
                    this.Mp = Phaser.Math.Clamp(this.Mp + this.manaRegen, 0, this.maxMp);
                    this.stats.updateMana();

                    this.scene.tweens.add({
                        targets: this.stats.manaIcons.filter(icon => icon.alpha > 0.6),
                        alpha: 0.4,
                        duration: 400,
                        yoyo: true,
                        ease: 'Sine.easeInOut'
                    });
                }
            },
            loop: true
        });

        scene.add.existing(this);
    }
    updateShieldVisuals() {
        this.stats.updateHealth();
    }
    onOutOfMana() {
        this.shakeManaBar();
    }
    fireSpell(isCritical, buffs, finalDamage, targetEnemy, onHitCallback) {
        let color = isCritical ? 0xffcc00 : 0x00ffff;
        if (buffs.includes('fire')) color = 0xff4444;

        const spell = this.scene.add.circle(this.x + 50, this.y - 50, 15, color);
        spell.setStrokeStyle(3, 0xffffff);

        this.scene.tweens.add({
            targets: spell,
            x: targetEnemy.x,
            y: targetEnemy.y - 100,
            duration: 400,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                spell.destroy();
                this.scene.handleCombat({ attackDamage: finalDamage, isCritical: isCritical }, targetEnemy);
                this.updatePower(finalDamage * 0.1);
                if (onHitCallback) onHitCallback();
            }
        });
    }

    onHealed(amount) {
        this.stats.updateHealth();
        this.stats.updateMana();
        this.scene.showDamageText(this.x, this.y, `+${amount}`, "#00ff00");
        this.sprite.setTint(0x00ff00);
        this.scene.time.delayedCall(200, () => this.sprite.clearTint());
    }
    onShielded() {
        this.stats.updateHealth();
        this.stats.updateMana();
        this.scene.showDamageText(this.x, this.y, "SHIELD UP!", "#00ffff");
    }
    shakeManaBar() {
        this.scene.tweens.add({
            targets: this.stats.manaIcons,
            x: '+=5',
            duration: 50,
            yoyo: true,
            repeat: 3,
            onStart: () => {

                this.stats.manaIcons.forEach(icon => icon.setTint(0x555555));
            },
            onComplete: () => this.stats.updateMana()
        });
    }

    fire(calculatedDamage, isTarget) {
        let finalDamage = calculatedDamage;
        if (this.currentPower >= this.maxPower) {
            finalDamage *= 2;
            this.updatePower(-100);
            this.scene.showDamageText(this.x, this.y - 100, "ULTIMATE!", "#ff00ff");
        } else {
            this.updatePower(finalDamage * 1);
        }

        this.playAttack();
        return finalDamage;
    }

    hit(amount) {
        this.takeDamage(amount);

    }
    createPowerBar() {
        this.gaugeRadius = 230;
        this.powerBarBg = this.scene.add.graphics();
        this.powerBarBg.lineStyle(30, 0x000000, 0.5);
        this.powerBarBg.strokeCircle(0, 0, this.gaugeRadius);
        this.powerBar = this.scene.add.graphics();


        this.powerData = { angle: 0 };

        this.add([this.powerBarBg, this.powerBar]);
    }

    updatePower(amount) {
        this.currentPower = Phaser.Math.Clamp(this.currentPower + amount, 0, this.maxPower);
        const targetAngle = (this.currentPower / this.maxPower) * 360;
        if (amount < 0) {

            this.scene.tweens.killTweensOf([this.powerBar, this.scene.letterWheel.wheelBackdrop]);
            this.powerBar.alpha = 1;
            if (this.scene.letterWheel.wheelBackdrop) {
                this.scene.letterWheel.wheelBackdrop.alpha = 0.5;
                if (typeof this.scene.letterWheel.wheelBackdrop.clearTint === 'function') {
                    this.scene.letterWheel.wheelBackdrop.clearTint();
                }
            }
            this.powerBar.clear();
            this.powerData.angle = 0;
            this.drawArc(0);
        }
        this.scene.tweens.add({
            targets: this.powerData,
            angle: targetAngle,
            duration: 600,
            ease: 'Cubic.easeOut',
            onUpdate: () => {
                this.drawArc(this.powerData.angle);
            }
        });
        if (this.currentPower >= this.maxPower && amount > 0) {

            this.scene.tweens.add({
                targets: this.powerBar,
                alpha: 0.3,
                duration: 400,
                yoyo: true,
                repeat: -1
            });

            const backdrop = this.scene.letterWheel.wheelBackdrop;
            if (backdrop) {
                this.scene.tweens.add({
                    targets: backdrop,
                    alpha: 0.8,
                    duration: 400,
                    yoyo: true,
                    repeat: -1
                });

                if (typeof backdrop.setTint === 'function') {
                    backdrop.setTint(0x00ffff);
                }
            }
        }
    }

    drawArc(currentAngle) {
        this.powerBar.clear();
        if (this.currentPower >= this.maxPower) {
            this.powerBar.lineStyle(14, 0x00ffff, 1);
        } else {
            this.powerBar.lineStyle(10, 0x00ffff, 0.8);
        }
        const start = Phaser.Math.DegToRad(-90);
        const end = Phaser.Math.DegToRad(-90 + currentAngle);
        this.powerBar.beginPath();
        this.powerBar.arc(0, 0, this.gaugeRadius, start, end, false);
        this.powerBar.strokePath();
    }


    playAttack() {

        if (this.sprite.anims && this.sprite.anims.exists('mage-attack')) {
            this.sprite.play('mage-attack');
        } else {

            this.sprite.setFrame(0);
            this.scene.time.delayedCall(300, () => this.sprite.setFrame(1));
        }
    }

}