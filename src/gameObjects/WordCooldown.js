export default class CoolDown extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.scene = scene;
    this.maxVisible = 5;
    this.cooldowns = new Map();

    // 1. Set Origin to (0.5, 1) - This means the "anchor" is at the BOTTOM center.
    // As height increases, the top edge moves UP.
    this.bg = scene.add.rectangle(0, 0, 200, 40, 0x000000, 0.5).setOrigin(0.5, 1);
    this.add(this.bg);

    // Position the arrow at the TOP now
    this.moreIcon = scene.add.text(0, -50, "▲", { fontSize: '20px', color: '#ffffff' }).setOrigin(0.5);
    this.moreIcon.setVisible(false);
    this.add(this.moreIcon);

    scene.add.existing(this);
  }

  reorganizeLabels() {
    const count = this.cooldowns.size;
    const visibleCount = Math.min(count, this.maxVisible);

    // 2. Update Height - it grows UP because the origin is at the bottom (1)
    const rowHeight = 30;
    const padding = 10;
    const newHeight = padding + (visibleCount * rowHeight);
    this.bg.setSize(200, newHeight)

    // 3. Position words starting from the bottom and going UP
    let i = 0;
    this.cooldowns.forEach((data) => {
      if (i < this.maxVisible) {
        data.textObj.setVisible(true);
        // We subtract from the Y coordinate to move up
        data.textObj.y = -20 - (i * rowHeight);
      } else {
        data.textObj.setVisible(false);
      }
      i++;
    });

    // 4. Move the "More" arrow to the top of the stack
    if (count > this.maxVisible) {
      this.moreIcon.setVisible(true);
      this.moreIcon.y = -20 - (this.maxVisible * rowHeight);
    } else {
      this.moreIcon.setVisible(false);
    }
  }


  addWord(word, duration) {
    if (this.cooldowns.has(word)) return;

    const textObj = this.scene.add.text(0, 0, word.toUpperCase(), {
      fontFamily: 'MagicFont',
      fontSize: '18px',
      color: '#ff4444'
    }).setOrigin(0.5);

    this.add(textObj);

    const endTime = this.scene.time.now + duration;
    this.cooldowns.set(word, { textObj, endTime });

    this.reorganizeLabels(); // Update UI immediately

    this.scene.time.delayedCall(duration, () => {
      this.removeWord(word);
    });
  }

  removeWord(word) {
    const data = this.cooldowns.get(word);
    if (data) {
      data.textObj.destroy();
      this.cooldowns.delete(word);
      this.reorganizeLabels();
    }
  }

  isWordLocked(word) {
    return this.cooldowns.has(word.toLowerCase());
  }
}