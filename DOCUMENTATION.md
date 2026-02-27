
    createBoard() {
        const segmentWidth = 50;
        const verticalSpacing = 40;
        const totalSegments = this.maxHp / 20;

        // Now we just start at 0 (local to the container) 
        // and build to the right.
        for (let i = 0; i < totalSegments; i++) {
            let frame = 1;
            if (i === 0) frame = 0;
            if (i === totalSegments - 1) frame = 4;

            const segmentX = i * segmentWidth;

            // 1. Board Slice
            const boardPiece = this.scene.add.image(segmentX, 0, 'statbox', frame);
            this.add(boardPiece);
            this.sendToBack(boardPiece);

            // 2. Vertical Hearts
            for (let j = 0; j < 2; j++) {
                const heartY = -15 + (j * verticalSpacing);
                const heart = this.scene.add.sprite(segmentX, heartY, 'icon-stats', 1)
                    .setScale(0.8);

                this.hearts.push(heart);
                this.add(heart);
            }
        }
    } 