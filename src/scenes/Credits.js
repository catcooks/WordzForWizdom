import UIHelper from "../utils/UIHelper.js";
export class Credits extends Phaser.Scene {
  constructor() {
    super('Credits');
  }

  create() {
    const { width, height } = this.scale;

    // 1. Background (Reuse your magic paper or a dark scroll)
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

    const paper = this.add.image(width / 2, height / 2, 'paper');
    paper.setDisplaySize(width * 0.8, height * 0.9);

    // 2. The Credits Text
    const creditText = [
      "VICTORY",
      "",
      "A Game Developed By",
      "Javer D Benito",
      "",
      "Assets ",
      "from Pinterest",
      "Gemini",
      "itch.io",
      "",
      "Music",
      "Time for Adventure",
      "",
      "Special Thanks",
      "The #LearningToCode community",
      "",
      "THANK YOU FOR PLAYING!"
    ];

    // Create a container for the text to move it all at once
    const textContainer = this.add.container(width / 2, height + 50);

    let lastY = 0;
    creditText.forEach((line) => {
      const isTitle = line === "VICTORY" || line === "THANK YOU FOR PLAYING!";
      const txt = this.add.text(0, lastY, line, {
        fontFamily: 'MagicFont',
        fontSize: isTitle ? '48px' : '24px',
        color: '#4a2e12',
        align: 'center'
      }).setOrigin(0.5);

      textContainer.add(txt);
      lastY += 50;
    });

    // 3. The Scrolling Animation
    this.tweens.add({
      targets: textContainer,
      y: -lastY, // Move it off the top of the screen
      duration: 10000, // 10 seconds
      onComplete: () => {
        // Add a "Back to Menu" button at the very end
        this.createReturnButton(width / 2, height / 2);
      }
    });

    UIHelper.createButton(this, (width / 2) + 400, (height / 2) - 220, 6, 0.2, () => {
      this.scene.start('Start'); // Fixed the lowercase 's' in start!
    });
  }

  createReturnButton(x, y) {
    const btn = this.add.text(x, y, "RETURN TO MENU", {
      fontFamily: 'MagicFont',
      fontSize: '32px',
      backgroundColor: '#4a2e12',
      padding: { x: 20, y: 10 }
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('Start'));
  }
}