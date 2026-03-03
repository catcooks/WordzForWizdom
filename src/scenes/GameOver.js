export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        const { width, height } = this.scale;
        this.container = this.add.container(width / 2, height / 2);
        this.tryAgainBtn = this.add.container(0, 115);
        this.rect = this.add.rectangle(0,0, width, height, 0x000000, 0.5);
        
        this.btnborder = this.add.image(0, 0, 'btn-long').setOrigin(0.5).setScale(0.5);
        const TryAgain = this.add.text(0, 0, 'Try again', {
            fontSize: '24px',
            color: '#f6f6f6',
            stroke: '#924b00',
            strokeThickness: 6,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.tryAgainBtn.add([this.btnborder, TryAgain]);

        
        this.tryAgainBtn.setInteractive(
            new Phaser.Geom.Rectangle(-this.btnborder.displayHeight * 2, -this.btnborder.displayHeight / 2, this.btnborder.displayWidth, this.btnborder.displayHeight),
            Phaser.Geom.Rectangle.Contains
        );

        
        this.tryAgainBtn.on('pointerover', () => {
            this.btnborder.setTint(0xeeeeee);
            this.tryAgainBtn.setScale(1.1); 
        });

        this.tryAgainBtn.on('pointerout', () => {
            this.btnborder.clearTint();
            this.tryAgainBtn.setScale(1); 
        });

        this.tryAgainBtn.on('pointerdown', () => {
            this.tryAgainBtn.setScale(0.9); 
            this.triggerTryAgain();
        });

        this.tryAgainBtn.on('pointerup', () => {
            this.tryAgainBtn.setScale(1.1);
        });
        this.tryAgainBtn.setInteractive(
            new Phaser.Geom.Rectangle(
                -this.btnborder.displayWidth / 2,
                -this.btnborder.displayHeight / 2,
                this.btnborder.displayWidth,
                this.btnborder.displayHeight
            ),
            Phaser.Geom.Rectangle.Contains
        );

        this.menuBg = this.add.image(0, 0, 'menu').setOrigin(0.5);
        this.X = this.add.image(0, 0, 'X').setOrigin(0.5).setScale(0.5);

        const title = this.add.text(0, -165, 'Game Over', {
            fontSize: '30px',
            color: '#ffffff',
            stroke: '#924b00',
            strokeThickness: 6,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        

        this.container.add([this.rect, this.menuBg, this.X, this.tryAgainBtn, title]).setScale(0);
        this.tweens.add({
            targets: this.X,
            scale: 0.6,          
            duration: 800,       
            yoyo: true,          
            repeat: -1,          
            ease: 'Sine.easeInOut' 
        });
        this.tweens.add({
            targets: this.container,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });
    }

    triggerTryAgain() {
        
        this.scene.stop('GameOver');
        this.scene.start('Game');
    }
}