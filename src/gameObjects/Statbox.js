export default class StatBox extends Phaser.GameObjects.Container {
    constructor(scene, x, y, owner) {
        super(scene, x, y);
        this.scene = scene;
        this.owner = owner;

        this.maxHp = owner.maxHp;
        this.hp = owner.hp;
        this.hearts = [];
        this.shields = []; // Separate array for shield icons
        this.iconScale = 0.15;

        this.maxMp = owner.maxMp;
        this.mp = (owner.mp !== undefined) ? owner.mp : owner.Mp;
        this.manaIcons = [];

        // 1. Create HP Board
        const hpBoardWidth = this.createHpBoard();


        if (this.owner.maxShield !== undefined) {
            // 0 = X offset, 110 = Y offset (below HP)
            this.createShieldBoard(0, 160, 0.8);
        }

        if (this.owner.maxMp !== undefined) {
            this.createManaVertical();
        }

        this.updateHealth();
        this.updateMana();
        scene.add.existing(this);
    }

    // Inside StatBox.js
    updateHealth() {
        const hp = Math.max(0, this.owner.hp);
        const shield = Math.max(0, this.owner.shield || 0);

        // --- 1. UPDATE HEARTS ---
        let tempHp = hp;
        this.hearts.forEach((heart) => {
            if (tempHp >= 10) {
                heart.setFrame(3); // Full Heart
                tempHp -= 10;
            } else if (tempHp >= 5) {
                heart.setFrame(4); // Half Heart
                tempHp -= 5;
            } else {
                heart.setFrame(5); // Empty Heart
                tempHp = 0;
            }
        });

        // --- 2. UPDATE SHIELDS ---
        let tempShield = shield;
        this.shields.forEach((shieldIcon) => {
            if (tempShield >= 10) {
                shieldIcon.setFrame(0); // Full Shield
                shieldIcon.setAlpha(1).clearTint();
                tempShield -= 10;
            } else if (tempShield >= 5) {
                shieldIcon.setFrame(1); // Half/Cracked Shield
                shieldIcon.setAlpha(1).clearTint();
                tempShield -= 5;
            } else {
                shieldIcon.setFrame(2); // Empty Shield
                shieldIcon.setAlpha(0.3).setTint(0x333333); // Dimmed empty slot
                tempShield = 0;
            }
        });
    }

    createHpBoard() {
        const boardScale = 0.2;
        const step = 50;
        const rowHeight = 45;
        const allSlices = [];

        // 1. Calculate how many hearts we need total (1 heart = 10 HP)
        const totalHearts = Math.ceil(this.maxHp / 10);

        // 2. Calculate how many COLUMNS we need (Total hearts / 2 rows)
        const totalHeartColumns = Math.ceil(totalHearts / 2);

        // 3. Board Size (End caps + Columns)
        const numCols = totalHeartColumns + 2;

        for (let i = 0; i < numCols; i++) {
            const x = i * step;
            let topFrame, midFrame, botFrame;

            if (i === 0) {
                topFrame = 0; midFrame = 8; botFrame = 12;
            } else if (i === numCols - 1) {
                topFrame = 3; midFrame = 7; botFrame = 15;
            } else {
                const isEven = (i % 2 === 0);
                topFrame = isEven ? 1 : 2;
                midFrame = isEven ? 9 : 10;
                botFrame = isEven ? 13 : 14;
            }

            allSlices.push(this.scene.add.image(x, -rowHeight, 'statbox', topFrame).setScale(boardScale));
            allSlices.push(this.scene.add.image(x, 0, 'statbox', midFrame).setScale(boardScale));
            allSlices.push(this.scene.add.image(x, rowHeight, 'statbox', botFrame).setScale(boardScale));
        }

        this.add(allSlices);
        allSlices.forEach(s => this.sendToBack(s));

        // 4. Centering and Placing Individual Hearts
        const boardWidth = (numCols - 1) * step;
        const heartGroupWidth = (totalHeartColumns - 1) * step;
        const heartStartX = (boardWidth - heartGroupWidth) / 2;

        // Inside your heart placement loop in createBoard
        let remainingHp = this.hp; // Start with current HP

        for (let i = 0; i < totalHearts; i++) {
            const colIndex = Math.floor(i / 2);
            const x = heartStartX + (colIndex * step);
            const yOffset = (i % 2 === 0) ? -20 : 20;

            // Determine value: 10 for full, 5 for half, 0 for empty
            let heartValue = 0;
            if (remainingHp >= 10) {
                heartValue = 10;
                remainingHp -= 10;
            } else if (remainingHp >= 5) {
                heartValue = 5;
                remainingHp -= 5;
            }

            this.addHeart(x, yOffset, heartValue);
        }
        return (numCols - 1) * step;
    }
    createShieldBoard(startXOffset, yOffset = 0, masterScale = 1) {
        // All base values are now multiplied by masterScale
        const boardScale = 0.2 * masterScale;
        const step = 50 * masterScale;
        const rowHeight = 40 * masterScale;
        const iconScale = 0.18 * masterScale; // Default shield size scaled
        const iconGap = 60 * masterScale;
        const allSlices = [];
        const totalShieldIcons = Math.ceil(this.owner.maxShield / 10);
        const totalCols = totalShieldIcons + 2;

        for (let i = 0; i < totalCols; i++) {
            const x = startXOffset + (i * step);
            let topFrame, midFrame, botFrame;

            // ... [Frame logic remains same] ...
            if (i === 0) {
                topFrame = 0; midFrame = 8; botFrame = 12;
            } else if (i === totalCols - 1) {
                topFrame = 3; midFrame = 7; botFrame = 15;
            } else {
                const isEven = (i % 2 === 0);
                topFrame = isEven ? 1 : 2; midFrame = isEven ? 9 : 10; botFrame = isEven ? 13 : 14;
            }

            // The background pieces now scale and position based on masterScale
            allSlices.push(this.scene.add.image(x, yOffset - rowHeight, 'statbox', topFrame).setScale(boardScale));
            allSlices.push(this.scene.add.image(x, yOffset, 'statbox', midFrame).setScale(boardScale));
            allSlices.push(this.scene.add.image(x, yOffset + rowHeight, 'statbox', botFrame).setScale(boardScale));
        }

        this.add(allSlices);
        allSlices.forEach(s => this.sendToBack(s));

        // Shield Icons
        for (let i = 0; i < totalShieldIcons; i++) {
            // We multiply the offset (50) by masterScale so they stay centered
            const x = startXOffset + step + (i * iconGap)-10;
            const y = yOffset;

            const shieldIcon = this.scene.add.sprite(x, y, 'icon-shield', 1)
                .setScale(iconScale);

            shieldIcon.initialX = x;
            shieldIcon.initialY = y;

            this.shields.push(shieldIcon);
            this.add(shieldIcon);
        }
    }


    addShield(x, y, value) {
        let frame = 1; // Default Full Heart

        if (value === 5) {
            frame = 2; // Set this to your half-heart frame index
        } else if (value === 0) {
            frame = 3; // Set this to your empty heart frame index
        }

        const heart = this.scene.add.sprite(x, y, 'icon-Shield', frame).setScale(this.iconScale);
        heart.initialX = x;
        heart.initialY = y;
        heart.value = value; // Store the value so you can update it later

        this.hearts.push(heart);
        this.add(heart);
    }
    addHeart(x, y, value) {
        let frame = 1; // Default Full Heart

        if (value === 5) {
            frame = 2; // Set this to your half-heart frame index
        } else if (value === 0) {
            frame = 3; // Set this to your empty heart frame index
        }

        const heart = this.scene.add.sprite(x, y, 'icon-heart', frame).setScale(this.iconScale);
        heart.initialX = x;
        heart.initialY = y;
        heart.value = value; // Store the value so you can update it later

        this.hearts.push(heart);
        this.add(heart);
    }



    shatterHeart(heart) {
        this.scene.tweens.killTweensOf(heart);
        this.scene.tweens.add({
            targets: heart,
            x: heart.initialX + (Math.random() * 6 - 3),
            yoyo: true,
            repeat: 5,
            duration: 50,
            onStart: () => heart.setTint(0x000000),
            onComplete: () => heart.x = heart.initialX
        });

        this.scene.tweens.add({
            targets: heart,
            scale: 0.5,
            duration: 300,
            ease: 'Back.easeIn'
        });
    }
    createManaVertical() {
        const totalManaIcons = this.maxMp / 10;
        const verticalStep = 50; // Spaced out as requested
        const boardScale = 0.2;

        const startX = 20;
        const startY = 775;

        const boardX = [startX - 20, startX, startX + 20];
        const iconHeight = totalManaIcons * verticalStep;
        const midCount = totalManaIcons - 1;

        const topY = startY - iconHeight - 15;
        this.add(this.scene.add.image(boardX[0], topY, 'statbox', 0).setScale(boardScale));
        this.add(this.scene.add.image(boardX[1], topY, 'statbox', 1).setScale(boardScale));
        this.add(this.scene.add.image(boardX[2], topY, 'statbox', 3).setScale(boardScale));

        // --- MIDDLE PIECES (Frames 4, 6, 7) ---
        for (let m = 0; m <= midCount; m++) {
            const midY = (startY - 15) - (m * verticalStep);
            this.add(this.scene.add.image(boardX[0], midY, 'statbox', 4).setScale(boardScale));
            this.add(this.scene.add.image(boardX[1], midY, 'statbox', 6).setScale(boardScale)); // Middle Column
            this.add(this.scene.add.image(boardX[2], midY, 'statbox', 7).setScale(boardScale));
        }

        // --- BOTTOM PIECES (Frames 12, 14, 15) ---
        const botY = startY + 20;
        this.add(this.scene.add.image(boardX[0], botY, 'statbox', 12).setScale(boardScale));
        this.add(this.scene.add.image(boardX[1], botY, 'statbox', 14).setScale(boardScale)); // Middle Column
        this.add(this.scene.add.image(boardX[2], botY, 'statbox', 15).setScale(boardScale));

        // 2. MANA ICONS (Gems)
        for (let i = 0; i < totalManaIcons; i++) {
            const y = startY - (i * verticalStep) - 20;

            // Position icons exactly on the Middle Column (boardX[1])
            const manaIcon = this.scene.add.sprite(startX, y, 'icon-mana', 0)
                .setScale(this.iconScale);

            manaIcon.initialX = startX;
            manaIcon.initialY = y;

            this.manaIcons.push(manaIcon);
            this.add(manaIcon);
            this.bringToTop(manaIcon);
        }
    }



    updateMana() {
        if (this.manaIcons.length === 0) return;

        const oldMp = this.mp;
        this.mp = (this.owner.mp !== undefined) ? this.owner.mp : this.owner.Mp;

        this.manaIcons.forEach((icon, index) => {
            const manaValue = (index + 1) * 10;

            // MANA IS FULL
            if (this.mp >= manaValue) {
                // Kill any "draining" tweens if mana is regained suddenly
                this.scene.tweens.killTweensOf(icon);
                icon.setAlpha(1).setScale(this.iconScale).clearTint();
            }
            // MANA IS EMPTY
            else {
                // 1. Only start the animation if it just became empty
                if (oldMp >= manaValue && this.mp < manaValue) {
                    this.scene.tweens.add({
                        targets: icon,
                        scale: this.iconScale * 1.5,
                        duration: 100,
                        yoyo: true,
                        onStart: () => icon.setTint(0x000000).setAlpha(0.6), // Tint immediately
                        onComplete: () => {
                            icon.setScale(this.iconScale); // Return to standard scale
                        }
                    });
                }
                // 2. If it's already empty and not animating, keep it dark
                else if (!this.scene.tweens.isTweening(icon)) {
                    icon.setTint(0x000000).setAlpha(0.6).setScale(this.iconScale);
                }
            }
        });
    }
}









/*
0  1  2  3
4  5  6  7
8  9  10 11
12 13 14 15
*/
