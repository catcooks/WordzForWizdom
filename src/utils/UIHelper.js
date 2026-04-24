<<<<<<< HEAD
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
=======
// src/utils/UIHelper.js
import SPRITE from "../sprite.js";
export default class UIHelper {
  static createButton(scene, x, y, frame, scale, callback, flipX = false) {
    const btnContainer = scene.add.container(x, y);
    const btn = scene.add
      .sprite(0, 0, "button", frame)
      .setScale(scale)
      .setOrigin(0.5)
      .setFlipX(flipX) // Support for arrows
      .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => btn.setTint(0xcccccc));
    btn.on("pointerout", () => btn.setTint(0xffffffff));
    btn.on("pointerdown", () => {
      scene.sound.play("sfx-coin");
      callback();
    });

    btnContainer.add(btn);
    return btnContainer;
  }

  // Since Help.js uses a lot of titles, let's add this!
  static addTitle(scene, x, y, text, container = null) {
    const title = scene.add
      .text(x, y, text, {
        fontFamily: "MagicFont",
        fontSize: "36px",
        color: "#4a2e12",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    if (container) container.add(title);
    return title;
  }
  // New: A row for the settings menu
  // Updated: A row for the settings menu
  static createSettingRow(scene, x, y, frame, scale, label, callback) {
    const container = scene.add.container(x, y);

    const title = scene.add
      .text(80, 0, label, {
        fontFamily: "MagicFont",
        fontSize: "32px",
        color: "#000000",
      })
      .setOrigin(0.5);

    // We create the button container
    const btnContainer = this.createButton(
      scene,
      -100,
      0,
      frame,
      scale,
      callback,
    );

    // IMPORTANT: Get the sprite from the button container and name it
    const iconSprite = btnContainer.list[0];
    iconSprite.setName("icon");

    // Create a direct reference on the row container for easy access
    container.settingIcon = iconSprite;

    container.add([title, btnContainer]);
    return container;
  }

  // NEW: For Main Menu buttons with text labels
  static createLargeButton(scene, x, y, label, callback) {
    const container = scene.add.container(x, y);
    const bg = scene.add
      .image(0, 0, "btn-start")
      .setScale(0.5)
      .setInteractive({ useHandCursor: true });

    const text = scene.add
      .text(0, 0, label, {
        fontFamily: "MagicFont",
        fontSize: "32px",
        color: "#ffffff",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    container.add([bg, text]);
    container.setScale(0.7);

    bg.on("pointerover", () => bg.setTint(0xcccccc));
    bg.on("pointerout", () => bg.setTint(0xffffffff));
    bg.on("pointerdown", () => {
      scene.sound.play("sfx-coin");
      callback();
    });

    return container;
  }

  // Pass 'scene' as the first parameter
  static createDialog(config) {
    const {
      scene,
      // If x or y are missing, default to the screen center
      x = scene.scale.width / 2,
      y = scene.scale.height / 2,
      characterName,
      dialog,
      portraitKey,
      portraitFrame,
      isPlayer = false,
      onNext,
      onBack,
    } = config;
    const portraitPositionX = isPlayer ? 800 : 0; // Player on the right, NPC on the left
    const textPositionX = isPlayer ? -300 : 0; // Text on the left for player, right for NPC
    const dlgContainer = scene.add.container(x, y);
    const dlg = scene.add.graphics();
    dlg.fillStyle(0xffffff, 0.2);
    dlg.fillRoundedRect(-600, -350, 1200, 500, 30);
    const portrait = scene.add.sprite(
      -400 + portraitPositionX,
      -150,
      portraitKey,
      portraitFrame,
    );
    portrait.setDisplaySize(300, 300);
    const portraitBorder = scene.add.graphics();
    portraitBorder.lineStyle(4, 0xffffff, 0.3);
    portraitBorder.strokeRoundedRect(
      -550 + portraitPositionX,
      -300,
      300,
      300,
      5,
    );
    const line = scene.add.rectangle(
      -400 + portraitPositionX,
      50,
      230,
      3,
      0x000000,
      1,
    );
    const name = scene.add
      .text(-400 + portraitPositionX, 25, characterName, {
        fontSize: "24px",
        color: "#f6f6f6",
        stroke: "#924b00",
        strokeThickness: 6,
        fontFamily: "MagicFont",
      })
      .setOrigin(0.5);
    const textDialog = scene.add
      .text(-220 + textPositionX, -300, dialog, {
        fontSize: "30px",
        color: "#f6f6f6",
        stroke: "#924b00",
        strokeThickness: 6,
        fontFamily: "MagicFont",
        wordWrap: { width: 0 + isPlayer ? 750 : 800 },
      })
      .setOrigin(0, 0);
    const next = this.textbtn(scene, 500, 90, "next", onNext);
    const back = this.textbtn(scene, 350, 90, "back", onBack);
    dlgContainer.add([
      dlg,
      portraitBorder,
      portrait,
      line,
      name,
      textDialog,
      next,
      back,
    ]);
    return dlgContainer;
  }

  static textbtn(scene, x, y, text, callback) {
    const width = 100;
    const height = 60;
    const btnContainer = scene.add.container(x, y);

    const btnBg = scene.add.graphics();
    btnBg.fillStyle(0xffffff, 0.3);
    btnBg.fillRoundedRect(-width / 2, -height / 2, width, height, 10);

    // Setup interaction
    const hitArea = new Phaser.Geom.Rectangle(
      -width / 2,
      -height / 2,
      width,
      height,
    );
    btnBg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
    const btnText = scene.add
      .text(0, 0, text, {
        fontSize: "24px",
        color: "#f6f6f6",
        stroke: "#000000",
        strokeThickness: 6,
        fontFamily: "MagicFont",
      })
      .setOrigin(0.5);
    btnBg.on("pointerover", () => btnBg.setAlpha(0.8));
    btnBg.on("pointerout", () => btnBg.setAlpha(1));
    btnBg.on("pointerdown", () => {
      scene.sound.play("sfx-coin");
      if (callback) callback();
    });

    btnContainer.add([btnBg, btnText]);
    return btnContainer;
  }

  static createDescription(scene, x, y, width, height, text) {
    const descriptionContainer = scene.add.container(x, y);
    const scale = 0.3;
    const bubble = this.createBackgroundDescription(
      scene,
      0,
      0,
      width,
      height,
      scale,
    );
    const { width: bubbleWidth, height: bubbleHeight } = bubble.getBounds();
    const paddingY = bubbleHeight - 120 - height * scale;
    const axisY = paddingY / 2 - bubbleHeight / 2;
    const paddingX = (bubbleWidth - width * scale) / 2;
    const axisX = paddingX / 2 - bubbleWidth / 2;
    const texts = scene.add.text(axisX, axisY, text, {
      fontSize: "24px",
      color: "#000000",
      fontFamily: "MagicFont",
      stroke: "#000000",
      strokeThickness: 1,
      wordWrap: { width: (500 + width) * scale - 40 },
    });
    texts.setOrigin(0, 0);
    descriptionContainer.add([bubble, texts]);
    return descriptionContainer;
  }

  static createBackgroundDescription(scene, x, y, width, height, scale = 1) {
    const bubble = scene.add.nineslice(
      x,
      y,
      "description-box",
      0,
      800 + width,
      800 + height,
      456,
      260,
      500,
      500,
    );
    bubble.setScale(scale);
    bubble.setOrigin(0.5);
    return bubble;
  }
  static createItem(scene, x, y, itemId, callBack) {
    const itemSprite = scene.add.sprite(x, y, "items", itemId);
    itemSprite.setScale(0.5).setInteractive({ useHandCursor: true });
    itemSprite.on("pointerover", () => itemSprite.setTint(0xcccccc));
    itemSprite.on("pointerout", () => itemSprite.clearTint());
    itemSprite.on("pointerdown", () => {
      scene.sound.play("sfx-coin");
      callBack();
    });
    return itemSprite;
  }
}
>>>>>>> b733ca7 (Updated files from my device)
