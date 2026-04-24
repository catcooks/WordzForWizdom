import Sprite from '../../sprite.js';

export default class Misc extends Phaser.GameObjects.Container {
    constructor(scene, x,y) {
        super(screen,x,y);
        this.scene = scene;
        
        //add code here
        this.createUI(scene);
        scene.add.existing(this);
    }
    createUI(scene){
      const{width,height}=scene.scale;
      this.object=scene.add.sprite(0,0,Sprite.Items.key,Sprite.Items.Message);
    }
      
}