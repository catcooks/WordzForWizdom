
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

    execute(character, target, index, length, multiplier) {
        const isFirst = (index === 0);
        // If it's the first letter, it does 30 base damage instead of 15
        const damageAmount = isFirst ? 30 : 15;

        return {
            damage: damageAmount,
            isCritical: isFirst, // This triggers the yellow text in handleAttack
            isUsed: true
        };
    }
}



export class HealLetter extends Letter {
    execute(character, target, index, wordLength) {

        if (index === 0) {
            const manaCost = 5 * (Math.round(wordLength / 2));
            const currentMp = character.Mp || 0;


            if (currentMp >= manaCost) {
                const healAmount = 10 * (Math.round(wordLength / 2));


                character.Mp -= manaCost;


                character.hp = Math.min(character.hp + healAmount, character.maxHp);

                if (character.onHealed) character.onHealed(healAmount);

                return { damage: 0, cancelAttack: true, isUsed: true };
            }
        }
        return { damage: 5, cancelAttack: false, isUsed: false };
    }
}

export class ShieldLetter extends Letter {
    execute(character, target, index, wordLength) {
        if (index === 0) {
            const manaCost = 5 * (Math.round(wordLength / 2));
            const currentMp = character.Mp || 0;
            if (currentMp >= manaCost) {
                const currentShield = character.shield || 0;
                const maxLimit = character.maxShield || 50;
                const shieldAmount = 25 * (Math.round(wordLength / 4));

                
                character.shield = Math.min(currentShield + shieldAmount, maxLimit);
                character.Mp -= manaCost;

                if (character.onShielded) character.onShielded();

                return { damage: 0, cancelAttack: true, isUsed: true };
            }
        }
        return { damage: 5, cancelAttack: false, isUsed: false };
    }
}
export class IceLetter extends Letter {
    constructor(scene, x, y, char, data) {
        super(scene, x, y, char, data);
        this.effectType = 'ice';
    }

    execute(character, target, index, wordLength) {
        const manaCost = 10;
        if (character.Mp >= manaCost) {
            character.Mp -= manaCost;
            character.stats.updateMana();

            return {
                damage: 5,
                isUsed: true,
                // We return a RAW power value (base 3 seconds)
                freezePower: 3000, 
                cancelAttack: false
            };
        }
        character.onOutOfMana();
        return { damage: 5, isUsed: false };
    }
}


export class VoidLetter extends Letter {
    constructor(scene, x, y, char, data) {
        super(scene, x, y, char, data);
        this.effectType = 'void';
    }
}