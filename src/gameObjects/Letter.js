// Base Letter Class - Add "export" here!
export class Letter extends Phaser.GameObjects.Container {
    constructor(scene, x, y, char, effect) {
        super(scene, x, y);
        this.scene = scene;
        this.char = char;
        this.effectType = effect.name;
        this.baseColor = effect.color;

        this.bg = scene.add.circle(0, 0, 35, this.baseColor)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(2, 0xffffff);

        this.textRef = scene.add.text(0, 0, char, {
            fontFamily: 'MagicFont', fontSize: '32px', color: '#ffffff'
        }).setOrigin(0.5);

        this.add([this.bg, this.textRef]);
    }
}

export class FireLetter extends Letter {
    constructor(scene, x, y, char, data) {
        super(scene, x, y, char, data);
        this.effectType = 'fire';
    }

    // FireLetter.js
    // Match the order: character, target, index, length
    execute(character, target, index, length) {
        const isFirst = (index === 0);
        const damageAmount = isFirst ? 30 : 15;

        return {
            damage: damageAmount,
            isCritical: isFirst,
            isUsed: true // Added this so effectsFound.push works!
        };
    }

}

// Inside Letter.js

export class HealLetter extends Letter {
    execute(character, target, index, wordLength) {
        // ONLY ACTIVATE IF FIRST
        if (index === 0) {
            const manaCost = 10 * (Math.round(wordLength / 2));
            const currentMp = character.Mp || 0;

            // --- CHECK FOR MANA ---
            if (currentMp >= manaCost) {
                const healAmount = 10 * (Math.round(wordLength / 2));

                // Deduct Mana
                character.Mp -= manaCost;

                // Apply Heal with Max HP limit
                character.hp = Math.min(character.hp + healAmount, character.maxHp);

                if (character.onHealed) character.onHealed(healAmount);

                return { damage: 0, cancelAttack: true, isUsed: true };
            }

            // If mana is insufficient, it skips this block and does damage below
        }

        // Normal attack if not first letter OR if mana was too low
        return { damage: 5, cancelAttack: false, isUsed: false };
    }
}

export class IceLetter extends Letter {
    execute(character, target, index, wordLength) {
        if (index === 0) {
            const manaCost = 10 * (Math.round(wordLength / 2));
            const currentMp = character.Mp || 0;
            if (currentMp >= manaCost) {
                const currentShield = character.shield || 0;
                const maxLimit = character.maxShield || 50;
                const shieldAmount = 25 * (Math.round(wordLength / 4));

                // Apply Shield and Deduct Mana
                character.shield = Math.min(currentShield + shieldAmount, maxLimit);
                character.Mp -= manaCost;

                if (character.onShielded) character.onShielded();

                return { damage: 0, cancelAttack: true, isUsed: true };
            }
        }

        // If it's not the first letter OR not enough mana, do standard damage
        return { damage: 5, cancelAttack: false, isUsed: false };
    }
}

export class VoidLetter extends Letter {
    constructor(scene, x, y, char, data) {
        super(scene, x, y, char, data);
        this.effectType = 'void';
    }
}