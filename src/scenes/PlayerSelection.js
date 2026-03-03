export class PlayerSelection extends Phaser.Scene {
  constructor() {
    super('PlayerSelection');
  }

  create() {
    const { width, height } = this.scale;
    const bg = this.add.image(width / 2, 0, 'bg-alchemy').setOrigin(0.5, 0);
    const scaleX = width / bg.width;
    bg.setScale(scaleX);
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.4);
    const alchemist = this.add.sprite(300, 600, 'alchemist-front', 0).setScale(1);



    this.mageContainer = this.add.container(width / 2, height / 2);
    const portrait = this.add.image(-5, -60, 'border-portrait').setScale(0.5);


    const mageBtn = this.add.sprite(0, 0, 'mage-front', 0)
      .setInteractive()
      .setScale(0.4);
    this.mageContainer.add([portrait, mageBtn]);
    this.mageContainer.setScale(0.6);
    mageBtn.on('pointerdown', () => {
      this.scene.start('Game', { level: 1, playerType: 'Mage' });
    });
    mageBtn.on('pointerover', () => {
      mageBtn.setTint(0x00ff00);
      this.mageContainer.setScale(0.65); 
    });

    mageBtn.on('pointerout', () => {
      mageBtn.clearTint();
      this.mageContainer.setScale(0.6);
    });
  }
}