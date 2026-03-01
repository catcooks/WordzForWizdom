export class Settings extends Phaser.Scene {
  constructor() {
    super('Settings');
  }

  create() {
    const { width, height } = this.scale;
    const offsetX = width / 2;
    const offsetY = height / 2;
    const btnScale = 0.2;
    this.rect = this.add.rectangle(offsetX, offsetY, width, height, 0x000000, 0.5);
    this.settingsContainer = this.add.container(offsetX, offsetY);
    const settingsBg = this.add.image(0, 0, 'paper').setOrigin(0.5);
    const closeBtn = this.createButton(370, -230, 6, btnScale, () => {
      this.scene.stop();
    });
    const fullScreen = this.createSettings(-250, -200, 12, btnScale, 'Full Screen', () => {
      if (!this.scale.isFullscreen) {
        this.scale.startFullscreen();
      } else {
        this.scale.stopFullscreen();
      }
    });
    // 1. Track the state (true for on, false for off)
    let isMuted = this.sound.mute;

    const sound = this.createSettings(-250, -140, isMuted ? 13 : 10, btnScale, 'sound', () => {
      isMuted = !isMuted;
      this.sound.mute = isMuted;
      const icon = sound.list[1].getByName('icon');
      icon.setFrame(isMuted ? 13 : 10);
    });
    const share = this.createSettings(-250, -80, 9, btnScale, ' share', () => {
      const gameUrl = 'https://catcooks.github.io/WordzForWizdom/';
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(gameUrl)}`;

      window.open(shareUrl, '_blank');
    });
    this.settingsContainer.add([
      settingsBg,
      closeBtn,
      fullScreen,
      sound,
      share,
    ]);

  }


  createButton(x, y, frame, scale, callback) {
    const btnContainer = this.add.container(x, y);
    const btn = this.add.sprite(0, 0, 'button', frame)
      .setScale(scale)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    btn.setName('icon');
    btnContainer.add(btn);
    btn.on('pointerover', () => btn.setTint(0xcccccc));
    btn.on('pointerout', () => btn.setTint(0xffffffff));
    btn.on('pointerdown', () => {
      this.sound.play('sfx-coin');
      callback();
    });
    return btnContainer;
  }
  createSettings(x, y, frame, scale, label, callback) {
    const slot = this.add.container(x, y);
    const title = this.add.text(80, 0, label, {
      fontFamily: 'MagicFont',
      fontSize: '32px',
      color: '#000000',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    const btn = this.createButton(-100, 0, frame, scale, callback);
    slot.add([title, btn]);
    return slot;
  }

}