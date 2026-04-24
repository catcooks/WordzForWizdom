import UIHelper from "../utils/UIHelper.js";
import Misc from "../gameObjects/mechanics/Misc.js"
export class Levels extends Phaser.Scene {
  constructor() {
    super('Levels');
  }

  create() {
    const [centerX, centerY] = [this.scale.width / 2, this.scale.height / 2];
    
    this.add.image(centerX, centerY, 'map');
    const aisc = new Misc(this, centerX,centerY).setScale(10);
    const container = this.add.container(centerX, centerY);

    // Pass the description text as the 4th argument
    const start = this.createPin(0, -220, 14, "START STORY MODE", () => {
      this.scene.start('StoryMode', { parentKey: this.scene.key });
    });

    const endless = this.createPin(-centerX+100, -centerY+200, 11, "ENDLESS BATTLE", () => {
      this.scene.start('Game', { parentKey: this.scene.key });
    });
    const castle = this.createPin(155, 0, 4, "CASTLE", () => {
      console.log("Castle level clicked!");
    });
    const autumnForest = this.createPin(-150, -150, 0, "AUTUMN FOREST", () => {
      console.log("Autumn Forest level clicked!");
    });
    const wither = this.createPin(-150, 100, 12, "WITHER LANDS", () => {
      console.log("Wither level clicked!");
    });
    
    container.add([start, endless, castle, autumnForest, wither]);
  }
  createPin(x, y, frame, descText, callback) {
    const pinContainer = this.add.container(x, y);

    const pin = this.add.sprite(0, 0, 'map-pins', frame)
      .setOrigin(0.5)
      .setScale(0.5)
      .setInteractive({ useHandCursor: true });
      
    const description = UIHelper.createDescription(this, 80, -30, 400, 100, descText);
    description.setScale(0.5).setAlpha(0).setDepth(10);

    // --- 1. YOUR FLOATING ANIMATION (Restored) ---
    this.tweens.add({
      targets: pin,
      y: -15,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // --- 2. INTERACTION LOGIC ---
    pin.on('pointerover', () => {
      pin.setTint(0xcccccc);
      this.tweens.add({ targets: pin, scale: 0.6, duration: 200 });

      this.tweens.add({
        targets: description,
        alpha: 1,
        y: -110, // Float slightly higher than the pin's peak
        duration: 200
      });
    });

    pin.on('pointerout', () => {
      pin.clearTint();
      this.tweens.add({ targets: pin, scale: 0.5, duration: 200 });

      this.tweens.add({
        targets: description,
        alpha: 0,
        y: -80,
        duration: 200
      });
    });

    pin.on('pointerdown', () => {
      this.sound.play('sfx-coin');
      callback();
    });

    pinContainer.add([pin, description]);
    return pinContainer;
  }

}