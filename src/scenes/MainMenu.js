import UIHelper from "../utils/UIHelper.js";
export class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create(data) {
    const parentKey = data.parentKey;
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;
    const overlay = this.add.rectangle(centerX, centerY, width, height, 0x000000, 0);
    this.tweens.add({
      targets: overlay,
      fillAlpha: 0.5,
      duration: 200
    });


    overlay.setInteractive();


    this.mainMenuContainer = this.add.container(centerX, centerY);
    const mainMenuBg = this.add.image(0, 0, 'paper').setOrigin(0.5);


    mainMenuBg.setScale(0.8);


    const startY = -60;
    const spacing = 80;

    const settings = UIHelper.createLargeButton(this, 0, startY, 'SETTINGS', () => {
      this.mainMenuContainer.setVisible(false);
      overlay.setVisible(false);
      this.scene.pause();
      this.scene.launch('Settings', { parentKey: this.scene.key });
    });
    const restart = UIHelper.createLargeButton(this, 0, startY + (spacing * 2), 'RESTART', () => {
      // 1. Stop this menu
      this.scene.stop();

      // 2. Restart the gameplay scene
      if (parentKey) {
        this.scene.get(parentKey).scene.restart();
      }
    });

    const help = UIHelper.createLargeButton(this, 0, startY + spacing, 'HELP', () => {
      this.mainMenuContainer.setVisible(false);
      overlay.setVisible(false);
      this.scene.pause();
      this.scene.launch('Help', { parentKey: this.scene.key });
    });
    this.events.on('resume', () => {
      overlay.setVisible(true);
      this.mainMenuContainer.setVisible(true);
    });

    const play = UIHelper.createButton(this, 0, startY + (spacing * 2), 1, 0.2, () => {
      if (parentKey) this.scene.resume(parentKey);
      this.scene.stop();
    });


    const closeBtn = UIHelper.createButton(this, 300, -200, 6, 0.2, () => {
      if (parentKey) this.scene.resume(parentKey);
      this.scene.stop();
    });

    const title = this.add.text(0, -180, 'MAIN MENU', {
      font: 'bold 42px Arial',
      fill: '#5d4037'
    }).setOrigin(0.5);

    this.mainMenuContainer.add([mainMenuBg, title, settings, help, play, restart, closeBtn]);


    this.tweens.add({
      targets: this.mainMenuContainer,
      scale: 1,
      duration: 400,
      ease: 'Back.easeOut'
    });
  }

  closeMenu(parentKey) {
    this.tweens.add({
      targets: this.mainMenuContainer,
      scale: 0,
      duration: 200,
      onComplete: () => {
        if (parentKey) this.scene.resume(parentKey);
        this.scene.stop();
      }
    });
  }
}