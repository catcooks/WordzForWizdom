import UIHelper from "../utils/UIHelper.js";
import Sprite from "../sprite.js";
import DialogManager from "../utils/DialogManager.js";
import StoryManager from "../utils/StoryManager.js"; // <-- 1. Import StoryManager

export class StoryMode extends Phaser.Scene {
  constructor() {
    super('StoryMode');
  }

  create(data) {
    const parentKey = data.parentKey;
    const { width, height } = this.scale;
    const [centerX, centerY] = [width / 2, height / 2];

    // 2. Initialize the StoryManager with your JSON data
    const storyData = this.cache.json.get('storyData');
    StoryManager.init(storyData);

    const bg = this.add.image(centerX, centerY, 'bg-alchemy').setOrigin(0.5);
    bg.setScale(width / bg.width);

    const alchemist = this.add.sprite(500, 480, 'alchemist-npc', 0)
      .setScale(0.4)
      .setInteractive({ useHandCursor: true });

    // 3. Initialize DialogManager once (no progression parameter needed)
    this.dialogManager = new DialogManager(this);

    alchemist.on('pointerover', () => {
      alchemist.setTint(0xaaaaaa);
    });

    alchemist.on('pointerout', () => {
      alchemist.clearTint();
    });

    alchemist.on('pointerdown', () => {
      this.sound.play('sfx-coin');
      const node = this.dialogManager.getInteraction("archmage_cure");
      if (node) this.renderDialog(node);
      if (StoryManager.getCurrentStage("archmage_cure") === 0) {
        StoryManager.completeCurrentStage("archmage_cure");
      }
    });

    this.pot = this.add.sprite(centerX + 100, centerY + 110, 'pot', 0).setScale(0.35);
    this.back = UIHelper.createItem(this, 1330,50, Sprite.Items.Frames.Back, () => {
      this.sound.play('sfx-coin');
      this.scene.stop();

      // 2. Restart the gameplay scene
      if (parentKey) {
        this.scene.get(parentKey).scene.restart();
      } 
    });
  }

  nextStep() {
    const nextNode = this.dialogManager.nextStep();
    if (nextNode) {
      this.renderDialog(nextNode);
    } else {
      if (this.activeDialog) this.activeDialog.destroy();
    }
  }

  prevStep() {
    const prevNode = this.dialogManager.prevStep();
    // 5. Check if there actually IS a previous node before trying to render
    if (prevNode) {
      this.renderDialog(prevNode);
    }
  }

  renderDialog(node) {
    const isPlayer = node.speaker === 'Player';

    // Safety check for portrait (handles both "Neutral" string and 1 integer)
    const portraitKey = node.portrait;
    const portrait = typeof portraitKey === 'string'
      ? Sprite[node.speaker].Portrait.Frames[portraitKey]
      : portraitKey;

    const speaker = Sprite[node.speaker].Portrait.Key;

    console.log('Rendering dialog for node:', node);

    if (this.activeDialog) this.activeDialog.destroy();

    this.activeDialog = UIHelper.createDialog({
      scene: this,
      characterName: node.speaker.toUpperCase(),
      dialog: node.text,
      portraitKey: speaker,
      portraitFrame: portrait,
      isPlayer: isPlayer,
      onNext: () => this.nextStep(),
      onBack: () => this.prevStep()
    });

    this.activeDialog.setDepth(100);
  }
}