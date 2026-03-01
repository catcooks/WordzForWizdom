import StatBox from './Statbox.js';

export default class Player extends Phaser.GameObjects.Container {
    constructor(scene, x, y, config) {
        super(scene, x, y);
        this.scene = scene;

        // 1. Set the Data from Config
        this.maxHp = config.maxHp || 100;
        this.hp = this.maxHp;
        this.maxShield = config.maxShield || 50;
        this.shield = 0;
        this.currentPower = 0;
        this.maxPower = 100;
        this.maxMp = config.maxMp || 100;
        this.Mp = this.maxMp;
        this.manaRegen = config.manaRegen || 5;

        // 2. Create the Visuals
        this.sprite = scene.add.sprite(0, 0, config.texture);
        this.sprite.setScale(config.scale || 0.7).setFrame(config.frame || 0);

        this.createPowerBar();

        // 3. Create the StatBox
        this.stats = new StatBox(scene, -this.x + 30, -this.y + 50, this);
        this.stats.setScale(0.6);

        // 4. Add to container
        this.add([this.sprite, this.powerBarBg, this.powerBar, this.stats]);

        // --- DYNAMIC MANA REGEN ---
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





    // ... (Keep all your existing methods: onHealed, takeDamage, fireSpell, etc.)
    // Just ensure they reference 'this.hp' and 'this.Mp' as you already have them!
    updateShieldVisuals() {
        this.stats.updateHealth();
    }
    onOutOfMana() {
        this.shakeManaBar();
    }
    takeDamage(amount) {
        if (this.hp <= 0) return;

        this.hp = Phaser.Math.Clamp(this.hp - amount, 0, this.maxHp);
        this.stats.updateHealth();

        if (amount > 0) {
            this.scene.cameras.main.shake(200, 0.01);
            this.flashRed();
        }
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

                // TRIGGER THE FREEZE HERE
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
        // We don't need to tint the sprite if the hearts are tinted!
        // Just tell the UI to refresh
        this.stats.updateHealth();
        this.stats.updateMana();
        this.scene.showDamageText(this.x, this.y, "SHIELD UP!", "#00ffff");
    }
    shakeManaBar() {
        this.scene.tweens.add({
            targets: this.stats.manaIcons, // Shake all gems
            x: '+=5',
            duration: 50,
            yoyo: true,
            repeat: 3,
            onStart: () => {
                // Tint them slightly grey/dark to show they are empty
                this.stats.manaIcons.forEach(icon => icon.setTint(0x555555));
            },
            onComplete: () => this.stats.updateMana() // Reset colors
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
        // Add hurt animations or screen shakes here
    }


    createPowerBar() {
        this.gaugeRadius = 230;

        // 2. Background Track (Static)
        this.powerBarBg = this.scene.add.graphics();
        this.powerBarBg.lineStyle(30, 0x000000, 0.5);
        this.powerBarBg.strokeCircle(0, 0, this.gaugeRadius);

        // 3. The Filling Arc (Dynamic)
        this.powerBar = this.scene.add.graphics();

        // Create a dummy object to tween the angle property
        this.powerData = { angle: 0 };

        this.add([this.powerBarBg, this.powerBar]);
    }

    updatePower(amount) {
        this.currentPower = Phaser.Math.Clamp(this.currentPower + amount, 0, this.maxPower);
        const targetAngle = (this.currentPower / this.maxPower) * 360;

        // 2. CHECK FOR RESET: If we are spending power (amount is negative)
        if (amount < 0) {
            // Stop all pulsing tweens immediately
            this.scene.tweens.killTweensOf([this.powerBar, this.scene.letterWheel.wheelBackdrop]);

            // Reset Alphas and Tints
            this.powerBar.alpha = 1;
            if (this.scene.letterWheel.wheelBackdrop) {
                this.scene.letterWheel.wheelBackdrop.alpha = 0.5;
                if (typeof this.scene.letterWheel.wheelBackdrop.clearTint === 'function') {
                    this.scene.letterWheel.wheelBackdrop.clearTint();
                }
            }

            // Force the bar back to 0 visually
            this.powerBar.clear();
            this.powerData.angle = 0;
            this.drawArc(0);
        }

        // 3. Smoothly animate the arc filling up (This always runs)
        this.scene.tweens.add({
            targets: this.powerData,
            angle: targetAngle,
            duration: 600,
            ease: 'Cubic.easeOut',
            onUpdate: () => {
                this.drawArc(this.powerData.angle);
            }
        });

        // 4. ACTIVATE GLOW: Only if we are at max and NOT resetting
        if (this.currentPower >= this.maxPower && amount > 0) {
            // Make the Power Bar pulse
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

        // Visual style: Change color when full
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
        // If you have the 'mage-attack' anim defined in Game.js or Preloader
        if (this.sprite.anims && this.sprite.anims.exists('mage-attack')) {
            this.sprite.play('mage-attack');
        } else {
            // Visual feedback if no animation yet
            this.sprite.setFrame(0);
            this.scene.time.delayedCall(300, () => this.sprite.setFrame(1));
        }
    }

    flashRed() {
        this.scene.tweens.add({
            targets: this.sprite,
            tint: 0xff0000,
            duration: 100,
            yoyo: true,
            onComplete: () => this.sprite.clearTint()
        });
    }
}