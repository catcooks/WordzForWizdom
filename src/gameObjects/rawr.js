export class HealLetter extends Letter {
    constructor(scene, x, y, char, data) {
        super(scene, x, y, char, data);
        this.effectType = 'heal';
    }

    applyEffect(mage, amount) {
        if (mage && typeof mage.heal === 'function') {
            console.log("💚 Healing Mage!");
            mage.heal(amount); 
        }
    }
      heal(amount) {
    const manaCost = 10; // Set your cost here

    // 1. Check if the player has enough Mana
    if (this.Mp >= manaCost) {
      // 2. Spend the Mana
      this.Mp -= manaCost;

      // 3. Apply the Heal (Don't exceed maxHp)
      this.hp += amount;
      if (this.hp > this.maxHp) this.hp = this.maxHp;

      // 4. Update the UI
      // We tell the statbox to refresh both bars
      this.stats.updateHealth();
      this.stats.updateMana();

      // 5. Visual Feedback (Green flash for heal)
      this.scene.tweens.add({
        targets: this.sprite,
        tint: 0x00ff00,
        duration: 150,
        yoyo: true,
        onComplete: () => this.sprite.clearTint()
      });

      console.log(`Healed for ${amount}. Remaining MP: ${this.Mp}`);
    } else {
      // 6. Fail State (Not enough mana)
      console.log("Not enough Mana!");
      this.shakeManaBar(); // Optional visual hint
    }
  }
}

//Game.js
/* will some sort get the command and pass it to mage.js
*/

export default class Mage extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    let hp=100;
    updatehp()
    scene.add.existing(this);
  }
}


// you do not understand me I DONT want my heal to be hardcoded to mage.js because I will reuse it same with the fireletter or any effect letters mage isn't the only character I want to build thats why I make sure not to hard code any function into one file only 