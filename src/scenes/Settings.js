import UIHelper from "../utils/UIHelper.js";

export class Settings extends Phaser.Scene {
  constructor() {
    super('Settings');
  }

  create(data) {
    const parentKey = data.parentKey;
    const { width, height } = this.scale;
    const offsetX = width / 2;
    const offsetY = height / 2;
    
    this.add.rectangle(offsetX, offsetY, width, height, 0x000000, 0.5);
    this.settingsContainer = this.add.container(offsetX, offsetY);
    const settingsBg = this.add.image(0, 0, 'paper').setOrigin(0.5);

    // 1. Close Button
    const closeBtn = UIHelper.createButton(this, 370, -230, 6, 0.2, () => {
      if (parentKey) this.scene.resume(parentKey);
      this.scene.stop();
    });

    // 2. Full Screen Row
    const fullScreen = UIHelper.createSettingRow(this, -250, -200, 12, 0.2, 'Full Screen', () => {
      this.scale.isFullscreen ? this.scale.stopFullscreen() : this.scale.startFullscreen();
    });

    // 3. Sound Row
    let isMuted = this.sound.mute;
    const sound = UIHelper.createSettingRow(this, -250, -140, isMuted ? 13 : 10, 0.2, 'Sound', () => {
      isMuted = !isMuted;
      this.sound.mute = isMuted;
      // Find the icon inside the row container to change the frame
      const btnContainer = sound.list[1]; 
      const icon = btnContainer.getByName('icon');
      icon.setFrame(isMuted ? 13 : 10);
    });

    // 4. Share Row
    const share = UIHelper.createSettingRow(this, -250, -80, 9, 0.2, 'Share', () => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://catcooks.github.io/WordzForWizdom/')}`, '_blank');
    });

    this.settingsContainer.add([settingsBg, closeBtn, fullScreen, sound, share]);
  }
}