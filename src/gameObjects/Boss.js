import Mob from './Mob.js';

export default class Boss extends Mob {
    constructor(scene, x, y, config) {
        // Boss uses the same setup as a Mob, but we add more stats
        super(scene, x, y, config);

        this.isBoss = true;
        this.currentPhase = 1;
        this.maxPhases = config.maxPhases || 2;
        
        // Shield logic (Standard mobs might not have this)
        this.maxShield = config.shield || 0;
        this.shield = this.maxShield;

        // Visual distinction: let's make bosses slightly larger by default
        this.sprite.setScale(this.sprite.scale * 1.5);
    }

    // Override the takeDamage function to include Shield logic
    takeDamage(amount) {
        if (this.shield > 0) {
            this.shield -= amount;
            
            // If damage breaks the shield, carry the rest over to HP
            if (this.shield < 0) {
                const overflowDamage = Math.abs(this.shield);
                this.shield = 0;
                super.takeDamage(overflowDamage);
            } else {
                // Shield absorbed everything!
                this.scene.showDamageText(this.x, this.y, "SHIELDED", "#00ffff");
            }
        } else {
            super.takeDamage(amount);
        }

        // After taking damage, check if we should trigger Phase 2
        this.checkPhaseChange();
        this.updateShieldVisuals();
    }

    checkPhaseChange() {
        const hpPercent = (this.hp / this.maxHp) * 100;

        // Trigger Phase 2 at 50% HP (customizable)
        if (this.currentPhase === 1 && hpPercent <= 50) {
            this.transitionToPhase(2);
        }
    }

    transitionToPhase(newPhase) {
        this.currentPhase = newPhase;
        console.log(`BOSS ENTERING PHASE ${newPhase}!`);
        
        // Visual Flare: Shake the screen and flash the boss
        this.scene.cameras.main.shake(500, 0.02);
        this.scene.tweens.add({
            targets: this.sprite,
            tint: 0xff0000,
            duration: 100,
            yoyo: true,
            repeat: 5
        });

        // We can override this in specific boss files (like OgreMage.js)
        this.onPhaseChange(newPhase);
    }

    onPhaseChange(phase) {
        // Placeholder for specific boss mechanics
    }

    updateShieldVisuals() {
        // We can add a blue glowing circle around the boss here
    }
}