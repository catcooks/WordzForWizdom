import StatBox from './Statbox.js';

export default class Mob extends Phaser.GameObjects.Container {
  // Now accepts scene, position, and a config object from our JSON
  constructor(scene, x, y, config) {
    super(scene, x, y);
    this.scene = scene;

    // --- DATA FROM CONFIG ---
    this.maxHp = config.maxHp || 100;
    this.hp = this.maxHp;
    this.attackDamage = config.attackDamage || 10;
    this.attackSpeed = config.attackSpeed || 3000; // Delay between attacks
    this.isBoss = config.isBoss || false;

    // --- VISUALS ---
    // Use the texture key passed from the JSON
    this.sprite = scene.add.sprite(0, 0, config.texture);
    this.sprite.setScale(config.scale || 0.5);
    this.sprite.setFlipX(true);

    // --- DYNAMIC UI ---
    const heartOffset = (this.maxHp / 20) * (50 * 0.6);
    let X = (this.maxHp % 20 !== 0) ? 130 : 150;
    const dynamicX = (1070 + X) - heartOffset;

    this.stats = new StatBox(scene, -this.x + dynamicX, -this.y + 50, this);
    this.stats.setScale(0.6);

    this.add([this.sprite, this.stats]);
    scene.add.existing(this);

    // --- DYNAMIC ATTACK TIMER ---
    this.attackTimer = this.scene.time.addEvent({
      delay: this.attackSpeed, // Now uses the JSON speed
      callback: this.executeAttack,
      callbackScope: this,
      loop: true
    });
  }

  executeAttack() {
    if (this.hp <= 0) {
      if (this.attackTimer) this.attackTimer.remove();
      return;
    }

    // Bosses could have a bigger wind-up shake or different lunge
    this.scene.tweens.add({
      targets: this.sprite,
      x: this.isBoss ? 40 : 20, // Bosses pull back further
      duration: 200,
      yoyo: true,
      onComplete: () => {
        this.sprite.setFrame(1);
        this.scene.tweens.add({
          targets: this.sprite,
          x: this.isBoss ? -80 : -40, // Bosses lunge further
          duration: 100,
          yoyo: true,
          ease: 'Back.easeOut',
          onStart: () => {
            if (this.scene.player) {
              this.scene.handleCombat(this, this.scene.player);
            }
          },
          onComplete: () => {
            this.sprite.setFrame(0);
          }
        });
      }
    });
  }


  // Inside Mob.js class
  applyFreeze(duration) {
    if (this.isFrozen) return; // Don't stack freezes if already frozen

    this.isFrozen = true;

    // Visual feedback: Tint the enemy blue
    this.sprite.setTint(0x0099ff);

    // If the enemy has an attack timer/event, pause it
    if (this.attackTimer) this.attackTimer.paused = true;

    // Set a timer to thaw out
    this.scene.time.delayedCall(duration, () => {
      this.isFrozen = false;
      this.sprite.clearTint();

      // Resume attacking
      if (this.attackTimer) this.attackTimer.paused = false;

      this.scene.showDamageText(this.x, this.y, "THAWED", "#ffffff");
    });

    this.scene.showDamageText(this.x, this.y, "FROZEN!", "#00ffff");
  }

  takeDamage(amount) {
    this.hp = Phaser.Math.Clamp(this.hp - amount, 0, this.maxHp);
    this.stats.updateHealth(this.hp);
    this.flashRed();

    if (this.hp <= 0) {
      this.die();
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

  preDestroy() {
    if (this.attackTimer) this.attackTimer.remove();
  }

  die() {
    if (this.attackTimer) this.attackTimer.remove();

    this.scene.tweens.add({
      targets: this.sprite,
      y: 100,
      alpha: 0,
      angle: this.isBoss ? 0 : 90, // Bosses maybe sink instead of tipping?
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        this.destroy();
      }
    });

    if (this.stats) this.stats.setVisible(false);
  }
}