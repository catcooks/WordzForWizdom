import UIHelper from "../utils/UIHelper.js"; // Don't forget the .js!
export class Help extends Phaser.Scene {
  constructor() {
    super('Help');
    this.currentPage = 0;
    this.contentPadding = 80;
  }

create(data) {
    const parentKey = data.parentKey;
    const { width, height } = this.scale;
    this.helpData = this.cache.json.get('helpData');

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

    this.helpContainer = this.add.container(width / 2, height / 2);
    this.helpBg = this.add.image(0, 0, 'paper').setOrigin(0.5);
    this.helpBg.setDisplaySize(width * 0.8, height * 0.9);

    // Using UIHelper now! 
    const closeBtn = UIHelper.createButton(this, this.helpBg.displayWidth / 2 - 100, -this.helpBg.displayHeight / 2 + 100, 6, 0.2, () => {
      if (parentKey) this.scene.resume(parentKey);
      this.scene.stop();
    });

    this.nextBtn = UIHelper.createButton(this, 100, this.helpBg.displayHeight / 2 - 100, 2, 0.2, () => {
      this.currentPage++;
      this.createPage();
    });

    this.prevBtn = UIHelper.createButton(this, -100, this.helpBg.displayHeight / 2 - 100, 2, 0.2, () => {
      this.currentPage--;
      this.createPage();
    }, true); // The 'true' flips the arrow!

    this.helpContainer.add([this.helpBg, closeBtn, this.nextBtn, this.prevBtn]);
    this.pageContent = this.add.container(0, 0);
    this.helpContainer.add(this.pageContent);

    this.createPage();
  }

  createPage() {
    this.pageContent.removeAll(true);
    const marginX = -this.helpBg.displayWidth / 2 + 60;
    const contentWidth = this.helpBg.displayWidth - 120;
    let currentY = -this.helpBg.displayHeight / 2 + this.contentPadding;

    
    this.prevBtn.setVisible(this.currentPage > 0);
    this.nextBtn.setVisible(this.currentPage < 2); 

    switch (this.currentPage) {
      case 0:
        this.addTitle("HOW TO PLAY", currentY);
        currentY += 60;
        this.helpData.howToPlay.steps.forEach(step => {
          const txt = this.add.text(marginX, currentY, `• ${step}`, {
            fontFamily: 'MagicFont', fontSize: '22px', color: '#5d4037', wordWrap: { width: contentWidth }
          });
          this.pageContent.add(txt);
          currentY += txt.height + 20;
        });
        break;

      case 1:
        this.addTitle("SPECIAL LETTERS", currentY);
        currentY += 60;
        const letters = [
          { name: 'FIRE', desc: this.helpData.elementalLetters.fire, color: '#ff4444' },
          { name: 'ICE', desc: 'Freezes enemies. Fire letters amplify the duration significantly!', color: '#00ffff' },
          { name: 'HEAL', desc: this.helpData.elementalLetters.heal, color: '#44ff44' },
          { name: 'SHIELD', desc: this.helpData.elementalLetters.shield, color: '#4444ff' }
        ];
        letters.forEach(l => {
          const lTxt = this.add.text(marginX, currentY, `${l.name}: `, {
            fontFamily: 'MagicFont', fontSize: '20px', color: l.color, fontStyle: 'bold'
          });
          const dTxt = this.add.text(marginX + 100, currentY, l.desc, {
            fontFamily: 'MagicFont', fontSize: '20px', color: '#5d4037', wordWrap: { width: contentWidth - 100 }
          });
          this.pageContent.add([lTxt, dTxt]);
          currentY += dTxt.height + 25;
        });
        break;

      case 2:
        this.addTitle("BATTLE MECHANICS", currentY);
        currentY += 60;
        this.helpData.mechanics.entries.forEach(m => {
          const mTitle = this.add.text(marginX, currentY, m.name, {
            fontFamily: 'MagicFont', fontSize: '22px', color: '#4e342e', fontStyle: 'bold'
          });
          const mDesc = this.add.text(marginX, currentY + 28, m.description, {
            fontFamily: 'MagicFont', fontSize: '18px', color: '#5d4037', wordWrap: { width: contentWidth }
          });
          this.pageContent.add([mTitle, mDesc]);
          currentY += mDesc.height + 40;
        });
        break;
    }
  }

  addTitle(text, y) {
    const title = this.add.text(0, y, text, {
      fontFamily: 'MagicFont', fontSize: '36px', color: '#4a2e12', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.pageContent.add(title);
  }

  createButton(x, y, frame, scale, callback, flipX = false) {
    const btnContainer = this.add.container(x, y);
    const btn = this.add.sprite(0, 0, 'button', frame)
      .setScale(scale)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    btn.setFlipX(flipX);

    btnContainer.add(btn);
    btn.on('pointerover', () => btn.setTint(0xcccccc));
    btn.on('pointerout', () => btn.setTint(0xffffffff));
    btn.on('pointerdown', () => {
      this.sound.play('sfx-coin');
      callback();
    });
    return btnContainer;
  }
}