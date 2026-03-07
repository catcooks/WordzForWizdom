// src/utils/UIHelper.js
export default class UIHelper {
  static createButton(scene, x, y, frame, scale, callback, flipX = false) {
    const btnContainer = scene.add.container(x, y);
    const btn = scene.add.sprite(0, 0, 'button', frame)
      .setScale(scale)
      .setOrigin(0.5)
      .setFlipX(flipX) // Support for arrows
      .setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setTint(0xcccccc));
    btn.on('pointerout', () => btn.setTint(0xffffffff));
    btn.on('pointerdown', () => {
      scene.sound.play('sfx-coin');
      callback();
    });

    btnContainer.add(btn);
    return btnContainer;
  }

  // Since Help.js uses a lot of titles, let's add this!
  static addTitle(scene, x, y, text, container = null) {
    const title = scene.add.text(x, y, text, {
      fontFamily: 'MagicFont',
      fontSize: '36px',
      color: '#4a2e12',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    if (container) container.add(title);
    return title;
  }
  // New: A row for the settings menu
  static createSettingRow(scene, x, y, frame, scale, label, callback) {
    const container = scene.add.container(x, y);

    const title = scene.add.text(80, 0, label, {
      fontFamily: 'MagicFont',
      fontSize: '32px',
      color: '#000000'
    }).setOrigin(0.5);

    const btn = this.createButton(scene, -100, 0, frame, scale, callback);

    container.add([title, btn]);
    return container;
  }

  // NEW: For Main Menu buttons with text labels
  static createLargeButton(scene, x, y, label, callback) {
    const container = scene.add.container(x, y);
    const bg = scene.add.image(0, 0, 'btn-start')
      .setScale(0.5)
      .setInteractive({ useHandCursor: true });

    const text = scene.add.text(0, 0, label, {
      fontFamily: 'MagicFont',
      fontSize: '32px',
      color: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    container.add([bg, text]);
    container.setScale(0.7);

    bg.on('pointerover', () => bg.setTint(0xcccccc));
    bg.on('pointerout', () => bg.setTint(0xffffffff));
    bg.on('pointerdown', () => {
      scene.sound.play('sfx-coin');
      callback();
    });

    return container;
  }
}