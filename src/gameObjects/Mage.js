import StatBox from './Statbox.js';
export default class Mage extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.scene = scene;

    // 1. Set the Data FIRST
    this.maxHp = 100;
    this.hp = this.maxHp;
    this.maxShield = 50;
    this.shield = 0;
    this.currentPower = 0;
    this.maxPower = 100;
    this.maxMp = 100;
    this.Mp = 100;
    // 2. Create the Visuals
    this.sprite = scene.add.sprite(0, 0, 'player-mage');
    this.sprite.setScale(0.7).setFrame(1);

    this.createPowerBar();

    // 3. Create the StatBox (It will look at this.hp and this.maxHp automatically)
    // Put this AFTER you've defined hp/maxHp
    this.stats = new StatBox(scene, -this.x + 30, -this.y + 50, this);
    //this.stats.setScale(0.6);
    // 4. Add everything to the container
    this.stats.setScale(0.6);
    this.add([this.sprite, this.powerBarBg, this.powerBar, this.stats]);


    // Inside Mage constructor
    this.manaRegenTimer = this.scene.time.addEvent({
      delay: 3000,
      callback: () => {
        if (this.Mp < this.maxMp) {
          this.Mp += 5;
          if (this.Mp > this.maxMp) this.Mp = this.maxMp;

          // 1. Update the actual data
          this.stats.updateMana();

          // 2. Play the "Glow" animation on the icons
          // We target the icons that are currently "active" (blue)
          this.scene.tweens.add({
            targets: this.stats.manaIcons.filter(icon => icon.alpha > 0.6),
            alpha: 0.4,       // Dip down
            duration: 400,
            yoyo: true,       // Grow back to full opacity
            ease: 'Sine.easeInOut'
          });
        }
      },
      loop: true
    });
    scene.add.existing(this);
  }
  // Inside Mage class
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
  fire(wordLength, multiplier, isTarget) {
    let damage = wordLength * 10 * multiplier;
    if (isTarget) damage *= 2;

    // Ultimate Logic
    if (this.currentPower >= this.maxPower) {
      damage *= 2; // Double damage for Ultimate
      this.updatePower(-100); // This resets visuals automatically
    } else {
      this.updatePower(damage * 0.2);
    }

    this.playAttack(); // Triggers your mage's swing animation
    return damage;
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


  
  updateShieldVisuals() {
    // Whenever shield damage is taken, update the hearts
    this.stats.updateHealth();
  }

  onOutOfMana() {
    this.shakeManaBar();
  }
  takeDamage(amount) {
    this.hp -= amount;

    if (this.hp > this.maxHp) this.hp = this.maxHp;
    if (this.hp < 0) this.hp = 0;

    // Tell the StatBox to update its hearts
    this.stats.updateHealth(this.hp);

    if (amount > 0) this.flashRed();
  }

  fireSpell(isCritical, buffs, finalDamage, targetEnemy) {
    let color = isCritical ? 0xffcc00 : 0x00ffff;
    if (buffs.includes('fire')) color = 0xff4444;

    // Create the projectile at the Mage's position
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

        // 1. Use the correct names: finalDamage and targetEnemy
        this.scene.handleCombat(
          {
            attackDamage: finalDamage,
            isCritical: isCritical
          },
          targetEnemy
        );

        // 2. Add some power to the ultimate bar for a successful hit!
        this.updatePower(finalDamage * 0.1);
      }
    });
  }


}