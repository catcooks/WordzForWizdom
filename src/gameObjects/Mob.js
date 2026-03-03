import Entity from './Entity.js';
import StatBox from './Statbox.js';

export default class Mob extends Entity {
  constructor(scene, x, y, config) {
    // 1. Call the Entity constructor
    super(scene, x, y, config.texture, config.maxHp || 100);

    // 2. Mob-specific data
    this.attackDamage = config.attackDamage || 10;
    this.attackSpeed = config.attackSpeed || 3000;
    this.isBoss = config.isBoss || false;
    this.sprite.setScale(config.scale || 0.5);
    this.sprite.setFlipX(true);

    // 3. Setup Mob-specific UI
    const heartOffset = (this.maxHp / 20) * (50 * 0.6);
    let X = (this.maxHp % 20 !== 0) ? 130 : 150;
    const dynamicX = (1070 + X) - heartOffset;
    this.stats = new StatBox(scene, -this.x + dynamicX, -this.y + 50, this);
    this.stats.setScale(0.6);
    this.add(this.stats);

    // 4. Setup Attack Timer (Entity will pause this automatically via 'this.timer')
    this.timer = this.scene.time.addEvent({
      delay: this.attackSpeed,
      callback: this.executeAttack,
      callbackScope: this,
      loop: true
    });
  }

  // Tell Entity how to update the Mob's specific HP bar
  updateUI() {
    if (this.stats) this.stats.updateHealth(this.hp);
  }

  executeAttack() {
    if (this.hp <= 0) {
      if (this.attackTimer) this.attackTimer.remove();
      return;
    }
    this.scene.tweens.add({
      targets: this.sprite,
      x: this.isBoss ? 40 : 20,
      duration: 200,
      yoyo: true,
      onComplete: () => {
        this.sprite.setFrame(1);
        this.scene.tweens.add({
          targets: this.sprite,
          x: this.isBoss ? -80 : -40,
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

  // Override die() because mobs have a unique "tip over" animation
  die() {
    if (this.timer) this.timer.remove();
    this.scene.tweens.add({
      targets: this.sprite,
      y: 100,
      alpha: 0,
      angle: this.isBoss ? 0 : 90,
      duration: 800,
      onComplete: () => this.destroy()
    });
    if (this.stats) this.stats.setVisible(false);
  }
}