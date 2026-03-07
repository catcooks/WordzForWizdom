import Boss from './Boss.js';

export default class OgreMage extends Boss {
  constructor(scene, x, y, config) {
    super(scene, x, y, config);

    this.idleFrame = 0;
    this.atkFrame = 5;
    this.healAmount = 100;
    this.isHealing = false;
    this.maxShield = config.maxShield || 50;
    this.shield = this.maxShield;

  }
// OgreMage.js
executeAttack() {
    if (this.hp <= 0) return;

    // 1. Switch to Attack Frame immediately
    this.sprite.setFrame(this.atkFrame);

    // 2. Deal damage to the player
    if (this.scene.player) {
        this.scene.handleCombat(this, this.scene.player);
    }

    // 3. If in Phase 3, trigger the Vampire Heal
    if (this.currentPhase === 3) {
        const lifeStealAmount = Math.round(this.attackDamage * 0.5);
        this.hp = Math.min(this.maxHp, this.hp + lifeStealAmount);
        
        if (this.stats) this.stats.updateHealth();
        this.scene.showDamageText(this.x, this.y, `VAMPIRE +${lifeStealAmount}`, "#cc00ff");

        // Purple flash visual
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.7,
            duration: 100,
            yoyo: true
        });
    }

    // 4. Return to Idle Frame after a short "swing" duration (e.g., 300ms)
    this.scene.time.delayedCall(300, () => {
        if (this.hp > 0) {
            this.sprite.setFrame(this.idleFrame);
        }
    });
}

  onPhaseChange(phase) {
    // PHASE 2 LOGIC
    if (phase === 2) {
      this.idleFrame = 1;
      this.atkFrame = 4;
      this.attackDamage = Math.round(this.attackDamage * 1.30);
      this.startShieldRegen();

      this.scene.showDamageText(this.x, this.y, "SHIELD REGEN ACTIVE!", "#00ffff");
    }

    // PHASE 3 LOGIC (Moved outside of the phase 2 block)
    else if (phase === 3) {
      this.idleFrame = 2;
      this.atkFrame = 3;

      // Stop the regen from Phase 2
      if (this.shieldRegenTimer) {
        this.shieldRegenTimer.remove();
        this.shieldRegenTimer = null;
      }
      this.shield = 0;

      this.scene.showDamageText(this.x, this.y, "LIFE STEAL!", "#cc00ff");
      this.scene.cameras.main.flash(500, 204, 0, 255);
    }
  }

  takeDamage(amount) {
    super.takeDamage(amount);

    const hpPercent = (this.hp / this.maxHp) * 100;

    // 1. Check for Phase 3 FIRST (Higher priority)
    if (hpPercent <= 30 && this.currentPhase === 2) {
      this.transitionToPhase(3);
      return; // Exit so we don't process other phase checks
    }

    // 2. Check for Phase 2 (Only if we are still in Phase 1)
    if (this.shield <= 0 && this.currentPhase === 1) {
      this.transitionToPhase(2);
    }
  }

  startShieldRegen() {
    // 2. Create a repeating timer every 5000ms (5 seconds)
    this.shieldRegenTimer = this.scene.time.addEvent({
      delay: 5000,
      callback: () => {
        if (this.hp > 0) {
          this.performShieldRegen(10); // Amount to regen every 5 seconds
        } else if (this.shieldRegenTimer) {
          this.shieldRegenTimer.remove(); // Stop if boss is dead
        }
      },
      loop: true
    });
  }

  performShieldRegen(amount) {
    // 3. Add to current shield but don't exceed maxShield
    this.shield = Math.min(this.maxShield, this.shield + amount);

    // Update the UI so the player sees the blue icons return
    if (this.stats) this.stats.updateHealth();

    // Visual feedback for the regen
    this.scene.showDamageText(this.x, this.y - 50, `SHIELD +${amount}`, "#00aaff");

    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.8,
      duration: 150,
      yoyo: true
    });
  }

  startHealCycle() {

    this.scene.time.addEvent({
      delay: 8000,
      callback: () => {
        if (this.hp > 0 && this.hp < this.maxHp) {
          this.performHeal();
        }
      },
      loop: true
    });
  }

  performHeal() {
    this.hp = Math.min(this.maxHp, this.hp + this.healAmount);
    this.stats.updateHealth();

    this.scene.showDamageText(this.x, this.y, `HEALED +${this.healAmount}`, "#00ff00");
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.5,
      duration: 200,
      yoyo: true,
      repeat: 2
    });
  }




  castFreeze() {
    this.scene.showDamageText(this.x, this.y, "FREEZE!", "#00ffff");


    if (this.scene.letterWheel) {
      this.scene.letterWheel.setLocked(true);
      this.scene.time.delayedCall(2000, () => {
        this.scene.letterWheel.setLocked(false);
      });
    }
  }


  die() {
    if (this.shieldRegenTimer) {
      this.shieldRegenTimer.remove();
    }
    super.die();
  }
}