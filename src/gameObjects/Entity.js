export default class Entity extends Phaser.GameObjects.Container {
    constructor(scene, x, y, texture, maxHp) {
        super(scene, x, y);
        this.scene = scene;
        this.maxHp = maxHp;
        this.hp = maxHp;
        this.isFrozen = false;

        // Visual setup
        this.sprite = scene.add.sprite(0, 0, texture);
        this.add(this.sprite);
        scene.add.existing(this);
    }

    takeDamage(amount) {
        this.hp = Phaser.Math.Clamp(this.hp - amount, 0, this.maxHp);
        this.flashRed();
        
        // This is where Mob or Player will update their specific bars
        if (this.updateUI) this.updateUI();

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
            onComplete: () => {
                if (this.isFrozen) this.sprite.setTint(0x0099ff);
                else this.sprite.clearTint();
            }
        });
    }

    // SHARED FREEZE LOGIC
    applyFreeze(duration) {
        if (this.isFrozen) return;
        this.isFrozen = true;
        this.sprite.setTint(0x0099ff);

        // If this entity has a timer (like the Mob's attack timer), pause it
        if (this.timer) this.timer.paused = true;

        this.scene.time.delayedCall(duration, () => {
            if (!this.scene || !this.active) return;
            this.isFrozen = false;
            this.sprite.clearTint();
            if (this.timer) this.timer.paused = false;
            this.scene.showDamageText(this.x, this.y, "THAWED", "#ffffff");
        });

        this.scene.showDamageText(this.x, this.y, "FROZEN!", "#00ffff");
    }

    die() {
        // Standard death: fade out. Overwrite this in Mob.js for the "tip over" animation
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 800,
            onComplete: () => this.destroy()
        });
    }
}